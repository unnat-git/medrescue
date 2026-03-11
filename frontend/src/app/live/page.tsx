"use client";

import { useState, useEffect } from 'react';
import { socket } from '@/services/socket';

export default function LiveTracking() {
  const [eta, setEta] = useState('5 mins');
  const [distance, setDistance] = useState('2.4 km');

  useEffect(() => {
    socket.connect();
    
    // In real app, we would dynamically listen to specific ambulance ID
    socket.on('ambulanceLocationUpdate', (data) => {
      // update map markers
      console.log('Ambulance is moving...', data);
    });

    return () => { socket.disconnect(); };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <div className="w-full md:w-96 bg-white shadow-xl z-10 flex flex-col pt-10 pb-6 px-6 relative h-auto md:h-screen">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Live Tracking</h1>
        <p className="text-slate-500 text-sm mb-8">Ambulance #AMB-104 is on the way</p>
        
        <div className="bg-red-50 border border-red-100 rounded-2xl p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-slate-600 font-semibold">Status</span>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase animate-pulse">En Route</span>
          </div>
          <div className="flex justify-between items-end border-b border-red-200 pb-4 mb-4">
            <div>
              <p className="text-slate-500 text-sm font-semibold">ETA</p>
              <p className="text-4xl font-extrabold text-red-600">{eta}</p>
            </div>
            <div className="text-right">
              <p className="text-slate-500 text-sm font-semibold">Distance</p>
              <p className="text-2xl font-bold text-slate-800">{distance}</p>
            </div>
          </div>
          <div>
            <p className="text-slate-500 text-sm font-semibold mb-1">Driver Name</p>
            <p className="font-bold text-slate-900 text-lg">Michael Swift</p>
          </div>
        </div>
        
        <div className="mt-auto space-y-4">
          <button className="w-full py-4 text-white font-bold bg-slate-900 hover:bg-slate-800 rounded-xl transition">
            Call Driver
          </button>
          <button className="w-full py-4 text-red-600 font-bold bg-red-50 hover:bg-red-100 rounded-xl transition border border-red-100">
            Cancel Request
          </button>
        </div>
      </div>

      <div className="flex-1 bg-slate-200 relative min-h-[500px] md:h-screen flex text-center flex-col items-center justify-center">
        {/* Placeholder for real Google Maps Integration */}
        <div className="absolute inset-0 z-0 bg-cover bg-center opacity-40 mix-blend-multiply" style={{ backgroundImage: "url('https://maps.googleapis.com/maps/api/staticmap?center=37.7749,-122.4194&zoom=14&size=800x800&maptype=roadmap')" }}></div>
        <div className="relative z-10 bg-white/90 backdrop-blur border border-white p-6 rounded-2xl max-w-sm shadow-xl">
          <div className="text-4xl mb-4 text-red-500">🗺️</div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Map Integration Pending</h2>
          <p className="text-slate-600 text-sm">Real-time socket coordinates will update ambulance markers on the map surface.</p>
        </div>
      </div>
    </div>
  );
}
