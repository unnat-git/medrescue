"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Activity, User, Mail, Lock, CheckCircle, AlertCircle, ArrowRight } from "lucide-react";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

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
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_BASE}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone_number: phoneNumber,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store signup info temporarily to use on OTP page
        sessionStorage.setItem("signupData", JSON.stringify({
          ...formData,
          phone_number: phoneNumber
        }));
        router.push("/verify-otp");
      } else {
        setError(data.message || "Something went wrong");
      }
    } catch (err: any) {
      setError("Failed to connect to server. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-red-600 p-3 rounded-2xl shadow-lg shadow-red-200">
            <Activity className="h-10 w-10 text-white" />
          </div>
        </div>
        <h2 className="text-center text-4xl font-black text-slate-900 tracking-tight">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-red-600 hover:text-red-500 transition-colors underline decoration-2 underline-offset-4">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-10 px-6 shadow-2xl shadow-slate-200 sm:rounded-[2.5rem] sm:px-12 border border-slate-100">
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
              <p className="text-sm text-red-800 font-medium leading-relaxed">{error}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                Full Name
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400 group-focus-within:text-red-600 transition-colors" />
                </div>
                <input
                  type="text"
                  required
                  className="block w-full pl-11 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-slate-900 font-medium placeholder:text-slate-400 focus:ring-2 focus:ring-red-600 ring-offset-0 transition-all shadow-inner"
                  placeholder="Siddharth Singh"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                Phone Number
              </label>
              <div className="phone-input-container">
                 <PhoneInput
                    international
                    defaultCountry="IN"
                    placeholder="Enter phone number"
                    value={phoneNumber}
                    onChange={setPhoneNumber}
                    className="flex w-full px-4 py-2 bg-slate-50 border-none rounded-2xl text-slate-900 font-medium focus-within:ring-2 focus-within:ring-red-600 transition-all shadow-inner"
                  />
              </div>
              <p className="mt-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider ml-1">
                A verification code will be sent to this number
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                Email (Optional)
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-red-600 transition-colors" />
                </div>
                <input
                  type="email"
                  className="block w-full pl-11 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-slate-900 font-medium placeholder:text-slate-400 focus:ring-2 focus:ring-red-600 ring-offset-0 transition-all shadow-inner"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-red-600 transition-colors" />
                  </div>
                  <input
                    type="password"
                    required
                    className="block w-full pl-11 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-slate-900 font-medium placeholder:text-slate-400 focus:ring-2 focus:ring-red-600 ring-offset-0 transition-all shadow-inner text-sm"
                    placeholder="••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                  Confirm
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <CheckCircle className="h-5 w-5 text-slate-400 group-focus-within:text-red-600 transition-colors" />
                  </div>
                  <input
                    type="password"
                    required
                    className="block w-full pl-11 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-slate-900 font-medium placeholder:text-slate-400 focus:ring-2 focus:ring-red-600 ring-offset-0 transition-all shadow-inner text-sm"
                    placeholder="••••"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-5 px-4 border border-transparent rounded-2xl shadow-xl shadow-red-200 text-lg font-black text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {loading ? (
                  <div className="h-6 w-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    Sign up
                    <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-8 flex justify-center gap-4 text-slate-400 text-xs font-bold uppercase tracking-widest">
            <span>Secure</span>
            <span>•</span>
            <span>Encrypted</span>
            <span>•</span>
            <span>Verified</span>
        </div>
      </div>
      
      <style jsx global>{`
        .PhoneInput {
          display: flex;
          align-items: center;
          width: 100%;
        }
        .PhoneInputInput {
          flex: 1;
          min-width: 0;
          background: transparent;
          border: none;
          padding: 1rem 0;
          font-family: inherit;
          font-size: 1rem;
          font-weight: 500;
          color: #0f172a;
          outline: none;
        }
        .PhoneInputCountry {
          margin-right: 0.75rem;
          display: flex;
          align-items: center;
        }
        .PhoneInputCountrySelect {
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
