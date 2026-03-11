"use client";

import { useState, useEffect } from 'react';
import { socket } from '@/services/socket';

export default function DriverDashboard() {
  const [requests, setRequests] = useState<any[]>([]);
  const [isAvailable, setIsAvailable] = useState(true);

  // Mock data for now, would fetch from backend in reality
  useEffect(() => {
    // In a real app we'd fetch /api/emergency/pending
    setRequests([
      { id: '101', patientName: 'John Doe', distance: '2.5 km', loc: { lat: 37.77, lng: -122.41 }, urg: 'High' },
      { id: '102', patientName: 'Jane Smith', distance: '4.1 km', loc: { lat: 37.79, lng: -122.40 }, urg: 'Medium' }
    ]);
  }, []);

  const acceptRequest = (reqId: string) => {
    // API call to accept request
    setRequests(requests.filter(r => r.id !== reqId));
    setIsAvailable(false);
    alert(`En route to Request #${reqId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-80 bg-slate-900 text-white p-6 flex flex-col">
        <h2 className="text-2xl font-bold mb-8">Driver Dashboard</h2>
        
        <div className="mb-8">
          <div className="text-sm text-slate-400 mb-2">Current Status</div>
          <button 
            onClick={() => setIsAvailable(!isAvailable)}
            className={`w-full py-3 rounded-xl font-semibold transition ${isAvailable ? 'bg-green-500 hover:bg-green-600' : 'bg-orange-500 hover:bg-orange-600'}`}
          >
            {isAvailable ? '🟢 Available for dispatch' : '🟠 Busy / En Route'}
          </button>
        </div>

        <div className="mt-auto">
          <p className="text-sm text-slate-400">Driver ID</p>
          <p className="font-mono text-lg">DRV-3849</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-10">
        <h1 className="text-3xl font-bold text-slate-800 mb-6">Nearby Emergencies</h1>
        
        {isAvailable ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {requests.map((r) => (
              <div key={r.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold uppercase">{r.urg} Priority</span>
                  <span className="text-slate-500 text-sm font-medium">{r.distance} away</span>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-1">{r.patientName}</h3>
                <p className="text-slate-500 text-sm mb-6">Location: {r.loc.lat}, {r.loc.lng}</p>
                
                <button 
                  onClick={() => acceptRequest(r.id)}
                  className="mt-auto w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold transition"
                >
                  Accept & Route
                </button>
              </div>
            ))}
            {requests.length === 0 && (
              <div className="col-span-full p-12 text-center text-slate-500 bg-white rounded-2xl border border-dashed border-gray-300">
                No active emergencies in your vicinity.
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-96 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mb-4 text-3xl animate-pulse">
              📍
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">You are currently en route</h2>
            <p className="text-slate-500 mb-6 max-w-md">Navigate to the patient's location. The map and routing details will be shown here.</p>
            <button 
              onClick={() => setIsAvailable(true)}
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-semibold transition"
            >
              Complete Trip & Return to Available
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
