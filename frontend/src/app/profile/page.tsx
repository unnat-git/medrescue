"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Activity, Shield, Phone, MapPin, Download, Edit3, PlusCircle, LogOut, ChevronRight, Menu, X } from "lucide-react";
import { API_ENDPOINTS } from "@/config/api";
import { MedicalProfile } from "@/types";
import QRCode from "qrcode";


export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<MedicalProfile | null>(null);

  const [loading, setLoading] = useState(true);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const qrRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetchProfile();
  }, [router]);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(API_ENDPOINTS.PROFILE.BASE, {
        headers: { Authorization: `Bearer ${token}` }
      });


      if (response.status === 404) {
        setProfile(null);
      } else if (response.ok) {
        const data = await response.json();
        setProfile(data);
        generateQRCode(data.patient_id);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const generateQRCode = async (patientId: string) => {
    try {
      // Encode the full public patient URL
      const url = `${window.location.origin}/patient/${patientId}`;
      const qrDataUrl = await QRCode.toDataURL(url, {
        width: 400,
        margin: 2,
        color: {
          dark: "#0f172a",
          light: "#ffffff"
        }
      });
      setQrCodeUrl(qrDataUrl);
    } catch (err) {
      console.error("QR Code error:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const downloadQR = () => {
    if (qrRef.current && qrCodeUrl) {
      qrRef.current.href = qrCodeUrl;
      qrRef.current.download = `medrescue-qr-${profile?.patient_id}.png`;
      qrRef.current.click();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Activity className="h-10 w-10 text-red-600 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white relative">
      <header className="px-6 py-4 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-1.5 bg-red-50 rounded-lg group-hover:bg-red-100 transition-colors">
            <Activity className="h-5 w-5 text-red-600" />
          </div>
          <span className="font-black text-xl text-slate-900 tracking-tight">MedRescue</span>
        </Link>
        
        {/* Desktop Header Content */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/dashboard/self-transport" className="flex items-center gap-1 text-sm font-bold text-slate-600 hover:text-red-600 transition-colors group">
            Self Transport
            <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-red-600 transition-colors" />
          </Link>
          <div className="flex items-center gap-4 border-l border-slate-100 pl-6">
            <button 
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-red-600 transition-colors bg-slate-50 rounded-xl"
              title="Log Out"
            >
              <LogOut className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
              <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-slate-700">
                {profile ? `${profile.patient_id}` : "Dashboard"}
              </span>
            </div>
          </div>
        </div>

        {/* Mobile menu button */}
        <button 
          className="md:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Mobile Navigation Overlay */}
        {isMenuOpen && (
          <div className="fixed inset-0 top-[73px] bg-white z-40 md:hidden animate-in fade-in slide-in-from-top-4 duration-200">
            <div className="flex flex-col p-6 gap-6">
              <div className="flex items-center gap-3 p-4 bg-slate-900 rounded-2xl text-white">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Logged In As</p>
                  <p className="font-bold">{profile?.patient_id || 'User'}</p>
                </div>
              </div>

              <Link 
                href="/dashboard/self-transport" 
                className="text-lg font-bold text-slate-800 p-5 bg-slate-50 rounded-2xl flex items-center justify-between"
                onClick={() => setIsMenuOpen(false)}
              >
                Self Transport
                <ChevronRight className="h-5 w-5 text-red-600" />
              </Link>
              
              <button 
                onClick={handleLogout}
                className="flex items-center justify-center gap-3 h-16 font-bold text-red-600 bg-red-50 rounded-2xl w-full"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="max-w-6xl mx-auto p-4 md:p-10">
        {!profile ? (
          <div className="bg-white rounded-[2rem] md:rounded-3xl p-8 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-100 text-center max-w-2xl mx-auto">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <PlusCircle className="h-8 w-8 md:h-10 md:w-10 text-red-600" />
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900">Create Medical Profile</h1>
            <p className="text-slate-500 mt-3 md:mt-4 mb-8 text-base md:text-lg">
                Create a profile to allow emergency responders to access your critical health data instantly via QR code.
            </p>
            <Link 
                href="/profile/create"
                className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl shadow-lg shadow-red-200 transition-all transform hover:-translate-y-1"
            >
                Start Setup Now
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-6 md:space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900">Dashboard</h1>
                    <p className="text-slate-500 font-medium">Manage your digital medical identity</p>
                </div>
                <Link 
                    href="/profile/create" 
                    className="flex items-center justify-center gap-2 px-6 h-12 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                >
                    <Edit3 className="h-4 w-4" />
                    Edit Profile
                </Link>
              </div>

              <div className="bg-white rounded-[2.5rem] p-6 md:p-8 shadow-sm border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-red-600"></div>
                <h2 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                  <Shield className="h-6 w-6 text-red-600" />
                  Health Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="bg-slate-50 p-4 rounded-2xl">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Blood Group</label>
                    <p className="text-3xl font-black text-red-600 leading-none">{profile.blood_group}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Emergency Contact</label>
                    <p className="text-lg font-bold text-slate-800 leading-tight">{profile.emergency_contact_name}</p>
                    <p className="text-slate-500 font-bold text-sm">{profile.emergency_contact_phone}</p>
                  </div>
                  <div className="sm:col-span-2 space-y-4">
                    <div className="p-4 border border-slate-100 rounded-2xl">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Allergies</label>
                      <p className="text-base font-bold text-slate-700">{profile.allergies || 'No known allergies'}</p>
                    </div>
                    <div className="p-4 border border-slate-100 rounded-2xl">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Chronic Diseases</label>
                      <p className="text-base font-bold text-slate-700">{profile.chronic_diseases || 'None reported'}</p>
                    </div>
                    <div className="p-4 border border-slate-100 rounded-2xl">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Current Medications</label>
                      <p className="text-base font-bold text-slate-700">{profile.medications || 'None reported'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-600 rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-blue-200 flex flex-col md:flex-row items-center justify-between text-white gap-8 relative overflow-hidden">
                  <div className="max-w-md text-center md:text-left z-10">
                      <h3 className="text-2xl font-black mb-2 italic">Need Help?</h3>
                      <p className="text-blue-100 font-medium">Instantly request an ambulance and share your profile with rescuers.</p>
                  </div>
                  <Link 
                    href="/emergency" 
                    className="w-full md:w-auto px-10 h-16 bg-white text-blue-600 font-black rounded-2xl hover:bg-blue-50 transition-all shadow-xl flex items-center justify-center z-10 transform hover:-translate-y-1"
                  >
                    Trigger Emergency SOS
                  </Link>
                  <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              </div>
            </div>

            <div className="space-y-8 order-first lg:order-last">
              <div className="bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl shadow-slate-900/40 text-center text-white relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 via-blue-500 to-red-500"></div>
                <div className="mb-8 mt-4 inline-block p-4 bg-white rounded-[2rem] shadow-2xl transform transition-transform group-hover:scale-105 duration-500">
                    {qrCodeUrl ? (
                      <img src={qrCodeUrl} alt="Medical QR Code" className="w-44 h-44 md:w-48 md:h-48 rounded-2xl" />
                    ) : (
                      <div className="w-44 h-44 md:w-48 md:h-48 bg-slate-100 rounded-2xl animate-pulse"></div>
                    )}
                </div>
                <h3 className="text-2xl font-black tracking-tight mb-2">Digital Medical ID</h3>
                <p className="text-slate-400 text-sm px-4 mb-8 font-medium">
                  Scan this code to view critical medical data instantly.
                </p>
                <div className="grid grid-cols-1 gap-4">
                    <button 
                        onClick={downloadQR}
                        className="flex items-center justify-center gap-3 w-full h-14 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-black transition-all border border-white/10"
                    >
                        <Download className="h-5 w-5 text-red-500" />
                        Download QR
                    </button>
                    <a ref={qrRef} className="hidden" />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
