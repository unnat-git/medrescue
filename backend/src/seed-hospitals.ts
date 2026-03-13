import { Client } from 'pg';

// Using the provided database URL
const connectionString = "postgresql://medrescue:MedRescueSecure@dpg-d6oulihaae7s73bk8jk0-a.singapore-postgres.render.com/medrescue?sslmode=require";

// Haversine distance calculator
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return Number((R * c).toFixed(2));
}

async function seedHospitals() {
  const client = new Client({ connectionString });
  
  try {
    await client.connect();
    console.log("Connected to the database. Fetching real hospital data for Pincode 700107...");

    // Geocoded coordinates for Pincode 700107 (Kolkata, India - around Rajdanga/Kasba/Haltu area)
    const PINCODE_LAT = 22.5150;
    const PINCODE_LNG = 88.3930;
    const RADIUS_METERS = 8000; // 8 km radius

    // Fetch from Overpass API
    const overpassQuery = `
      [out:json];
      (
        node["amenity"="hospital"](around:${RADIUS_METERS},${PINCODE_LAT},${PINCODE_LNG});
        way["amenity"="hospital"](around:${RADIUS_METERS},${PINCODE_LAT},${PINCODE_LNG});
        relation["amenity"="hospital"](around:${RADIUS_METERS},${PINCODE_LAT},${PINCODE_LNG});
      );
      out center;
    `;

    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: overpassQuery,
    });
    
    if (!response.ok) {
      throw new Error(`Overpass API returned status: ${response.status}`);
    }

    const data = await response.json();
    
    // Process and validate hospitals
    const validHospitals = data.elements
      .map((element: any) => {
        const lat = element.lat || element.center?.lat;
        const lon = element.lon || element.center?.lon;
        const name = element.tags?.name;
        
        // Validation: must have coords and name
        if (!lat || !lon || !name) return null;

        return {
          name,
          lat,
          lon,
          phone: element.tags?.['contact:phone'] || element.tags?.phone || null,
          distance: calculateDistance(PINCODE_LAT, PINCODE_LNG, lat, lon)
        };
      })
      .filter(Boolean); // Remove nulls

    // Remove strict duplicates by exact name
    const uniqueHospitals = Array.from(new Map(validHospitals.map((h: any) => [h.name.toLowerCase(), h])).values()) as any[];

    // Sort by distance and take the top 15
    uniqueHospitals.sort((a, b) => a.distance - b.distance);
    const topHospitals = uniqueHospitals.slice(0, 15);

    console.log(`Found ${topHospitals.length} valid nearby hospitals.`);

    // 1. Truncate the hospitals table
    console.log("Clearing existing hospital data...");
    await client.query('TRUNCATE TABLE hospitals RESTART IDENTITY CASCADE');

    // 2. Insert new hospitals
    console.log("Inserting real hospital data...");
    let insertedCount = 0;
    
    for (const hosp of topHospitals) {
      await client.query(
        `INSERT INTO hospitals (name, latitude, longitude, contact_number) VALUES ($1, $2, $3, $4)`,
        [hosp.name, hosp.lat, hosp.lon, hosp.phone || 'Not Available']
      );
      insertedCount++;
      console.log(`  + Added: ${hosp.name} (${hosp.distance} km away)`);
    }

    console.log(`\nSuccessfully seeded ${insertedCount} real hospitals into the database.`);
    
  } catch (error) {
    console.error("Error seeding hospitals:", error);
  } finally {
    await client.end();
  }
}

seedHospitals();
