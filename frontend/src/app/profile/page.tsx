"use client";

import Link from "next/link";
import { User, Activity, Shield, Phone, MapPin } from "lucide-react";

export default function ProfilePage() {
  // Mock data - in a real app, this would be fetched from /api/patients
  const profile = {
    name: "John Doe",
    age: 32,
    bloodType: "O+",
    allergies: "Peanuts, Penicillin",
    conditions: "None",
    emergencyContact: "Jane Doe (Wife) - +1 234 567 890"
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="px-6 py-4 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-10">
        <Link href="/" className="flex items-center gap-2">
          <Activity className="h-6 w-6 text-red-600" />
          <span className="font-bold text-xl text-slate-900 tracking-tight">MedRescue</span>
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
            <User className="h-5 w-5 text-slate-500" />
          </div>
          <span className="font-semibold text-slate-700 hidden sm:block">{profile.name}</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 md:p-10">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900">Your Medical Profile</h1>
          <p className="text-slate-500 mt-1">Manage your health records and emergency identity</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-600" />
                Critical Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Blood Group</label>
                  <p className="text-lg font-bold text-red-600 mt-1">{profile.bloodType}</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Allergies</label>
                  <p className="text-lg font-bold text-slate-800 mt-1">{profile.allergies}</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Chronic Conditions</label>
                  <p className="text-lg font-bold text-slate-800 mt-1">{profile.conditions}</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Age</label>
                  <p className="text-lg font-bold text-slate-800 mt-1">{profile.age} years</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Phone className="h-5 w-5 text-blue-600" />
                Emergency Contact
              </h2>
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                <p className="font-bold text-blue-900 text-lg">{profile.emergencyContact}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-10 w-10 text-red-600" />
              </div>
              <h3 className="font-bold text-slate-900">Emergency Actions</h3>
              <p className="text-sm text-slate-500 mt-2 mb-6">Need immediate assistance?</p>
              <Link 
                href="/emergency" 
                className="block w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition shadow-lg shadow-red-200"
              >
                Trigger SOS
              </Link>
            </div>
            
            <div className="bg-slate-900 rounded-2xl p-6 shadow-sm text-center text-white">
              <div className="mb-4 flex justify-center">
                <div className="p-3 bg-white/10 rounded-xl">
                    {/* Placeholder for QR Code */}
                    <div className="w-32 h-32 bg-white flex items-center justify-center rounded-lg text-slate-900 text-[10px] font-bold">
                        MEDICAL QR ID
                    </div>
                </div>
              </div>
              <h3 className="font-bold">Digital Medical ID</h3>
              <p className="text-xs text-slate-400 mt-2">QR Code for emergency responders to scan</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
