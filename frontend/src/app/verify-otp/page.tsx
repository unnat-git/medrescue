"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Activity, ShieldCheck, ArrowRight, RefreshCw } from "lucide-react";

export default function VerifyOTPPage() {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [signupData, setSignupData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resending, setResending] = useState(false);

  useEffect(() => {
    const data = sessionStorage.getItem("signupData");
    if (!data) {
      router.push("/signup");
      return;
    }
    setSignupData(JSON.parse(data));
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: signupData.fullName,
          phone_number: signupData.phoneNumber,
          email: signupData.email,
          password: signupData.password,
          otp: otp,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        sessionStorage.removeItem("signupData");
        router.push("/profile");
      } else {
        setError(data.message || "Verification failed");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError("");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone_number: signupData.phoneNumber }),
      });
      if (response.ok) {
        alert("OTP resent successfully");
      } else {
        setError("Failed to resend OTP");
      }
    } catch (err) {
      setError("Error resending OTP");
    } finally {
      setResending(false);
    }
  };

  if (!signupData) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-6">
          <Activity className="h-8 w-8 text-red-600" />
          <span className="text-3xl font-bold text-slate-900 tracking-tight">MedRescue</span>
        </Link>
        <h2 className="text-3xl font-extrabold text-slate-900">Verify your phone</h2>
        <p className="mt-2 text-sm text-slate-600">
          Enter the 6-digit code sent to <span className="font-bold text-slate-900">{signupData.phoneNumber}</span>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-slate-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}

            <div>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <ShieldCheck className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-4 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-red-500 focus:border-red-500 text-slate-900 text-center text-2xl tracking-[1em] font-bold"
                  placeholder="000000"
                  maxLength={6}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="text-sm font-medium text-slate-500 hover:text-red-600 flex items-center gap-1 transition-colors"
              >
                <RefreshCw className={`h-4 w-4 ${resending ? 'animate-spin' : ''}`} />
                Resend Code
              </button>
              <Link href="/signup" className="text-sm font-medium text-slate-500 hover:text-slate-900">
                Change Number
              </Link>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || otp.length < 6}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-red-200 text-sm font-bold text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {loading ? "Verifying..." : "Verify & Complete Signup"}
                {!loading && <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
