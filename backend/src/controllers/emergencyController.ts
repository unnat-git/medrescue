import { Response } from 'express';
import db from '../db';
import { calculateDistance } from '../utils/distance';
import { AuthRequest } from '../utils/authMiddleware';

export const requestEmergency = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { latitude, longitude, phone_number, pincode } = req.body;
    const user = req.user;

    if (!user) {
      res.status(401).json({ success: false, message: 'User authentication required' });
      return;
    }

    if (!latitude || !longitude) {
      res.status(400).json({ success: false, message: 'Latitude and longitude are required' });
      return;
    }

    // 0. Get profile_id for this user
    const profileResult = await db.query('SELECT id FROM medical_profiles WHERE user_id = $1', [user.id]);
    const profile_id = profileResult.rows.length > 0 ? profileResult.rows[0].id : null;

    // 1. Create emergency request
    const requestResult = await db.query(
      `INSERT INTO emergency_requests (profile_id, latitude, longitude, phone_number, status) 
       VALUES ($1, $2, $3, $4, 'pending') RETURNING *`,
      [profile_id, latitude, longitude, phone_number]
    );
    const newRequest = requestResult.rows[0];

    // 2. Find nearest available ambulance within 10km or matching pincode
    // Optimized query to filter busy drivers early
    const ambulancesResult = await db.query(`
      SELECT * FROM ambulances 
      WHERE status = 'available' 
      AND (service_area_pincode = $1 OR service_area_pincode IS NULL)
    `, [pincode]);
    
    let ambulances = ambulancesResult.rows;

    // If no pincode matches or found, search all available
    if (ambulances.length === 0) {
      const allAvailable = await db.query(`SELECT * FROM ambulances WHERE status = 'available'`);
      ambulances = allAvailable.rows;
    }

    if (ambulances.length === 0) {
      console.log(`[SOS] No available ambulances found for user ${user.id}`);
      res.status(200).json({ 
        success: false,
        message: 'No ambulance available nearby. Please try self transport or contact a hospital.', 
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
        console.log(`[SOS] No ambulance within 10km for user ${user.id}`);
        res.status(200).json({ 
          success: false,
          message: 'No ambulance available nearby. Please try self transport or contact a hospital.', 
          request: newRequest,
          status: 'no_ambulance'
        });
        return;
    }

    // 3. Assign ambulance
    await db.query(`UPDATE emergency_requests SET ambulance_id = $1, status = 'assigned' WHERE id = $2`, [nearestAmbulance.id, newRequest.id]);
    await db.query(`UPDATE ambulances SET status = 'busy' WHERE id = $1`, [nearestAmbulance.id]);

    console.log(`[SOS] Assigned ambulance ${nearestAmbulance.id} to user ${user.id}`);

    res.status(200).json({
      success: true,
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
    console.error('[SOS ERROR]:', error);
    res.status(200).json({ 
      success: false, 
      message: 'Unable to locate ambulance at this time. Please try self transport or contact a hospital.' 
    });
  }
};
