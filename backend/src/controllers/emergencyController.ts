import { Request, Response } from 'express';
import db from '../db';
import { calculateDistance } from '../utils/distance';

export const requestEmergency = async (req: Request, res: Response): Promise<void> => {
  try {
    const { patient_id, latitude, longitude, phone_number, pincode } = req.body;

    if (!latitude || !longitude) {
      res.status(400).json({ message: 'Latitude and longitude are required' });
      return;
    }

    // 1. Create emergency request
    const requestResult = await db.query(
      `INSERT INTO emergency_requests (profile_id, latitude, longitude, phone_number, status) 
       VALUES ($1, $2, $3, $4, 'pending') RETURNING *`,
      [patient_id || null, latitude, longitude, phone_number]
    );
    const newRequest = requestResult.rows[0];

    // 2. Find nearest available ambulance within 10km or matching pincode
    const ambulancesResult = await db.query(`
      SELECT * FROM ambulances 
      WHERE status = 'available' 
      AND (service_area_pincode = $1 OR service_area_pincode IS NULL)
    `, [pincode]);
    
    let ambulances = ambulancesResult.rows;

    // If no pincode matches, search all available
    if (ambulances.length === 0) {
      const allAvailable = await db.query(`SELECT * FROM ambulances WHERE status = 'available'`);
      ambulances = allAvailable.rows;
    }

    if (ambulances.length === 0) {
      res.status(200).json({ 
        message: 'No ambulance available nearby. Please try again or contact the nearest hospital.', 
        request: newRequest,
        status: 'no_ambulance'
      });
      return;
    }

    let nearestAmbulance = null;
    let minDistance = Infinity;

    for (const amb of ambulances) {
      const dist = calculateDistance(latitude, longitude, amb.latitude, amb.longitude);
      // Maximum search radius: 10km
      if (dist < minDistance && dist <= 10) {
        minDistance = dist;
        nearestAmbulance = amb;
      }
    }

    if (!nearestAmbulance) {
        res.status(200).json({ 
          message: 'No ambulance available nearby. Please try again or contact the nearest hospital.', 
          request: newRequest,
          status: 'no_ambulance'
        });
        return;
    }

    // 3. Assign ambulance
    await db.query(`UPDATE emergency_requests SET ambulance_id = $1, status = 'assigned' WHERE id = $2`, [nearestAmbulance.id, newRequest.id]);
    await db.query(`UPDATE ambulances SET status = 'busy' WHERE id = $1`, [nearestAmbulance.id]);

    res.status(200).json({
      message: 'Ambulance assigned successfully',
      request_id: newRequest.id,
      assigned_ambulance: {
        id: nearestAmbulance.id,
        driver_name: nearestAmbulance.driver_name,
        phone_number: nearestAmbulance.phone_number,
        ambulance_number: nearestAmbulance.ambulance_number,
        latitude: nearestAmbulance.latitude,
        longitude: nearestAmbulance.longitude
      },
      status: 'assigned',
      eta: Math.max(2, Math.round(minDistance * 2)), // Minimum 2 mins
    });
  } catch (error) {
    console.error('Error requesting emergency:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
