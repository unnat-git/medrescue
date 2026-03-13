import { Request, Response } from 'express';

export const getNearbyHospitals = async (req: Request, res: Response): Promise<void> => {
  try {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
      res.status(400).json({ message: 'Latitude and longitude are required' });
      return;
    }

    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
      console.error('GOOGLE_PLACES_API_KEY is not defined in .env');
      res.status(500).json({ message: 'Server configuration error: Google Places API key missing' });
      return;
    }

    // Google Places API Nearby Search URL
    const radius = 50000; // 50km radius
    const apiUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=hospital&key=${apiKey}`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.error('Google Places API error:', data);
      res.status(500).json({ message: 'Error fetching hospitals from Google Places API', details: data.status });
      return;
    }

    // Map and calculate distance/eta simplified for the response
    // For a real production app, Distance Matrix API could be used, but straight-line distance is faster here
    const hospitals = data.results.slice(0, 10).map((place: any) => {
      const hLat = place.geometry.location.lat;
      const hLng = place.geometry.location.lng;
      
      // Basic distance calculation (Haversine formula is already in utils, let's just return coordinates for frontend to calculate or use it here if we import it)
      return {
        id: place.place_id,
        name: place.name,
        address: place.vicinity,
        latitude: hLat,
        longitude: hLng,
        rating: place.rating || 'N/A',
        open_now: place.opening_hours?.open_now,
      };
    });

    res.status(200).json({
      message: 'Hospitals fetched successfully',
      count: hospitals.length,
      hospitals,
    });
  } catch (error) {
    console.error('Error fetching nearby hospitals:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
