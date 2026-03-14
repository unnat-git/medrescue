"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Activity, Shield, Heart, AlertCircle, Phone, User } from 'lucide-react';
import { API_ENDPOINTS } from "@/config/api";
import { MedicalProfile } from "@/types";



export default function PatientProfile() {
  const { id } = useParams();
  const [profile, setProfile] = useState<MedicalProfile | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(API_ENDPOINTS.PROFILE.PUBLIC(id as string))

      .then(res => {
        if (!res.ok) throw new Error("Profile not found");
        return res.json();
      })
      .then(data => {
        setProfile(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col bg-slate-50">
        <Activity className="h-12 w-12 text-red-600 animate-pulse" />
        <p className="mt-4 text-slate-500 font-medium tracking-wide">Accessing Emergency Data...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="bg-white rounded-3xl p-8 shadow-xl max-w-md text-center border border-slate-100">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Profile Not Found</h2>
            <p className="text-slate-500 mt-2">The medical identity you are looking for does not exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-red-600 rounded-[2.5rem] shadow-2xl shadow-red-200 overflow-hidden transform transition duration-500 hover:scale-[1.01]">
          <div className="px-8 py-10 text-center text-white relative">
            <Shield className="absolute top-4 right-4 h-8 w-8 text-white/20" />
            <h2 className="text-4xl font-black tracking-tight mb-2">{profile.full_name}</h2>
            <p className="text-red-100 font-bold uppercase tracking-widest text-sm">Emergency Medical Profile</p>
          </div>
          
          <div className="bg-white p-8 grid grid-cols-2 gap-6">
            <div className="bg-red-50 border border-red-100 p-6 rounded-3xl flex flex-col items-center justify-center shadow-inner">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Blood Group</p>
              <p className="text-5xl font-black text-red-600">{profile.blood_group}</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-3xl flex flex-col justify-center shadow-inner">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                <User className="h-3 w-3" />
                Patient ID
              </p>
              <p className="text-2xl font-bold text-slate-800">#{profile.id.toString().padStart(5, '0')}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
               <p className="text-slate-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2 px-1">
                 <AlertCircle className="h-3 w-3 text-amber-500" />
                 Allergies
               </p>
               <div className={`p-4 rounded-2xl border font-bold text-lg ${profile.allergies ? 'bg-red-50 text-red-900 border-red-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                 {profile.allergies || 'No known allergies'}
               </div>
            </div>

            <div className="space-y-2">
               <p className="text-slate-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2 px-1 text-slate-500">
                 Chronic Diseases
               </p>
               <p className="text-lg text-slate-800 font-bold p-1">{profile.chronic_diseases || 'None reported'}</p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2 px-1">
              Current Medications
            </p>
            <div className="bg-slate-50/50 p-5 rounded-3xl border border-slate-100">
              <p className="text-lg text-slate-800 font-medium whitespace-pre-wrap">{profile.medications || 'None reported'}</p>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="space-y-1">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                <Phone className="h-3 w-3 text-blue-500" />
                Emergency Contact
              </p>
              <p className="text-xl font-black text-slate-900">{profile.emergency_contact_name}</p>
              <p className="text-blue-600 font-bold text-lg">{profile.emergency_contact_phone}</p>
            </div>
            
            <div className="flex items-end justify-end">
                <div className="bg-slate-900 text-white px-6 py-3 rounded-2xl flex items-center gap-3">
                    <Activity className="h-5 w-5 text-red-500" />
                    <span className="font-bold tracking-tight">MedRescue Verified</span>
                </div>
            </div>
          </div>
        </div>
        
        <p className="text-center text-slate-400 text-sm font-medium">
            This information is provided for emergency medical response only.
        </p>
      </div>
    </div>
  );
}
