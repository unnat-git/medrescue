"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Activity, User, Mail, Lock, CheckCircle, AlertCircle, ArrowRight } from "lucide-react";
import PhoneInputCustom from "@/components/PhoneInputCustom";
import { API_ENDPOINTS } from "@/config/api";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!phoneNumber) {
      setError("Phone number is required");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(API_ENDPOINTS.AUTH.SIGNUP, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone_number: phoneNumber,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        sessionStorage.setItem("signupData", JSON.stringify({
          ...formData,
          phone_number: phoneNumber
        }));
        router.push("/verify-otp");
      } else {
        setError(data.message || "Registration failed. Try again.");
      }
    } catch (err: unknown) {
      console.error("Signup error:", err);
      setError("Server connection failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8">
        <Link href="/" className="flex justify-center items-center gap-3 mb-8 group">
          <div className="p-2 bg-red-600 rounded-2xl shadow-lg shadow-red-200 group-hover:scale-110 transition-transform">
            <Activity className="h-8 w-8 text-white" />
          </div>
          <span className="text-4xl font-black text-slate-900 tracking-tight">MedRescue</span>
        </Link>
        <h2 className="text-center text-3xl font-black text-slate-900 tracking-tight leading-tight">Create Account</h2>
        <p className="mt-3 text-center text-slate-500 font-medium">
          Join the network for rapid medical response
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-10 px-6 sm:px-12 shadow-2xl shadow-slate-200/60 sm:rounded-[3rem] border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 -mt-8 -ml-8 w-32 h-32 bg-blue-50 rounded-full blur-3xl opacity-50"></div>
          
          {error && (
            <div className="mb-8 p-4 rounded-2xl bg-red-50 border border-red-100 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
              <p className="text-sm text-red-800 font-bold leading-relaxed">{error}</p>
            </div>
          )}

          <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 mb-2">Full Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400 group-focus-within:text-red-500 transition-colors" />
                  </div>
                  <input
                    type="text"
                    required
                    className="block w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-slate-900 font-bold placeholder:text-slate-300 focus:ring-4 focus:ring-red-600/10 ring-offset-0 transition-all shadow-inner"
                    placeholder="Enter your name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 mb-2">Phone Number</label>
                <div className="phone-input-container">
                   <PhoneInputCustom
                      value={phoneNumber}
                      onChange={setPhoneNumber}
                      placeholder="Enter your phone number"
                      required
                    />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 mb-2">Email (Optional)</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-red-500 transition-colors" />
                  </div>
                  <input
                    type="email"
                    className="block w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-slate-900 font-bold placeholder:text-slate-300 focus:ring-4 focus:ring-red-600/10 ring-offset-0 transition-all shadow-inner"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="group">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 mb-2">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-red-500 transition-colors" />
                    </div>
                    <input
                      type="password"
                      required
                      className="block w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-slate-900 font-bold placeholder:text-slate-300 focus:ring-4 focus:ring-red-600/10 ring-offset-0 transition-all shadow-inner text-sm"
                      placeholder="Create password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 mb-2">Confirm</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <CheckCircle className="h-5 w-5 text-slate-400 group-focus-within:text-red-500 transition-colors" />
                    </div>
                    <input
                      type="password"
                      required
                      className="block w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-slate-900 font-bold placeholder:text-slate-300 focus:ring-4 focus:ring-red-600/10 ring-offset-0 transition-all shadow-inner text-sm"
                      placeholder="Confirm password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-16 flex justify-center items-center px-4 border border-transparent rounded-2xl shadow-2xl shadow-red-200 text-lg font-black text-white bg-red-600 hover:bg-slate-900 transition-all transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  <div className="h-6 w-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs font-black uppercase tracking-widest">Processing...</span>
                </div>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-50 text-center">
            <p className="text-slate-400 font-medium">
              Already have an account?{" "}
              <Link href="/login" className="text-red-600 font-black hover:underline underline-offset-4">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
