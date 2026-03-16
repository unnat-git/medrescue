import { Request, Response } from 'express';
import db from '../db';
import { calculateDistance } from '../utils/distance';

export const getNearbyHospitals = async (req: Request, res: Response): Promise<void> => {
  try {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
      res.status(400).json({ message: 'Latitude and longitude are required' });
      return;
    }

    const userLat = parseFloat(latitude as string);
    const userLng = parseFloat(longitude as string);

    if (isNaN(userLat) || isNaN(userLng)) {
      res.status(400).json({ message: 'Invalid latitude or longitude format' });
      return;
    }

    // Fetch all seeded hospitals from DB
    const result = await db.query('SELECT * FROM hospitals');
    const dbHospitals = result.rows;

    // Calculate distance and filter for nearby (e.g., within 10km) if needed, 
    // but since we seeded specifically around 700107 we can just sort by distance
    const hospitalsWithDistance = dbHospitals.map(hosp => {
      const distance = calculateDistance(userLat, userLng, hosp.latitude, hosp.longitude);
      return {
        id: hosp.id.toString(),
        name: hosp.name,
        address: hosp.contact_number !== 'Not Available' ? `Phone: ${hosp.contact_number}` : 'Address/Phone not available',
        latitude: hosp.latitude,
        longitude: hosp.longitude,
        distance, // km
        contact_number: hosp.contact_number
      };
    });

    // Sort by nearest first
    hospitalsWithDistance.sort((a, b) => a.distance - b.distance);
    
    // Take Top 10 closest
    const topHospitals = hospitalsWithDistance.slice(0, 10);

    res.status(200).json({
      message: 'Nearby hospitals fetched successfully',
      count: topHospitals.length,
      hospitals: topHospitals,
    });
  } catch (error) {
    console.error('Error fetching nearby hospitals from database:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
