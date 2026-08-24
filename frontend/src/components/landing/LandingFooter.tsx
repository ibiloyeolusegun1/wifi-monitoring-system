import Link from "next/link";
import { Activity, Wifi } from "lucide-react";

export default function LandingFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
              <Wifi size={21} />
            </div>

            <div>
              <p className="text-sm font-semibold">Wi-Fi Monitor</p>
              <p className="text-xs text-slate-400">
                Campus Network Management
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-5 text-sm text-slate-400">
            <a href="#features" className="hover:text-white">
              Features
            </a>

            <a href="#how-it-works" className="hover:text-white">
              How It Works
            </a>

            <a href="#metrics" className="hover:text-white">
              Metrics
            </a>

            <Link href="/login" className="hover:text-white">
              Administrator Login
            </Link>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-slate-800 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Wi-Fi Network Performance Monitoring
            System.
          </p>

          <div className="flex items-center gap-2">
            <Activity size={14} />
            University Campus Network Monitoring
          </div>
        </div>
      </div>
    </footer>
  );
}
