"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Activity, Shield, User, Heart, AlertCircle, Phone, ArrowLeft } from 'lucide-react';
import { API_ENDPOINTS } from "@/config/api";


export default function CreateProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    blood_group: '', 
    allergies: '', 
    chronic_diseases: '', 
    medications: '', 
    emergency_contact_name: '', 
    emergency_contact_phone: ''
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    
    // Check if profile exists to enter Edit mode
    fetch(API_ENDPOINTS.PROFILE.BASE, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => {
      if (res.ok) return res.json();
      return null;
    })
    .then(data => {
      if (data) {
        setIsEdit(true);
        setFormData({
          blood_group: data.blood_group || '',
          allergies: data.allergies || '',
          chronic_diseases: data.chronic_diseases || '',
          medications: data.medications || '',
          emergency_contact_name: data.emergency_contact_name || '',
          emergency_contact_phone: data.emergency_contact_phone || ''
        });
      }
    })
    .catch(err => console.error("Error checking profile:", err));

  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      // Use POST for create, PUT for update
      const res = await fetch(API_ENDPOINTS.PROFILE.BASE, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });


      if (res.ok) {
        router.push('/profile');
      } else {
        const data = await res.json();
        setError(data.message || 'Error saving profile');
      }
     } catch (err: unknown) {
        console.error(err);
        setError('Network error contacting backend.');
     } finally {

      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
            <Link href="/profile" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors">
                <ArrowLeft className="h-5 w-5" />
                <span className="font-medium">Back to Dashboard</span>
            </Link>
            <div className="flex items-center gap-2">
                <Activity className="h-6 w-6 text-red-600" />
                <span className="font-bold text-xl text-slate-900 tracking-tight">MedRescue</span>
            </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
            <div className="bg-red-600 p-8 text-white relative overflow-hidden">
                <Shield className="absolute -right-4 -bottom-4 h-32 w-32 text-white/10 rotate-12" />
                <h1 className="text-3xl font-extrabold relative z-10">{isEdit ? 'Update Your Medical Profile' : 'Complete Your Medical Profile'}</h1>
                <p className="text-red-100 mt-2 relative z-10">This information will be encoded in your emergency QR code.</p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-8">
                {error && (
                    <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
                        <AlertCircle className="h-5 w-5" />
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                            <Heart className="h-4 w-4 text-red-500" />
                            Blood Group
                        </label>
                        <select 
                            required 
                            name="blood_group" 
                            onChange={handleChange} 
                            value={formData.blood_group} 
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                        >
                            <option value="">Select Blood Group</option>
                            {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(bg => (
                                <option key={bg} value={bg}>{bg}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                            <User className="h-4 w-4 text-blue-500" />
                            Emergency Contact Name
                        </label>
                        <input 
                            required 
                            name="emergency_contact_name" 
                            onChange={handleChange} 
                            value={formData.emergency_contact_name} 
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all" 
                            placeholder="Enter emergency contact name" 
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                            <Phone className="h-4 w-4 text-blue-500" />
                            Emergency Contact Phone
                        </label>
                        <input 
                            required 
                            name="emergency_contact_phone" 
                            onChange={handleChange} 
                            value={formData.emergency_contact_phone} 
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all" 
                            placeholder="Enter emergency contact phone number" 
                        />
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-amber-500" />
                            Allergies
                        </label>
                        <textarea 
                            name="allergies" 
                            onChange={handleChange} 
                            value={formData.allergies} 
                            rows={2} 
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all resize-none" 
                            placeholder="List your allergies (or type 'None')"
                        ></textarea>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                            Chronic Diseases
                        </label>
                        <textarea 
                            name="chronic_diseases" 
                            onChange={handleChange} 
                            value={formData.chronic_diseases} 
                            rows={2} 
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all resize-none" 
                            placeholder="List your chronic diseases (or type 'None')"
                        ></textarea>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                            Current Medications
                        </label>
                        <textarea 
                            name="medications" 
                            onChange={handleChange} 
                            value={formData.medications} 
                            rows={3} 
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all resize-none" 
                            placeholder="List your current medications and dosages"
                        ></textarea>
                    </div>
                </div>

                <button 
                    disabled={loading}
                    type="submit" 
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-xl py-4 rounded-2xl shadow-lg shadow-red-200 transition-all transform hover:-translate-y-1 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {loading ? 'Saving...' : (isEdit ? 'Update Profile & Refresh QR' : 'Save & Generate QR Identity')}
                </button>
            </form>
        </div>
      </div>
    </div>
  );
}
