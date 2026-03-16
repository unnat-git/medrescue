"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Activity, 
  Shield, 
  User, 
  Heart, 
  AlertCircle, 
  Phone, 
  ArrowLeft, 
  CheckCircle,
  Activity as Pulse,
  ArrowRight,
  ClipboardList,
  Stethoscope,
  Pill,
  Save,
  Menu,
  X
} from 'lucide-react';
import { API_ENDPOINTS } from "@/config/api";

export default function CreateProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [error, setError] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
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
        setError('Network error contacting backend.');
     } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="p-2 bg-red-600 rounded-2xl shadow-lg shadow-red-200 group-hover:scale-110 transition-transform">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-black text-slate-900 tracking-tight">MedRescue</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-6">
              <Link href="/profile" className="text-slate-500 hover:text-slate-900 font-bold transition-colors">Dashboard</Link>
              <button 
                onClick={handleLogout}
                className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-red-600 transition-all transform hover:-translate-y-0.5"
              >
                Logout
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-slate-900 bg-slate-50 rounded-xl"
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-20 inset-x-0 bg-white border-b border-slate-100 p-4 space-y-4 animate-in slide-in-from-top-4">
            <Link href="/profile" className="block w-full p-4 bg-slate-50 rounded-2xl font-bold text-slate-900">Dashboard</Link>
            <button 
                onClick={handleLogout}
                className="w-full p-4 bg-red-600 text-white rounded-2xl font-bold"
            >
              Logout
            </button>
          </div>
        )}
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="mb-10 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
                <Link href="/profile" className="inline-flex items-center gap-2 text-slate-400 hover:text-red-600 font-black uppercase tracking-widest text-[10px] mb-4 transition-colors">
                    <ArrowLeft className="h-4 w-4" />
                    Back to dashboard
                </Link>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                    {isEdit ? 'Update Profile' : 'Medical Profile'}
                </h1>
                <p className="mt-3 text-slate-500 font-medium text-lg max-w-xl">
                    Required for your emergency QR code identity and rapid rescue services.
                </p>
            </div>
            {!isEdit && (
                <div className="flex items-center gap-3 bg-red-50 text-red-600 px-6 py-4 rounded-[2rem] font-black text-sm self-center md:self-end">
                    <Shield className="h-5 w-5" />
                    Last Step to Security
                </div>
            )}
        </div>

        <div className="bg-white shadow-2xl shadow-slate-200/60 sm:rounded-[3rem] border border-slate-100 overflow-hidden">
            <div className="bg-slate-900 p-8 md:p-12 text-white flex items-center justify-between relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-2xl font-black mb-2 flex items-center gap-3">
                        <Pulse className="h-6 w-6 text-red-500" />
                        Health Overview
                    </h2>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Critical Records Layer</p>
                </div>
                <div className="absolute top-0 right-0 -m-8 w-64 h-64 bg-red-600/10 rounded-full blur-3xl"></div>
                <ClipboardList className="h-20 w-20 text-white/5 absolute -right-2 top-4 rotate-12" />
            </div>

            <form onSubmit={handleSubmit} className="p-6 md:p-12 space-y-10">
                {error && (
                    <div className="bg-red-50 border border-red-100 text-red-600 p-5 rounded-3xl text-sm font-bold flex items-center gap-4 animate-in fade-in slide-in-from-top-2">
                        <AlertCircle className="h-6 w-6 shrink-0" />
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                    <div className="space-y-4">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                            Blood Group
                        </label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                <Heart className="h-5 w-5 text-red-500 group-focus-within:scale-110 transition-transform" />
                            </div>
                            <select 
                                required 
                                name="blood_group" 
                                onChange={handleChange} 
                                value={formData.blood_group} 
                                className="w-full pl-14 pr-4 py-5 bg-slate-50 border-none rounded-2xl text-slate-900 font-black focus:ring-4 focus:ring-red-600/10 ring-offset-0 transition-all shadow-inner appearance-none cursor-pointer"
                            >
                                <option value="">Select Group</option>
                                {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(bg => (
                                    <option key={bg} value={bg}>{bg}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-4 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-4">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                                Emergency Contact Name
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-slate-400 group-focus-within:text-red-500 transition-colors" />
                                </div>
                                <input 
                                    required 
                                    name="emergency_contact_name" 
                                    onChange={handleChange} 
                                    value={formData.emergency_contact_name} 
                                    className="w-full pl-14 pr-4 py-5 bg-slate-50 border-none rounded-2xl text-slate-900 font-bold placeholder:text-slate-300 focus:ring-4 focus:ring-red-600/10 ring-offset-0 transition-all shadow-inner" 
                                    placeholder="Full Name" 
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                                Emergency Contact Phone
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                    <Phone className="h-5 w-5 text-slate-400 group-focus-within:text-red-500 transition-colors" />
                                </div>
                                <input 
                                    required 
                                    name="emergency_contact_phone" 
                                    onChange={handleChange} 
                                    value={formData.emergency_contact_phone} 
                                    className="w-full pl-14 pr-4 py-5 bg-slate-50 border-none rounded-2xl text-slate-900 font-bold placeholder:text-slate-300 focus:ring-4 focus:ring-red-600/10 ring-offset-0 transition-all shadow-inner" 
                                    placeholder="Enter Phone Number" 
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 md:col-span-2">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                            <div className="space-y-4">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                                    <Shield className="h-3 w-3 text-amber-500" />
                                    Allergies
                                </label>
                                <textarea 
                                    name="allergies" 
                                    onChange={handleChange} 
                                    value={formData.allergies} 
                                    rows={4} 
                                    className="w-full px-6 py-5 bg-slate-50 border-none rounded-3xl text-slate-900 font-bold placeholder:text-slate-300 focus:ring-4 focus:ring-red-600/10 ring-offset-0 transition-all shadow-inner resize-none" 
                                    placeholder="e.g. Peanuts, Penicillin..."
                                ></textarea>
                            </div>

                            <div className="space-y-4">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                                    <Stethoscope className="h-3 w-3 text-blue-500" />
                                    Chronic Diseases
                                </label>
                                <textarea 
                                    name="chronic_diseases" 
                                    onChange={handleChange} 
                                    value={formData.chronic_diseases} 
                                    rows={4} 
                                    className="w-full px-6 py-5 bg-slate-50 border-none rounded-3xl text-slate-900 font-bold placeholder:text-slate-300 focus:ring-4 focus:ring-red-600/10 ring-offset-0 transition-all shadow-inner resize-none" 
                                    placeholder="e.g. Diabetes, Asthma..."
                                ></textarea>
                            </div>

                            <div className="space-y-4">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                                    <Pill className="h-3 w-3 text-emerald-500" />
                                    Medications
                                </label>
                                <textarea 
                                    name="medications" 
                                    onChange={handleChange} 
                                    value={formData.medications} 
                                    rows={4} 
                                    className="w-full px-6 py-5 bg-slate-50 border-none rounded-3xl text-slate-900 font-bold placeholder:text-slate-300 focus:ring-4 focus:ring-red-600/10 ring-offset-0 transition-all shadow-inner resize-none" 
                                    placeholder="e.g. Metformin 500mg..."
                                ></textarea>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-10 flex flex-col sm:flex-row gap-6">
                    <button 
                        disabled={loading}
                        type="submit" 
                        className="flex-1 h-20 bg-red-600 hover:bg-slate-900 text-white font-black text-xl rounded-3xl shadow-2xl shadow-red-200 transition-all transform hover:-translate-y-1 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-4 group"
                    >
                        {loading ? (
                            <div className="h-8 w-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <Save className="h-6 w-6 group-hover:scale-110 transition-transform" />
                                {isEdit ? 'Update Medical Profile' : 'Save & Secure Profile'}
                            </>
                        )}
                    </button>
                    {!isEdit && (
                        <div className="flex items-center justify-center gap-2 text-slate-400 font-black uppercase tracking-widest text-[10px] px-8">
                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                            Final Security Layer
                        </div>
                    )}
                </div>
            </form>
        </div>

        <div className="mt-12 text-center pb-20">
            <p className="text-slate-400 font-medium text-sm">
                Your data is encrypted and only accessible to verified rescuers in life-critical emergencies.
            </p>
        </div>
      </div>
    </div>
  );
}
