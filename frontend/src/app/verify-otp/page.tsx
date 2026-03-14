"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Activity, ShieldCheck, ArrowLeft, RefreshCw, Smartphone, ArrowRight, AlertCircle } from "lucide-react";
import { API_ENDPOINTS } from "@/config/api";
import { SignupData } from "@/types";



export default function VerifyOTPPage() {
  const router = useRouter();
  const [signupData, setSignupData] = useState<SignupData | null>(null);

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    const data = sessionStorage.getItem("signupData");
    if (!data) {
      router.push("/signup");
    } else {
      setSignupData(JSON.parse(data));
    }
  }, [router]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(API_ENDPOINTS.AUTH.VERIFY_OTP, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...signupData,
          otp
        }),
      });


      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        sessionStorage.removeItem("signupData");
        router.push("/profile/create");
      } else {
        setError(data.message || "Invalid OTP");
      }
    } catch (err) {
      setError("Failed to verify OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0 || !signupData) return;
    
    setResending(true);
    setError("");
    try {
      await fetch(API_ENDPOINTS.AUTH.SIGNUP, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone_number: signupData.phone_number }),
      });


      setTimer(30);
    } catch (err) {
      setError("Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  if (!signupData) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-red-600 p-4 rounded-[2rem] shadow-xl shadow-red-200">
            <ShieldCheck className="h-12 w-12 text-white" />
          </div>
        </div>
        <h2 className="text-center text-4xl font-black text-slate-900 tracking-tight">
          Verify Identity
        </h2>
        <p className="mt-3 text-center text-sm text-slate-500 font-medium px-4">
          Enter the 6-digit code sent to <span className="text-slate-900 font-black">{signupData.phone_number}</span>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-12 px-6 shadow-2xl shadow-slate-200 sm:rounded-[2.5rem] sm:px-12 border border-slate-100">
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
              <p className="text-sm text-red-800 font-bold">{error}</p>
            </div>
          )}

          <form className="space-y-8" onSubmit={handleVerify}>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Smartphone className="h-6 w-6 text-slate-400 group-focus-within:text-red-600 transition-colors" />
              </div>
              <input
                type="text"
                maxLength={6}
                required
                className="block w-full pl-12 pr-4 py-5 bg-slate-50 border-none rounded-2xl text-slate-900 text-2xl font-black tracking-[0.5em] text-center placeholder:text-slate-300 focus:ring-4 focus:ring-red-600/10 ring-offset-0 transition-all shadow-inner"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              />
            </div>

            <div className="space-y-4">
              <button
                type="submit"
                disabled={loading || otp.length < 6}
                className="w-full flex justify-center items-center py-5 px-4 border border-transparent rounded-2xl shadow-xl shadow-red-200 text-lg font-black text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {loading ? (
                  <div className="h-6 w-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    Verify & Create Account
                    <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleResend}
                disabled={timer > 0 || resending}
                className="w-full flex items-center justify-center gap-2 text-sm font-bold text-slate-500 hover:text-red-600 transition-colors disabled:opacity-50"
              >
                {resending ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : timer > 0 ? (
                  `Resend code in ${timer}s`
                ) : (
                  "Didn't receive code? Resend"
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-50">
            <button
               onClick={() => router.push("/signup")}
               className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest"
            >
              <ArrowLeft className="h-3 w-3" />
              Change Phone Number
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
