"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Activity, LogIn, UserPlus, Menu, X } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/profile");
      return;
    }
    setIsLoggedIn(false);
  }, [router]);

  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900 overflow-hidden relative">
      <header className="px-4 lg:px-6 h-20 flex items-center border-b border-gray-100 shadow-sm sticky top-0 bg-white z-50">
        <Link className="flex items-center justify-center group" href="/">
          <div className="p-2 bg-red-50 rounded-xl group-hover:bg-red-100 transition-colors">
            <Activity className="h-6 w-6 text-red-600" />
          </div>
          <span className="ml-3 font-black text-2xl tracking-tight text-slate-900">MedRescue</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="ml-auto hidden md:flex gap-8 items-center">
          <Link className="text-sm font-bold text-slate-600 hover:text-red-600 transition-colors" href="/profile">
            Medical Profile
          </Link>

          {!isLoggedIn ? (
            <div className="flex items-center gap-4 pl-4 border-l border-slate-100">
              <Link href="/login" className="text-sm font-bold text-slate-700 hover:text-red-600 transition-colors flex items-center gap-1.5">
                <LogIn className="h-4 w-4" />
                Login
              </Link>
              <Link href="/signup" className="text-sm font-bold text-white bg-red-600 px-6 py-2.5 rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-200 hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Sign Up
              </Link>
            </div>
          ) : (
            <Link href="/profile" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200">
               <Activity className="h-5 w-5" />
            </Link>
          )}
        </nav>

        {/* Mobile menu button */}
        <button 
          className="ml-auto md:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Mobile Navigation Overlay */}
        {isMenuOpen && (
          <div className="fixed inset-0 top-20 bg-white z-40 md:hidden animate-in fade-in slide-in-from-top-4 duration-200">
            <div className="flex flex-col p-6 gap-6">
              <Link 
                href="/profile" 
                className="text-lg font-bold text-slate-800 p-4 bg-slate-50 rounded-2xl flex items-center justify-between"
                onClick={() => setIsMenuOpen(false)}
              >
                Medical Profile
                <Activity className="h-5 w-5 text-red-600" />
              </Link>
              
              {!isLoggedIn ? (
                <div className="grid grid-cols-1 gap-4 pt-4">
                  <Link 
                    href="/login" 
                    className="flex items-center justify-center gap-2 h-14 font-bold text-slate-700 bg-slate-50 rounded-2xl"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <LogIn className="h-5 w-5" />
                    Login
                  </Link>
                  <Link 
                    href="/signup" 
                    className="flex items-center justify-center gap-2 h-14 font-bold text-white bg-red-600 rounded-2xl shadow-lg shadow-red-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <UserPlus className="h-5 w-5" />
                    Sign Up
                  </Link>
                </div>
              ) : (
                <Link 
                  href="/profile" 
                  className="flex items-center justify-center gap-2 h-14 font-bold text-white bg-slate-900 rounded-2xl"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Activity className="h-5 w-5" />
                  Go to Dashboard
                </Link>
              )}
            </div>
          </div>
        )}
      </header>
      <main className="flex-1 flex items-center justify-center py-12 md:py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Left Content */}
            <div className="space-y-10 flex flex-col items-center lg:items-start text-center lg:text-left">
              <div className="space-y-6">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 leading-[1.1]">
                  Emergency Medical <br className="hidden md:block"/>
                  <span className="text-red-600">Quick Response</span> System
                </h1>
                <p className="max-w-[600px] text-lg md:text-xl text-slate-500 font-medium leading-relaxed">
                  One-click emergency help, real-time tracking, and a digital QR medical ID. Verified medical records, instant response.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Link
                  href="/emergency"
                  className="inline-flex h-16 items-center justify-center rounded-[2rem] bg-red-600 px-10 text-lg font-black text-white shadow-2xl shadow-red-200 hover:bg-red-700 transition-all transform hover:-translate-y-1 active:translate-y-0"
                >
                  Request Help Now
                </Link>

                <Link
                  href="/profile/create"
                  className="inline-flex h-16 items-center justify-center rounded-[2rem] border-2 border-slate-100 bg-white px-10 text-lg font-black text-slate-700 hover:bg-slate-50 transition-all transform hover:-translate-y-1 active:translate-y-0"
                >
                  Setup Digital ID
                </Link>
              </div>
              
              <div className="flex items-center gap-8 pt-4">
                <div className="flex flex-col">
                  <span className="text-3xl font-black text-slate-900">24/7</span>
                  <span className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">Available</span>
                </div>
                <div className="h-12 w-px bg-slate-100"></div>
                <div className="flex flex-col">
                  <span className="text-3xl font-black text-slate-900">100+</span>
                  <span className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">Rescuers</span>
                </div>
              </div>
            </div>

            {/* Right Video Animation */}
            <div className="relative flex justify-center lg:justify-end order-first lg:order-last">
              <div className="relative w-full max-w-[450px] lg:max-w-[550px] aspect-square rounded-[3rem] lg:rounded-[4rem] overflow-hidden shadow-2xl shadow-slate-200 border-8 border-white">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                >
                  <source src="/assets/animated_video.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              {/* Background Glow */}
              <div className="absolute -z-10 w-64 h-64 bg-red-100/50 rounded-full blur-[100px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
            </div>
          </div>
        </div>
      </main>
      <footer className="py-6 w-full shrink-0 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-center text-center px-4 md:px-6">
        <p className="text-sm text-gray-500">© 2026 MedRescue. All rights reserved.</p>
      </footer>
    </div>
  );
}
