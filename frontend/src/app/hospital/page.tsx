"use client";

import { useState, useEffect } from 'react';
import { socket } from '@/services/socket';
import MapComponent from '@/components/MapComponent';

export default function HospitalDashboard() {
  const [incoming, setIncoming] = useState([
    { id: '1', patientName: 'John Doe', condition: 'Severe allergic reaction', bloodType: 'O+', eta: '5 mins', distance: '2.1 km' },
    { id: '2', patientName: 'Jane Smith', condition: 'Cardiac arrest', bloodType: 'A-', eta: '12 mins', distance: '6.4 km' }
  ]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Hospital Dashboard</h1>
          <p className="text-slate-500 mt-1">City General Hospital • Trauma Center</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-4">
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm font-semibold text-slate-700">
            Available Beds: <span className="text-green-600">14</span>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm font-semibold text-slate-700">
            ICU: <span className="text-orange-600">2</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            Incoming Patients <span className="bg-red-600 text-white text-sm px-2 py-0.5 rounded-full">{incoming.length}</span>
          </h2>
          <div className="space-y-4">
            {incoming.map((patient: any) => (
              <div key={patient.id} className="bg-white border-l-4 border-red-600 rounded-xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{patient.patientName}</h3>
                  <div className="flex flex-wrap gap-2 mt-2 text-sm text-slate-600">
                    <span className="font-semibold px-2 py-1 bg-red-50 text-red-700 rounded border border-red-100">
                      Condition: {patient.condition}
                    </span>
                    <span className="font-semibold px-2 py-1 bg-slate-50 border border-slate-200 rounded">
                      Blood: {patient.bloodType}
                    </span>
                  </div>
                </div>
                <div className="text-left sm:text-right flex flex-row sm:flex-col gap-4 sm:gap-1 items-center sm:items-end w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="text-2xl font-bold text-red-600">{patient.eta}</div>
                  <div className="text-sm font-medium text-slate-500 w-full text-center sm:text-right">{patient.distance}</div>
                  <button className="sm:mt-2 px-4 py-2 sm:px-0 sm:py-0 w-full sm:w-auto bg-slate-900 sm:bg-transparent text-white sm:text-blue-600 rounded sm:rounded-none text-sm font-bold sm:hover:underline transition">
                    View Medical Profile
                  </button>
                </div>
              </div>
            ))}
            {incoming.length === 0 && (
              <div className="p-8 text-center text-slate-500 bg-white rounded-xl border border-dashed border-gray-300">
                No incoming emergencies at this moment.
              </div>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">Live Ambulances</h2>
          <div className="bg-slate-200 rounded-xl shadow-inner border border-slate-300 overflow-hidden h-[400px]">
            {isMounted && (
              <MapComponent 
                center={[37.77, -122.41]} 
                zoom={12} 
                height="100%"
                markers={[
                  { position: [37.77, -122.41], label: "Ambulance A-123", type: 'ambulance' },
                  { position: [37.79, -122.40], label: "Ambulance A-456", type: 'ambulance' }
                ]}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
