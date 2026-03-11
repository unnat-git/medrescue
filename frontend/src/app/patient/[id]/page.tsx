"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function PatientProfile() {
  const { id } = useParams();
  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch patient data from backend
    fetch(`http://localhost:8000/api/patients/${id}`)
      .then(res => res.json())
      .then(data => {
        setPatient(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col bg-slate-50">
        <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-500 font-medium">Loading Profile...</p>
      </div>
    );
  }

  if (!patient || patient.message === 'Patient not found') {
    return <div className="min-h-screen flex items-center justify-center text-red-500 text-xl font-bold bg-slate-50">Patient not found</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        {/* QR Code section */}
        <div className="bg-white rounded-3xl shadow-lg border border-red-100 overflow-hidden mb-8 transform transition duration-500 hover:scale-[1.01]">
          <div className="bg-red-600 px-6 py-8 text-center text-white">
            <h2 className="text-4xl font-extrabold tracking-tight">{patient.name}</h2>
            <p className="text-red-100 mt-2 font-medium">Emergency Medical Profile</p>
          </div>
          <div className="p-8 flex flex-col items-center">
             <div className="w-56 h-56 bg-white border-4 border-red-100 rounded-2xl flex items-center justify-center mb-6 shadow-inner relative overflow-hidden group">
               {/* Placeholder for actual rendering of QR code */}
               <img 
                 src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://medrescue.app/patient/${id}`} 
                 alt="QR Code" 
                 className="w-48 h-48 opacity-90 group-hover:opacity-100 transition" 
               />
             </div>
             <p className="text-slate-500 text-center text-sm max-w-sm">
               Scan this code to instantly access critical medical history for emergency responders.
             </p>
          </div>
        </div>

        {/* Patient Details */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 space-y-8">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-red-50 border border-red-100 p-5 rounded-2xl flex flex-col items-center justify-center">
              <p className="text-slate-500 text-sm font-semibold mb-1 text-center">Blood Group</p>
              <p className="text-4xl font-extrabold text-red-600">{patient.blood_group}</p>
            </div>
            <div className="bg-slate-50 p-5 rounded-2xl flex flex-col justify-center">
              <p className="text-slate-500 text-sm font-semibold mb-1">Age / Gender</p>
              <p className="text-2xl font-bold text-slate-800">{patient.age} / {patient.gender}</p>
            </div>
          </div>

          <div className="space-y-5 px-2">
            <div>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">Allergies</p>
              <p className="text-lg font-medium text-slate-900 bg-red-50 p-4 rounded-xl border border-red-100">{patient.allergies || 'None'}</p>
            </div>
            <div>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">Chronic Conditions</p>
              <p className="text-lg text-slate-800 font-medium">{patient.chronic_conditions || 'None known'}</p>
            </div>
            <div>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">Medications & Surgeries</p>
              <p className="text-lg text-slate-800 font-medium">{patient.current_medications || 'None known'}</p>
            </div>
            <div className="pt-6 border-t border-gray-100 mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Emergency Contact</p>
                <p className="text-xl font-bold text-slate-900">{patient.emergency_contact}</p>
              </div>
              {patient.doctor_name && (
                <div>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Primary Care</p>
                  <p className="text-xl font-bold text-slate-900">{patient.doctor_name}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
