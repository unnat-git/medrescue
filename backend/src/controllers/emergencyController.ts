import { Request, Response } from 'express';
import db from '../db';
import { calculateDistance } from '../utils/distance';

export const requestEmergency = async (req: Request, res: Response): Promise<void> => {
  try {
    const { patient_id, latitude, longitude, phone_number } = req.body;

    if (!latitude || !longitude) {
      res.status(400).json({ message: 'Latitude and longitude are required' });
      return;
    }

    // 1. Create emergency request
    const requestResult = await db.query(
      `INSERT INTO emergency_requests (patient_id, latitude, longitude, phone_number, status) 
       VALUES ($1, $2, $3, $4, 'pending') RETURNING *`,
      [patient_id || null, latitude, longitude, phone_number]
    );
    const newRequest = requestResult.rows[0];

    // 2. Find nearest available ambulance
    const ambulancesResult = await db.query(`SELECT * FROM ambulances WHERE status = 'available'`);
    const ambulances = ambulancesResult.rows;

    if (ambulances.length === 0) {
      res.status(404).json({ message: 'No ambulances available right now', request: newRequest });
      return;
    }

    let nearestAmbulance = ambulances[0];
    let minDistance = calculateDistance(latitude, longitude, ambulances[0].latitude, ambulances[0].longitude);

    for (let i = 1; i < ambulances.length; i++) {
      const dist = calculateDistance(latitude, longitude, ambulances[i].latitude, ambulances[i].longitude);
      if (dist < minDistance) {
        minDistance = dist;
        nearestAmbulance = ambulances[i];
      }
    }

    // 3. Assign ambulance
    await db.query(`UPDATE emergency_requests SET ambulance_id = $1, status = 'assigned' WHERE id = $2`, [nearestAmbulance.id, newRequest.id]);
    await db.query(`UPDATE ambulances SET status = 'busy' WHERE id = $1`, [nearestAmbulance.id]);

    const assignedRequest = { ...newRequest, ambulance_id: nearestAmbulance.id, status: 'assigned' };

    res.status(200).json({
      message: 'Ambulance assigned successfully',
      request_id: assignedRequest.id,
      assigned_ambulance: nearestAmbulance,
      status: 'assigned',
      eta: Math.round(minDistance * 2), // Rough estimate: 2 mins per km
    });
  } catch (error) {
    console.error('Error requesting emergency:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
