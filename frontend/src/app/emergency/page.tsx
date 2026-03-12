"use client";

import { useState, useEffect } from 'react';
import { socket } from '@/services/socket';

export default function EmergencyRequest() {
  const [status, setStatus] = useState<'idle' | 'requesting' | 'assigned' | 'arriving'>('idle');
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [ambulance, setAmbulance] = useState<any>(null);

  useEffect(() => {
    socket.connect();
    return () => { socket.disconnect(); };
  }, []);

  const requestHelp = () => {
    setStatus('requesting');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setLocation({ lat, lng });

          try {
            const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            const res = await fetch(`${API_BASE}/api/emergency`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ latitude: lat, longitude: lng, phone_number: '1234567890' })
            });
            const data = await res.json();
            if (res.ok) {
              setStatus('assigned');
              setAmbulance(data.assigned_ambulance);
              
              // Listen for ambulance updates
              socket.on(`ambulanceLocation_${data.assigned_ambulance.id}`, (updateData) => {
                console.log('Ambulance moved', updateData);
              });
            } else {
              alert(data.message || 'Error occurred');
              setStatus('idle');
            }
          } catch (e) {
             console.log(e);
             setStatus('idle');
          }
        },
        (error) => {
          console.error(error);
          alert('Failed to get location');
          setStatus('idle');
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
      setStatus('idle');
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-red-50">
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-extrabold text-red-600 mb-2">Emergency Help</h1>
        <p className="text-gray-500 mb-8">Tap the button to request immediate medical assistance</p>
        
        {status === 'idle' && (
          <div className="flex justify-center my-8">
            <button 
              onClick={requestHelp}
              className="w-56 h-56 rounded-full bg-red-600 hover:bg-red-700 text-white font-extrabold text-4xl shadow-[0_0_50px_rgba(220,38,38,0.5)] transition-all animate-pulse flex items-center justify-center border-8 border-red-200"
            >
              SOS
            </button>
          </div>
        )}

        {status === 'requesting' && (
          <div className="my-16 space-y-4">
            <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <div className="text-xl font-semibold text-gray-700">Locating nearest ambulance...</div>
          </div>
        )}

        {status === 'assigned' && ambulance && (
          <div className="space-y-6 text-left animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-4">
              <div className="bg-green-500 rounded-full w-12 h-12 flex items-center justify-center text-white shrink-0">✓</div>
              <div>
                <div className="text-green-800 font-bold text-lg">Ambulance Assigned</div>
                <div className="text-green-600 text-sm font-medium">ETA: ~5 minutes</div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-2">Driver Details</h3>
              <p className="text-gray-600"><strong>Name:</strong> {ambulance.driver_name}</p>
              <p className="text-gray-600"><strong>Vehicle ID:</strong> AMB-{ambulance.id}</p>
            </div>

            <div className="h-48 bg-gray-200 rounded-2xl flex items-center justify-center border border-gray-300 overflow-hidden relative">
              <span className="text-gray-500 font-medium">Map View Integration Pending</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
