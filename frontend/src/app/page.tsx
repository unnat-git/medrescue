import Link from "next/link";
import { Activity } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-gray-100 shadow-sm sticky top-0 bg-white z-50">
        <Link className="flex items-center justify-center" href="/">
          <Activity className="h-6 w-6 text-red-600" />
          <span className="ml-2 font-bold text-xl tracking-tight text-gray-900">MedRescue</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:text-red-600 transition-colors" href="/profile">
            Medical Profile
          </Link>
          <Link className="text-sm font-medium hover:text-red-600 transition-colors" href="/driver">
            Driver
          </Link>
          <Link className="text-sm font-medium hover:text-red-600 transition-colors" href="/hospital">
            Hospital
          </Link>
        </nav>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <div className="space-y-6 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight">
            Emergency Medical <span className="text-red-600">Quick Response</span> System
          </h1>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            One-click emergency requests, real-time ambulance tracking, and a digital Qr-based medical identity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link
              href="/emergency"
              className="inline-flex h-12 items-center justify-center rounded-full bg-red-600 px-8 text-sm font-bold text-white shadow-lg shadow-red-500/30 hover:bg-red-700 transition"
            >
              Request Emergency Help
            </Link>
            <Link
              href="/profile/create"
              className="inline-flex h-12 items-center justify-center rounded-full border border-gray-200 bg-white px-8 text-sm font-medium hover:bg-gray-100 hover:text-gray-900 transition"
            >
              Create Medical Profile
            </Link>
          </div>
        </div>
      </main>
      <footer className="py-6 w-full shrink-0 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-center text-center px-4 md:px-6">
        <p className="text-sm text-gray-500">© 2026 MedRescue. All rights reserved.</p>
      </footer>
    </div>
  );
}
