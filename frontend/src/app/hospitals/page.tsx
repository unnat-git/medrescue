"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Activity, MapPin, Navigation, Phone, ArrowLeft, Loader2 } from "lucide-react";
import { API_ENDPOINTS } from "@/config/api";

interface Hospital {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  distance: number;
  contact_number: string;
}

export default function NearbyHospitals() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchHospitals(position.coords.latitude, position.coords.longitude);
        },
        (err) => {
          console.error("Geolocation error:", err);
          setError("Unable to retrieve your location. Showing general hospitals.");
          // Fallback to default location
          fetchHospitals(22.5150, 88.3930);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
      fetchHospitals(22.5150, 88.3930);
    }
  }, [router]);

  const fetchHospitals = async (lat: number, lng: number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_ENDPOINTS.HOSPITALS.NEARBY}?latitude=${lat}&longitude=${lng}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error("Failed to fetch hospitals");
      const data = await response.json();
      setHospitals(data.hospitals);
    } catch (err) {
      console.error(err);
      setError("Failed to load nearby hospitals.");
    } finally {
      setLoading(false);
    }
  };

  const openInMaps = (lat: number, lng: number) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="px-6 py-4 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <Link href="/profile" className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <Link href="/" className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-red-600" />
            <span className="font-bold text-xl text-slate-900 tracking-tight">MedRescue</span>
          </Link>
        </div>
        <div className="hidden sm:block text-slate-500 font-medium bg-slate-100 px-4 py-1.5 rounded-full text-sm">
            Self Transport Mode
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6 md:p-10">
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Find Nearby Hospitals</h1>
          <p className="text-slate-500 mt-2 text-lg">Locate the nearest medical facilities for immediate self-transport.</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl flex items-center gap-3">
            <span className="text-lg">⚠️</span>
            <p className="font-medium">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="h-10 w-10 text-red-600 animate-spin" />
            <p className="text-slate-500 font-bold animate-pulse">Finding hospitals near you...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {hospitals.map((hospital) => (
              <div key={hospital.id} className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all group overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Activity className="h-16 w-16 text-slate-900" />
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-2 pr-10">{hospital.name}</h3>
                
                <div className="space-y-3 mb-8">
                  <div className="flex items-start gap-4 text-slate-500">
                    <MapPin className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                    <span className="text-sm font-medium leading-relaxed">{hospital.address}</span>
                  </div>
                  <div className="flex items-center gap-4 text-slate-500">
                    <Phone className="h-5 w-5 text-blue-500 shrink-0" />
                    <span className="text-sm font-bold text-slate-700">{hospital.contact_number}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-50">
                  <div className="px-4 py-2 bg-slate-50 rounded-xl">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Distance</span>
                    <span className="text-lg font-black text-slate-900">{hospital.distance} <span className="text-sm font-normal text-slate-400 italic">km</span></span>
                  </div>
                  
                  <button 
                    onClick={() => openInMaps(hospital.latitude, hospital.longitude)}
                    className="flex-1 flex items-center justify-center gap-2 py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold shadow-lg shadow-red-100 transition-all transform group-hover:-translate-y-1"
                  >
                    <Navigation className="h-4 w-4" />
                    Navigate
                  </button>
                </div>
              </div>
            ))}

            {hospitals.length === 0 && !loading && (
                <div className="col-span-full py-20 text-center">
                    <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <MapPin className="h-10 w-10 text-slate-300" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-400">No hospitals found nearby.</h2>
                    <p className="text-slate-400 mt-2">Try searching in a different area or check your internet connection.</p>
                </div>
            )}
          </div>
        )}
      </main>
      
      <footer className="py-8 text-center text-slate-400 text-sm">
        <p>© 2026 MedRescue • Emergency Self Transport System</p>
      </footer>
    </div>
  );
}
