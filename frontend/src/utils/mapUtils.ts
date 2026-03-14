// Map System Utilities for MedRescue

// Types
export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Hospital {
  id: string;
  name: string;
  lat: number;
  lon: number;
  distance: number;
}


// 1. Haversine distance calculator for fallback or sorting
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // inside km
  return Number(distance.toFixed(2));
}

// 2. Fetch nearest hospitals from Overpass API
export async function fetchNearestHospitals(lat: number, lon: number, radiusKm: number = 5): Promise<Hospital[]> {
  const radiusMeters = radiusKm * 1000;
  const query = `
    [out:json];
    (
      node["amenity"="hospital"](around:${radiusMeters},${lat},${lon});
      way["amenity"="hospital"](around:${radiusMeters},${lat},${lon});
      relation["amenity"="hospital"](around:${radiusMeters},${lat},${lon});
    );
    out center;
  `;

  try {
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: query,
    });
    
    if (!response.ok) throw new Error("Failed to fetch from Overpass API");
    
    const data = await response.json();
    
    // Parse results
    const hospitals: Hospital[] = (data.elements as {
      id: number;
      lat?: number;
      lon?: number;
      center?: { lat: number; lon: number };
      tags?: { name?: string };
    }[])
      .map((element) => {
        const lat_center = element.lat || element.center?.lat;
        const lon_center = element.lon || element.center?.lon;
        
        if (!lat_center || !lon_center) return null;


        const dist = calculateDistance(lat, lon, lat_center, lon_center);

        return {
          id: element.id.toString(),
          name: element.tags?.name || "Unknown Hospital",
          lat: lat_center,
          lon: lon_center,
          distance: dist
        };
      })
      .filter((h): h is Hospital => h !== null)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 10); // Take nearest 10



    return hospitals;
  } catch (error) {
    console.error("Overpass API error:", error);
    return [];
  }
}

// 3. OpenRouteService for Navigation Routing
const ORS_API_KEY = process.env.NEXT_PUBLIC_ORS_API_KEY || "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImRkYjcwMWIxMTMzYjQwZmQ4YWFiZWY3NTY4NDY3MGYwIiwiaCI6Im11cm11cjY0In0=";

export async function calculateRoute(start: Coordinates, end: Coordinates) {
  try {
    // OpenRouteService expects coordinates as [longitude, latitude]
    const response = await fetch(`https://api.openrouteservice.org/v2/directions/driving-car?api_key=${ORS_API_KEY}&start=${start.longitude},${start.latitude}&end=${end.longitude},${end.latitude}`);
    
    if (!response.ok) throw new Error("Failed to calculate route");
    
    const data = await response.json();
    
    if (data.features && data.features.length > 0) {
      const feature = data.features[0];
      const geometry = feature.geometry.coordinates; // Array of [lon, lat]
      
      // Convert to Leaflet Polyline format: Array of [lat, lon]
      const leafletPath = geometry.map((coord: number[]) => [coord[1], coord[0]]);
      
      const distance = feature.properties.segments[0].distance / 1000; // km
      const duration = feature.properties.segments[0].duration / 60; // minutes
      
      return {
        path: leafletPath,
        distance: Number(distance.toFixed(1)), // km
        eta: Math.ceil(duration) // minutes
      };
    }
    
    return null;
  } catch (error) {
    console.error("Routing error:", error);
    return null;
  }
}
