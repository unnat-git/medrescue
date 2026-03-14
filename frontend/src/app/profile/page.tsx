"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Activity, Shield, Phone, MapPin, Download, Edit3, PlusCircle, LogOut } from "lucide-react";
import { API_ENDPOINTS } from "@/config/api";

import QRCode from "qrcode";

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
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
        generateQRCode(data.id);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const generateQRCode = async (profileId: number) => {
    try {
      // Encode either the profile ID or a full URL
      const url = `${window.location.origin}/patient/${profileId}`;
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
      qrRef.current.download = `medrescue-qr-${profile?.id}.png`;
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
    <div className="min-h-screen bg-slate-50">
      <header className="px-6 py-4 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-20">
        <Link href="/" className="flex items-center gap-2">
          <Activity className="h-6 w-6 text-red-600" />
          <span className="font-bold text-xl text-slate-900 tracking-tight">MedRescue</span>
        </Link>
        <div className="flex items-center gap-4">
          <button 
            onClick={handleLogout}
            className="p-2 text-slate-400 hover:text-red-600 transition-colors"
            title="Log Out"
          >
            <LogOut className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
            <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <span className="font-semibold text-slate-700 hidden sm:block">
              {profile ? "My Profile" : "User Dashboard"}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 md:p-10">
        {!profile ? (
          <div className="bg-white rounded-3xl p-12 shadow-xl shadow-slate-200/50 border border-slate-100 text-center max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <PlusCircle className="h-10 w-10 text-red-600" />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900">Create Your Medical Profile</h1>
            <p className="text-slate-500 mt-4 mb-8 text-lg">
                You haven't setup your medical identity yet. Creating a profile allows emergency responders to access your critical health data instantly via QR code.
            </p>
            <Link 
                href="/profile/create"
                className="inline-flex items-center justify-center px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl shadow-lg shadow-red-200 transition-all transform hover:-translate-y-1"
            >
                Start Setup Now
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900">Medical Dashboard</h1>
                    <p className="text-slate-500 mt-1">Manage your health records and digital ID</p>
                </div>
                <Link 
                    href="/profile/create" 
                    className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors"
                >
                    <Edit3 className="h-4 w-4" />
                    Edit Profile
                </Link>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                <h2 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                  <div className="p-2 bg-red-50 rounded-lg">
                    <Shield className="h-5 w-5 text-red-600" />
                  </div>
                  Critical Health Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Blood Group</label>
                    <p className="text-2xl font-black text-red-600 mt-1">{profile.blood_group}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Emergency Contact</label>
                    <p className="text-lg font-bold text-slate-800 mt-1">{profile.emergency_contact_name}</p>
                    <p className="text-slate-500 font-medium">{profile.emergency_contact_phone}</p>
                  </div>
                  <div className="sm:col-span-2 border-t border-slate-50 pt-6">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Allergies</label>
                    <p className="text-lg font-semibold text-slate-800 mt-1">{profile.allergies || 'No known allergies'}</p>
                  </div>
                  <div className="sm:col-span-2 border-t border-slate-50 pt-6">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Chronic Diseases</label>
                    <p className="text-lg font-semibold text-slate-800 mt-1">{profile.chronic_diseases || 'None reported'}</p>
                  </div>
                  <div className="sm:col-span-2 border-t border-slate-50 pt-6">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Current Medications</label>
                    <p className="text-lg font-semibold text-slate-800 mt-1">{profile.medications || 'None reported'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-600 rounded-3xl p-8 shadow-lg shadow-blue-200 flex flex-col sm:flex-row items-center justify-between text-white gap-6">
                  <div className="max-w-md">
                      <h3 className="text-xl font-bold mb-2">Need Help?</h3>
                      <p className="text-blue-100">Instantly request an ambulance and share your medical profile with emergency responders.</p>
                  </div>
                  <Link 
                    href="/emergency" 
                    className="whitespace-nowrap px-8 py-4 bg-white text-blue-600 font-black rounded-2xl hover:bg-blue-50 transition-colors"
                  >
                    Trigger Emergency SOS
                  </Link>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl shadow-slate-900/40 text-center text-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-blue-500 to-red-500"></div>
                <div className="mb-8 mt-4 inline-block p-4 bg-white rounded-3xl shadow-lg">
                    {qrCodeUrl ? (
                      <img src={qrCodeUrl} alt="Medical QR Code" className="w-48 h-48 rounded-xl" />
                    ) : (
                      <div className="w-48 h-48 bg-slate-100 rounded-xl animate-pulse"></div>
                    )}
                </div>
                <h3 className="text-2xl font-black tracking-tight">Digital Medical ID</h3>
                <p className="text-slate-400 mt-2 mb-8 text-sm px-4">
                  Emergency responders can scan this code to view your critical medical data instantly.
                </p>
                <div className="grid grid-cols-1 gap-4">
                    <button 
                        onClick={downloadQR}
                        className="flex items-center justify-center gap-2 w-full py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold transition-all"
                    >
                        <Download className="h-5 w-5" />
                        Download QR Code
                    </button>
                    <a ref={qrRef} className="hidden" />
                </div>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-4">
                      <MapPin className="h-8 w-8 text-red-600" />
                  </div>
                  <h4 className="font-bold text-slate-900">Nearby Hospitals</h4>
                  <p className="text-sm text-slate-500 mt-2 mb-6">Find the closest medical facilities in case of self-transport.</p>
                  <Link 
                    href="/hospitals-nearby" 
                    className="w-full py-3 bg-slate-50 hover:bg-slate-100 text-slate-900 rounded-xl text-sm font-bold transition-colors"
                  >
                    View Map
                  </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
