"use client";

import { useState, useEffect, useRef } from 'react';
import { socket } from '@/services/socket';
import MapComponent from '@/components/MapComponent';
import { Navigation, CheckCircle, MapPin } from 'lucide-react';
import { calculateRoute } from '@/utils/mapUtils';

const defaultCenter = { latitude: 28.6139, longitude: 77.2090 }; // Default Driver location

interface DriverRequest {
  id: string;
  patientName: string;
  loc: { latitude: number; longitude: number };
  urg: 'High' | 'Medium' | 'Low';
  hospital?: { latitude: number; longitude: number; name: string };
}

export default function DriverDashboard() {
  const [requests, setRequests] = useState<DriverRequest[]>([]);

  const [isAvailable, setIsAvailable] = useState(true);
  
  const [driverLocation, setDriverLocation] = useState(defaultCenter);
  const [activeRequest, setActiveRequest] = useState<DriverRequest | null>(null);

  
  const [routePath, setRoutePath] = useState<number[][] | null>(null);
  const [routeInfo, setRouteInfo] = useState<{ distance: string; duration: string } | null>(null);
  const [phase, setPhase] = useState<"IDLE" | "TO_PATIENT" | "TO_HOSPITAL">("IDLE");
  const [isMounted, setIsMounted] = useState(false);

  const ambulanceId = '1'; // Mock driver ID matched with schema.sql ID 1 (John Driver)

  // Initial load
  useEffect(() => {
    setIsMounted(true);
    setRequests([
      { id: '101', patientName: 'John Doe', loc: { latitude: 28.6250, longitude: 77.2150 }, urg: 'High' },
      { id: '102', patientName: 'Jane Smith', loc: { latitude: 28.6300, longitude: 77.2200 }, urg: 'Medium' }
    ]);
  }, []);

  // Socket connect & Live tracking
  useEffect(() => {
    socket.connect();
    
    let watchId: number;
    
    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const newLoc = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          setDriverLocation(newLoc);
          
          if (phase !== "IDLE") {
            socket.emit('driverLocationUpdate', {
              ambulanceId,
              latitude: newLoc.latitude,
              longitude: newLoc.longitude
            });
          }
        },
        (error) => console.error("Error watching position", error),
        { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
      );
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
      socket.disconnect();
    };
  }, [phase, ambulanceId]);

  const fetchRoute = async (origin: {latitude: number, longitude: number}, destination: {latitude: number, longitude: number}) => {
    const route = await calculateRoute(origin, destination);
    if (route) {
      setRoutePath(route.path);
      setRouteInfo({
        distance: `${route.distance} km`,
        duration: `${route.eta} mins`,
      });
    }
  };

  const acceptRequest = (req: DriverRequest) => {
    setRequests(requests.filter(r => r.id !== req.id));
    setIsAvailable(false);
    setActiveRequest(req);
    setPhase("TO_PATIENT");
    fetchRoute(driverLocation, req.loc);
  };


  const handleArrivedAtPatient = async () => {
    if (!activeRequest) return;
    // Navigate to nearest hospital
    const mockNearestHospital = { latitude: 28.5900, longitude: 77.2300, name: "City General Hospital" };
    setActiveRequest({ ...activeRequest, hospital: mockNearestHospital });
    setPhase("TO_HOSPITAL");
    fetchRoute(activeRequest.loc, mockNearestHospital);
  };


  const handleCompletedTrip = () => {
    setIsAvailable(true);
    setActiveRequest(null);
    setPhase("IDLE");
    setRoutePath(null);
    setRouteInfo(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar Controls */}
      <div className="w-full md:w-80 bg-slate-900 text-white p-6 flex flex-col z-10 shrink-0">
        <h2 className="text-2xl font-bold mb-8">Driver Dashboard</h2>
        
        <div className="mb-8">
          <div className="text-sm text-slate-400 mb-2">Current Status</div>
          <button 
            onClick={() => setIsAvailable(!isAvailable && phase === "IDLE")}
            disabled={phase !== "IDLE"}
            className={`w-full py-3 rounded-xl font-semibold transition ${
              isAvailable 
                ? 'bg-green-500 hover:bg-green-600' 
                : phase === "IDLE" ? 'bg-orange-500 hover:bg-orange-600' : 'bg-slate-700 cursor-not-allowed text-slate-300'
            }`}
          >
            {isAvailable ? '🟢 Available for dispatch' : phase !== "IDLE" ? '🔴 En Route' : '🟠 Offline'}
          </button>
        </div>

        {activeRequest && (
          <div className="bg-slate-800 p-4 rounded-xl mb-6">
            <h3 className="font-bold text-lg mb-2 text-white">Active Mission</h3>
            <p className="text-sm text-slate-300 mb-1"><span className="text-slate-500">Patient:</span> {activeRequest.patientName}</p>
            {phase === "TO_HOSPITAL" && activeRequest.hospital && (
              <p className="text-sm text-red-400 mb-4"><span className="text-slate-500">Dest:</span> {activeRequest.hospital.name}</p>
            )}
            
            {routeInfo && (
              <div className="grid grid-cols-2 gap-2 mb-4 bg-slate-900 border border-slate-700 p-3 rounded-lg">
                <div>
                  <div className="text-xs text-slate-500">Distance</div>
                  <div className="font-mono text-sm">{routeInfo.distance}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">ETA</div>
                  <div className="font-mono text-sm text-green-400">{routeInfo.duration}</div>
                </div>
              </div>
            )}

            {phase === "TO_PATIENT" ? (
              <button 
                onClick={handleArrivedAtPatient}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold flex items-center justify-center transition"
              >
                <MapPin className="h-4 w-4 mr-2" /> Arrived at Patient
              </button>
            ) : (
              <button 
                onClick={handleCompletedTrip}
                className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold flex items-center justify-center transition"
              >
                <CheckCircle className="h-4 w-4 mr-2" /> Patient Transferred
              </button>
            )}
          </div>
        )}

        <div className="mt-auto">
          <p className="text-sm text-slate-400">Driver ID</p>
          <p className="font-mono text-lg">DRV-3849</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4 md:p-6 flex flex-col h-screen md:h-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4 shrink-0">
          {phase === "IDLE" ? "Nearby Emergencies" : phase === "TO_PATIENT" ? "Navigating to Patient" : "Navigating to Hospital"}
        </h1>
        
        {phase === "IDLE" ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 auto-rows-max overflow-y-auto">
            {isAvailable ? requests.map((r) => (
              <div key={r.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col hover:border-red-300 transition">
                <div className="flex justify-between items-start mb-3">
                  <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold uppercase">{r.urg} Priority</span>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-4">{r.patientName}</h3>
                <button 
                  onClick={() => acceptRequest(r)}
                  className="mt-auto w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-md shadow-red-500/20 transition flex items-center justify-center"
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  Accept & Route
                </button>
              </div>
            )) : (
              <div className="col-span-full p-12 text-center text-slate-500 bg-white rounded-2xl border border-dashed border-slate-300">
                You are currently offline. Switch status to green to receive dispatch requests.
              </div>
            )}
            {requests.length === 0 && isAvailable && (
              <div className="col-span-full p-12 text-center text-slate-500 bg-white rounded-2xl border border-dashed border-slate-300">
                No active emergencies in your vicinity.
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 relative bg-slate-200 rounded-2xl overflow-hidden shadow-inner border border-slate-300 min-h-[50vh]">
            {isMounted && (
              <MapComponent 
                center={[driverLocation.latitude, driverLocation.longitude]} 
                zoom={14} 
                height="100%"
                markers={[
                  { position: [driverLocation.latitude, driverLocation.longitude], label: "Your Location (Ambulance)", type: 'ambulance' },
                  ...(activeRequest && phase === "TO_PATIENT" ? [{ position: [activeRequest.loc.latitude, activeRequest.loc.longitude] as [number, number], label: `Patient: ${activeRequest.patientName}`, type: 'patient' as const }] : []),
                  ...(activeRequest && phase === "TO_HOSPITAL" && activeRequest.hospital ? [{ position: [activeRequest.hospital.latitude, activeRequest.hospital.longitude] as [number, number], label: `Destination: ${activeRequest.hospital.name}`, type: 'hospital' as const }] : [])
                ]}
                polyLine={routePath as [number, number][]}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
