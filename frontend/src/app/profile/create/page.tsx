"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '', age: '', gender: '', blood_group: '', allergies: '', 
    chronic_conditions: '', current_medications: '', past_surgeries: '', 
    emergency_contact: '', doctor_name: ''
  });

  const inputStyle =
    "w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-red-500";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${API_BASE}/api/patients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, age: parseInt(formData.age) })
      });
      if (res.ok) {
        const data = await res.json();
        alert('Profile created systematically! Redirecting to your Medical QR Code...');
        router.push(`/patient/${data.patient.id}`);
      } else {
        alert('Error creating profile. Please check the backend connection.');
      }
    } catch (error) {
       console.error(error);
       alert('Network error contacting backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-red-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto p-8 md:p-12">
        <div className="text-center mb-10">
          <h2 className="text-5xl font-extrabold text-slate-900 mb-3 tracking-tight">Digital Medical Identity</h2>
          <p className="text-slate-500 text-lg font-medium">Create your MedRescue profile for rapid emergency response.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1 md:col-span-2 space-y-2">
              <label className="text-sm font-bold text-slate-700">Full Name</label>
              <input required name="name" onChange={handleChange} value={formData.name} className={inputStyle} placeholder="John Doe" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Age</label>
              <input required type="number" name="age" onChange={handleChange} value={formData.age} className={inputStyle} placeholder="32" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Gender</label>
              <select required name="gender" onChange={handleChange} value={formData.gender} className={inputStyle}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Blood Group</label>
              <select required name="blood_group" onChange={handleChange} value={formData.blood_group} className={inputStyle}>
                <option value="">Select Blood Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Emergency Contact</label>
              <input required name="emergency_contact" onChange={handleChange} value={formData.emergency_contact} className={inputStyle} placeholder="Phone Number" />
            </div>

            <div className="col-span-1 md:col-span-2 space-y-2">
              <label className="text-sm font-bold text-slate-700">Allergies</label>
              <textarea name="allergies" onChange={handleChange} value={formData.allergies} rows={2} className={`${inputStyle} resize-none`} placeholder="E.g. Penicillin, Peanuts (or 'None')"></textarea>
            </div>

            <div className="col-span-1 md:col-span-2 space-y-2">
              <label className="text-sm font-bold text-slate-700">Chronic Conditions</label>
              <textarea name="chronic_conditions" onChange={handleChange} value={formData.chronic_conditions} rows={2} className={`${inputStyle} resize-none`} placeholder="E.g. Type 2 Diabetes, Asthma"></textarea>
            </div>

            <div className="col-span-1 md:col-span-2 space-y-2">
              <label className="text-sm font-bold text-slate-700">Current Medications & Past Surgeries</label>
              <textarea name="current_medications" onChange={handleChange} value={formData.current_medications} rows={3} className={`${inputStyle} resize-none`} placeholder="Medications, dosages, and relevant medical history..."></textarea>
            </div>
            
            <div className="col-span-1 md:col-span-2 space-y-2">
              <label className="text-sm font-bold text-slate-700">Primary Doctor Name (Optional)</label>
              <input name="doctor_name" onChange={handleChange} value={formData.doctor_name} className={inputStyle} placeholder="Dr. Smith" />
            </div>
          </div>

          <div className="pt-6">
            <button 
              disabled={loading}
              type="submit" 
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-lg py-5 rounded-2xl shadow-lg shadow-red-500/30 transition disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Profile...' : 'Create & Generate QR ID'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
