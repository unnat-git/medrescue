"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Activity, LogIn, UserPlus } from "lucide-react";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-gray-100 shadow-sm sticky top-0 bg-white z-50">
        <Link className="flex items-center justify-center" href="/">
          <Activity className="h-6 w-6 text-red-600" />
          <span className="ml-2 font-bold text-xl tracking-tight text-gray-900">MedRescue</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link className="text-sm font-medium hover:text-red-600 transition-colors" href="/profile">
            Medical Profile
          </Link>

          {!isLoggedIn ? (
            <>
              <Link href="/login" className="text-sm font-bold text-slate-700 hover:text-red-600 transition-colors flex items-center gap-1">
                <LogIn className="h-4 w-4" />
                Login
              </Link>
              <Link href="/signup" className="text-sm font-bold text-white bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-1 shadow-md shadow-red-200">
                <UserPlus className="h-4 w-4" />
                Sign Up
              </Link>
            </>
          ) : (
            <Link href="/profile" className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white">
               <Activity className="h-4 w-4" />
            </Link>
          )}
        </nav>

      </header>
      <main className="flex-1 flex items-center justify-center py-12 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8 flex flex-col items-center lg:items-start text-center lg:text-left">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight">
                  Emergency Medical <span className="text-red-600">Quick Response</span> System
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed xl:text-xl/relaxed">
                  One-click emergency help, real-time tracking, and a digital QR medical ID.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Link
                  href="/emergency"
                  className="inline-flex h-14 items-center justify-center rounded-2xl bg-red-600 px-10 text-base font-bold text-white shadow-xl shadow-red-200 hover:bg-red-700 transition transform hover:-translate-y-1"
                >
                  Request Emergency Help
                </Link>

                <Link
                  href="/profile/create"
                  className="inline-flex h-14 items-center justify-center rounded-2xl border-2 border-slate-100 bg-white px-10 text-base font-bold text-slate-700 hover:bg-slate-50 transition transform hover:-translate-y-1"
                >
                  Create Medical Profile
                </Link>
              </div>
              
              <div className="flex items-center gap-6 pt-4 text-slate-400">
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-slate-900">24/7</span>
                  <span className="text-xs uppercase tracking-widest font-bold">Availability</span>
                </div>
                <div className="h-10 w-px bg-slate-100"></div>
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-slate-900">100+</span>
                  <span className="text-xs uppercase tracking-widest font-bold">Rescuers</span>
                </div>
              </div>
            </div>

            {/* Right Video Animation */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[500px] aspect-square rounded-[3rem] overflow-hidden">
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
                {/* Subtle overlay to blend into UI better */}
                <div className="absolute inset-0 bg-transparent" />
              </div>
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
