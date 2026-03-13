"use client";

import { useState, useEffect } from "react";
import { fetchNearestHospitals, Hospital } from "@/utils/mapUtils";
import MapComponent from "@/components/MapComponent";
import { MapPin, Navigation, Clock, Activity } from "lucide-react";

const defaultCenter = { lat: 28.6139, lng: 77.2090 }; // Default to New Delhi

export default function HospitalsNearbyPage() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const fetchHospitalsData = async (lat: number, lng: number) => {
    setLoading(true);
    setError(null);
    try {
      const results = await fetchNearestHospitals(lat, lng, 5); // 5km radius
      if (results && results.length > 0) {
        setHospitals(results);
      } else {
        setHospitals([]);
      }
    } catch (err: any) {
      console.error(err);
      setError("Failed to fetch nearby hospitals. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = { lat: position.coords.latitude, lng: position.coords.longitude };
          setUserLocation(loc);
          fetchHospitalsData(loc.lat, loc.lng);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setError("Unable to retrieve your location. Please check your permissions.");
          setLoading(false);
          // Fallback location for demo
          const fallbackLoc = defaultCenter;
          setUserLocation(fallbackLoc);
          fetchHospitalsData(fallbackLoc.lat, fallbackLoc.lng);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  };

  useEffect(() => {
    setIsMounted(true);
    getUserLocation();
  }, []);

  const openRoute = (hLat: number, hLng: number) => {
    if (!userLocation) return;
    const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${hLat},${hLng}&travelmode=driving`;
    window.open(url, "_blank");
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
      <header className="px-6 h-16 flex items-center border-b border-gray-100 bg-white z-50">
        <div className="flex items-center text-red-600 font-bold text-xl">
          <Activity className="h-6 w-6 mr-2" /> MedRescue
        </div>
      </header>

      <main className="flex-1 flex flex-col md:flex-row max-h-[calc(100vh-4rem)]">
        {/* Left Panel - Hospital List */}
        <div className="w-full md:w-1/3 p-6 overflow-y-auto bg-white border-r border-slate-200">
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Nearest Hospitals Near You</h1>
            <p className="text-sm text-slate-500">
              {loading ? "Discovering nearby medical facilities..." : `Found ${hospitals.length} hospitals near your location.`}
            </p>
          </div>

          {error && (
            <div className="p-4 mb-4 text-sm text-red-700 bg-red-50 rounded-lg">
              {error}
            </div>
          )}

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse flex items-start space-x-4 p-4 border border-slate-100 rounded-xl">
                  <div className="rounded-full bg-slate-200 h-10 w-10"></div>
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-slate-200 rounded w-full"></div>
                      <div className="h-3 bg-slate-200 rounded w-5/6"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4 pb-20 md:pb-0">
              {hospitals.map((hospital) => (
                <div key={hospital.id} className="p-4 border border-slate-200 rounded-xl hover:border-red-300 hover:shadow-md transition bg-white flex flex-col gap-3">
                  <div>
                    <h3 className="font-bold text-lg leading-tight text-slate-900">{hospital.name}</h3>
                    <p className="text-sm text-slate-500 mt-1 line-clamp-1">{hospital.distance} km away</p>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-slate-700 font-medium">
                    <div className="flex items-center text-red-600">
                      <Navigation className="h-4 w-4 mr-1" />
                      {hospital.distance} km
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => openRoute(hospital.lat, hospital.lon)}
                    className="w-full mt-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-lg flex items-center justify-center transition"
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Navigate
                  </button>
                </div>
              ))}
              {hospitals.length === 0 && !loading && !error && (
                <div className="text-center p-8 text-slate-500 border border-dashed border-slate-300 rounded-xl">
                  No hospitals found in your area.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Panel - Map */}
        <div className="w-full md:w-2/3 h-[50vh] md:h-auto relative bg-slate-100">
          {isMounted && (
            <MapComponent 
              center={userLocation ? [userLocation.lat, userLocation.lng] : [defaultCenter.lat, defaultCenter.lng]} 
              zoom={13} 
              height="100%"
              markers={[
                ...(userLocation ? [{ position: [userLocation.lat, userLocation.lng] as [number, number], label: "You are here", type: 'patient' as const }] : []),
                ...hospitals.map(h => ({
                  position: [h.lat, h.lon] as [number, number],
                  label: h.name,
                  type: 'hospital' as const
                }))
              ]}
            />
          )}
        </div>
      </main>
    </div>
  );
}
