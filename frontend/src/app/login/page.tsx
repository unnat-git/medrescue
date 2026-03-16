"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Activity, Lock, ArrowRight, Smartphone, AlertCircle } from "lucide-react";
import { API_ENDPOINTS } from "@/config/api";
import PhoneInputCustom from "@/components/PhoneInputCustom";

export default function LoginPage() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>();
  const [formData, setFormData] = useState({
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) {
      setError("Phone number is required");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone_number: phoneNumber,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        router.push("/profile");
      } else {
        setError(data.message || "Invalid credentials. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8">
        <Link href="/" className="flex justify-center items-center gap-3 mb-8 group">
          <div className="p-2 bg-red-600 rounded-2xl shadow-lg shadow-red-200 group-hover:scale-110 transition-transform">
            <Activity className="h-8 w-8 text-white" />
          </div>
          <span className="text-4xl font-black text-slate-900 tracking-tight">MedRescue</span>
        </Link>
        <h2 className="text-center text-3xl font-black text-slate-900 tracking-tight">Welcome Back</h2>
        <p className="mt-3 text-center text-slate-500 font-medium">
          Access your secure medical dashboard
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-10 px-6 sm:px-12 shadow-2xl shadow-slate-200/60 sm:rounded-[3rem] border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-red-50 rounded-full blur-3xl opacity-50"></div>
          
          <form className="space-y-8 relative z-10" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl text-sm font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="h-5 w-5 shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Phone Number</label>
              <div className="phone-input-container">
                <PhoneInputCustom
                    value={phoneNumber}
                    onChange={setPhoneNumber}
                    placeholder="Enter your phone number"
                    required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-red-500 transition-colors" />
                </div>
                <input
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-slate-900 font-bold placeholder:text-slate-300 focus:ring-4 focus:ring-red-600/10 ring-offset-0 transition-all shadow-inner"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-16 flex justify-center items-center px-4 border border-transparent rounded-2xl shadow-2xl shadow-red-200 text-lg font-black text-white bg-red-600 hover:bg-slate-900 focus:outline-none transition-all transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <div className="h-6 w-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-50 text-center">
            <p className="text-slate-400 font-medium">
              New to MedRescue?{" "}
              <Link href="/signup" className="text-red-600 font-black hover:underline underline-offset-4">
                Create Account
              </Link>
            </p>
          </div>
        </div>
        
        <div className="mt-8 flex justify-center gap-3">
            <div className="w-1.5 h-1.5 bg-slate-200 rounded-full"></div>
            <div className="w-1.5 h-1.5 bg-slate-100 rounded-full"></div>
            <div className="w-1.5 h-1.5 bg-slate-100 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
