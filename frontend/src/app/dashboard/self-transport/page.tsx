"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Activity, MapPin, Navigation, Phone, ArrowLeft, Loader2, LogOut, ChevronRight, Globe, Menu, X } from "lucide-react";
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
          setError("Unable to retrieve location. Showing general results.");
          fetchHospitals(22.5150, 88.3930);
        }
      );
    } else {
      setError("Geolocation not supported.");
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const openInMaps = (lat: number, lng: number) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="px-6 py-4 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between sticky top-0 z-30 w-full">
        <div className="flex items-center gap-4">
          <Link href="/profile" className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-1.5 bg-red-50 rounded-lg group-hover:bg-red-100 transition-colors">
              <Activity className="h-5 w-5 text-red-600" />
            </div>
            <span className="font-black text-xl text-slate-900 tracking-tight">MedRescue</span>
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center bg-slate-100 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500">
                Self Transport
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-red-600 transition-colors bg-slate-50 rounded-xl"
            >
              <LogOut className="h-5 w-5" />
            </button>
            <button 
              className="md:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
        </div>

        {/* Mobile Navigation Overlay */}
        {isMenuOpen && (
          <div className="fixed inset-0 top-[73px] bg-white z-40 md:hidden animate-in fade-in slide-in-from-top-4 duration-200">
            <div className="flex flex-col p-6 gap-6">
              <Link 
                href="/profile" 
                className="text-lg font-bold text-slate-800 p-5 bg-slate-50 rounded-2xl flex items-center justify-between"
                onClick={() => setIsMenuOpen(false)}
              >
                Back to Dashboard
                <ChevronRight className="h-5 w-5 text-red-600" />
              </Link>
              <button 
                onClick={handleLogout}
                className="flex items-center justify-center gap-3 h-16 font-bold text-red-600 bg-red-50 rounded-2xl w-full"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full p-4 md:p-10 space-y-10">
        <div className="space-y-3 px-2">
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">Nearby Hospitals</h1>
          <p className="text-slate-500 font-medium text-lg">Instant location-based medical facilities for self-transport.</p>
        </div>

        {error && (
          <div className="mx-2 p-6 bg-red-50 border border-red-100 text-red-800 rounded-[2rem] flex items-center gap-4 animate-in fade-in duration-500">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm">
                <span className="text-xl">⚠️</span>
            </div>
            <p className="font-bold">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-6">
            <div className="relative">
                <div className="w-20 h-20 border-8 border-slate-100 rounded-full"></div>
                <Loader2 className="h-20 w-20 text-red-600 animate-spin absolute top-0 left-0" />
            </div>
            <p className="text-slate-900 font-black text-xl animate-pulse uppercase tracking-widest">Scanning Area...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 pb-20">
            {hospitals.map((hospital) => (
              <div key={hospital.id} className="bg-white rounded-[2.5rem] p-6 lg:p-8 border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-red-500"></div>
                
                <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-6 leading-tight group-hover:text-red-600 transition-colors">{hospital.name}</h3>
                
                <div className="space-y-4 mb-10">
                  <div className="flex items-start gap-4 text-slate-500">
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center shrink-0">
                        <MapPin className="h-5 w-5 text-red-500" />
                    </div>
                    <span className="text-sm font-bold text-slate-600 leading-relaxed pt-2">{hospital.address}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-6 pt-6 border-t border-slate-50">
                  <div className="bg-slate-50 px-5 py-3 rounded-2xl flex flex-col justify-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-1">Distance</span>
                    <span className="text-2xl font-black text-slate-900 leading-none">
                        {hospital.distance} <span className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">km</span>
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                      <button 
                        onClick={() => openInMaps(hospital.latitude, hospital.longitude)}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-8 h-16 bg-slate-900 hover:bg-red-600 text-white rounded-2xl font-black shadow-xl shadow-slate-200 transition-all transform hover:-translate-y-1 active:translate-y-0"
                      >
                        <Navigation className="h-5 w-5" />
                        Navigate
                      </button>
                      <a 
                        href={`tel:${hospital.contact_number}`}
                        className="flex items-center justify-center w-16 h-16 bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-2xl transition-all"
                      >
                        <Phone className="h-5 w-5" />
                      </a>
                  </div>
                </div>
              </div>
            ))}

            {hospitals.length === 0 && !loading && (
                <div className="col-span-full py-32 text-center bg-white rounded-[3rem] border border-slate-100 border-dashed">
                    <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                        <MapPin className="h-12 w-12 text-slate-200" />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900">No facilities found.</h2>
                    <p className="text-slate-500 font-medium mt-3 px-8">Try searching in a different area or check your connection.</p>
                </div>
            )}
          </div>
        )}

        <div className="bg-slate-900 rounded-[3rem] p-10 md:p-16 text-center text-white relative overflow-hidden shadow-2xl shadow-slate-900/40">
            <div className="relative z-10 max-w-2xl mx-auto space-y-8">
                <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto backdrop-blur-md">
                    <Globe className="h-10 w-10 text-white" />
                </div>
                <div className="space-y-4">
                    <h3 className="text-3xl md:text-4xl font-black italic tracking-tight">Critical Emergency?</h3>
                    <p className="text-slate-400 font-medium text-lg">If every second counts, do not wait. Request an immediate medical rescue team instead.</p>
                </div>
                <Link 
                    href="/emergency" 
                    className="inline-flex h-16 px-12 items-center justify-center bg-red-600 text-white font-black rounded-2xl shadow-2xl shadow-red-900/50 hover:bg-red-700 transition-all transform hover:-translate-y-1 active:translate-y-0"
                >
                    Trigger Emergency SOS
                </Link>
            </div>
            {/* Background elements */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-red-600/10 rounded-full blur-3xl text-slate-900"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl text-slate-900"></div>
        </div>
      </main>

      <footer className="mt-auto py-12 text-center border-t border-slate-100 bg-white">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">&copy; 2026 MedRescue • Emergency Response Systems</p>
      </footer>
    </div>
  );
}
