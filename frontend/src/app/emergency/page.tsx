"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Activity, MapPin, Shield, LogOut, ChevronRight, Menu, X } from 'lucide-react';
import { socket } from '@/services/socket';
import MapComponent from '@/components/MapComponent';
import { API_ENDPOINTS } from '@/config/api';
import { Ambulance } from '@/types';

export default function EmergencyRequest() {
  const router = useRouter();
  const [status, setStatus] = useState<'idle' | 'requesting' | 'assigned' | 'arriving'>('idle');
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [ambulance, setAmbulance] = useState<Ambulance | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    
    setIsMounted(true);
    socket.connect();
    return () => { socket.disconnect(); };
  }, [router]);

  const requestHelp = useCallback(async (lat: number, lng: number) => {
    setStatus('requesting');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(API_ENDPOINTS.EMERGENCY.BASE, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ latitude: lat, longitude: lng })
      });

      const data = await res.json();
      if (res.ok && data.status === 'assigned') {
        setStatus('assigned');
        const amb = data.assigned_ambulance;
        amb.eta = data.eta;
        setAmbulance(amb);
        
        socket.on(`ambulanceLocation_${amb.id}`, (updateData: { latitude: number, longitude: number }) => {
          setAmbulance((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              latitude: updateData.latitude,
              longitude: updateData.longitude
            };
          });
        });
      } else {
        alert(data.message || 'No ambulance found nearby.');
        setStatus('idle');
      }
    } catch (e) {
       console.error(e);
       setStatus('idle');
    }
  }, []);

  const handleSOS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setLocation({ lat, lng });
          requestHelp(lat, lng);
        },
        (error) => {
          console.error(error);
          alert('Failed to get location. Please enable location services.');
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-white flex flex-col relative">
      <header className="px-6 py-4 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-50 w-full">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-1.5 bg-red-50 rounded-lg group-hover:bg-red-100 transition-colors">
            <Activity className="h-5 w-5 text-red-600" />
          </div>
          <span className="font-black text-xl text-slate-900 tracking-tight">MedRescue</span>
        </Link>
        <button 
          onClick={handleLogout}
          className="p-2 text-slate-400 hover:text-red-600 transition-colors bg-slate-50 rounded-xl"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-4xl space-y-8">
          {status === 'idle' || status === 'requesting' ? (
            <div className="flex flex-col items-center text-center space-y-12">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                    {status === 'requesting' ? 'Requesting Help' : 'Emergency SOS'}
                </h1>
                <p className="max-w-md mx-auto text-slate-500 font-medium">
                    {status === 'requesting' 
                        ? 'Broadcasting your location to nearest medical responders...' 
                        : 'Tap the button below for immediate medical assistance. Your profile will be shared instantly.'}
                </p>
              </div>

              <div className="relative flex items-center justify-center">
                 <div className={`absolute w-44 h-44 sm:w-64 sm:h-64 rounded-full bg-red-100 animate-ping opacity-75 ${status === 'requesting' ? 'block' : 'hidden'}`}></div>
                 <div className={`absolute w-32 h-32 sm:w-48 sm:h-48 rounded-full bg-red-50 animate-pulse delay-75 ${status === 'requesting' ? 'block' : 'hidden'}`}></div>
                 
                 <button
                    onClick={handleSOS}
                    disabled={status === 'requesting'}
                    className={`relative z-10 w-48 h-48 sm:w-64 sm:h-64 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-2xl ${
                        status === 'requesting' 
                            ? 'bg-red-700 scale-95 shadow-red-900/40' 
                            : 'bg-red-600 hover:bg-red-700 active:scale-95 shadow-red-200'
                    }`}
                 >
                    <Activity className={`h-14 w-14 sm:h-20 sm:w-20 text-white ${status === 'requesting' ? 'animate-pulse' : ''}`} />
                    <span className="text-white text-xl sm:text-2xl font-black mt-4 tracking-wider">
                        {status === 'requesting' ? 'SEARCHING' : 'SOS'}
                    </span>
                 </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
                 <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4 text-left">
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0">
                        <MapPin className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Live Location</p>
                        <p className="text-sm font-bold text-slate-700">GPS signals active</p>
                    </div>
                 </div>
                 <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4 text-left">
                    <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center shrink-0">
                        <Shield className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Medical ID</p>
                        <p className="text-sm font-bold text-slate-700">Ready to share</p>
                    </div>
                 </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
               <div className="space-y-6">
                 <div className="bg-green-600 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-green-100 relative overflow-hidden">
                    <div className="relative z-10 flex items-center gap-6">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
                            <Activity className="h-8 w-8 text-white animate-pulse" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black">Help is Coming</h2>
                            <p className="text-green-50 font-medium">Ambulance assigned and en route.</p>
                        </div>
                    </div>
                    <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
                 </div>

                 <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 space-y-8">
                    <h3 className="text-xl font-black text-slate-900 border-b border-slate-50 pb-4">Responder Details</h3>
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Driver Name</label>
                            <p className="text-lg font-bold text-slate-800">{ambulance?.driver_name}</p>
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Vehicle Plate</label>
                            <p className="text-lg font-bold text-slate-800">{ambulance?.ambulance_number}</p>
                        </div>
                        <div className="col-span-2">
                            <button className="w-full h-16 bg-slate-900 text-white rounded-2xl font-black flex items-center justify-center gap-3 shadow-lg shadow-slate-200">
                                <LogOut className="h-5 w-5 transform rotate-180" />
                                Call Responder: {ambulance?.phone_number}
                            </button>
                        </div>
                    </div>
                 </div>
               </div>

               <div className="h-[400px] lg:h-full bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
                 {(location && ambulance) ? (
                    <MapComponent 
                      center={[location.lat, location.lng]} 
                      zoom={14} 
                      height="100%"
                      markers={[
                        { position: [location.lat, location.lng], label: "You", type: 'patient' },
                        { position: [ambulance.latitude, ambulance.longitude], label: ambulance.driver_name, type: 'ambulance' }
                      ]}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-50 animate-pulse">
                        <MapPin className="h-10 w-10 text-slate-200" />
                    </div>
                  )}
               </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
