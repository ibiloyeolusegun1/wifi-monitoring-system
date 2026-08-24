import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Lightbulb,
  Wifi,
} from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-slate-950 pt-32 pb-20 text-white lg:pt-40 lg:pb-28">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl" />

        <div className="absolute bottom-0 right-0 h-[350px] w-[350px] rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          {/* Content */}
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-xs font-medium text-blue-300">
              <Activity size={14} />
              University Campus Wi-Fi Monitoring
            </div>

            <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Monitor Your Campus Network.
              <span className="block text-blue-400">
                Improve Its Performance.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              A Wi-Fi network performance monitoring and recommendation system
              designed to help university network administrators monitor network
              conditions, identify performance problems, and make informed
              optimization decisions.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Access Dashboard
                <ArrowRight size={17} />
              </Link>

              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-xl border border-slate-700 px-6 py-3.5 text-sm font-semibold text-slate-200 transition hover:bg-slate-900"
              >
                Explore Features
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-blue-400" />
                Performance Monitoring
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-blue-400" />
                Network Alerts
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-blue-400" />
                Recommendations
              </div>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="relative">
            <div className="rounded-3xl border border-slate-700 bg-slate-900 p-4 shadow-2xl shadow-blue-950/30">
              {/* Window Header */}
              <div className="mb-4 flex items-center justify-between rounded-xl bg-slate-800 px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                  <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                  <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
                </div>

                <div className="text-xs text-slate-400">Network Dashboard</div>

                <Wifi size={16} className="text-blue-400" />
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-2 gap-3">
                <PreviewCard
                  title="Access Points"
                  value="24"
                  icon={<Wifi size={17} />}
                />

                <PreviewCard
                  title="Online"
                  value="21"
                  icon={<Activity size={17} />}
                />

                <PreviewCard
                  title="Alerts"
                  value="03"
                  icon={<AlertTriangle size={17} />}
                />

                <PreviewCard
                  title="Recommendations"
                  value="05"
                  icon={<Lightbulb size={17} />}
                />
              </div>

              {/* Chart */}
              <div className="mt-4 rounded-2xl bg-slate-800 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400">
                      Network Performance
                    </p>
                    <p className="mt-1 text-lg font-semibold">Last 24 Hours</p>
                  </div>

                  <BarChart3 size={20} className="text-blue-400" />
                </div>

                <div className="mt-6 flex h-36 items-end gap-2">
                  {[35, 50, 42, 65, 58, 72, 61, 80, 68, 86, 74, 92].map(
                    (height, index) => (
                      <div
                        key={index}
                        className="flex-1 rounded-t-md bg-blue-500/70 transition hover:bg-blue-400"
                        style={{ height: `${height}%` }}
                      />
                    ),
                  )}
                </div>
              </div>
            </div>

            {/* Floating Alert */}
            <div className="absolute -bottom-5 -left-4 hidden rounded-2xl border border-slate-700 bg-slate-900 p-4 shadow-xl sm:block lg:-left-8">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                  <AlertTriangle size={18} />
                </div>

                <div>
                  <p className="text-xs font-semibold text-white">
                    Network Alert
                  </p>
                  <p className="mt-0.5 text-[11px] text-slate-400">
                    High latency detected
                  </p>
                </div>
              </div>
            </div>

            {/* Floating Recommendation */}
            <div className="absolute -right-4 -top-5 hidden rounded-2xl border border-slate-700 bg-slate-900 p-4 shadow-xl sm:block lg:-right-8">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-yellow-500/10 text-yellow-400">
                  <Lightbulb size={18} />
                </div>

                <div>
                  <p className="text-xs font-semibold text-white">
                    Recommendation
                  </p>
                  <p className="mt-0.5 text-[11px] text-slate-400">
                    Optimize wireless channel
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PreviewCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-slate-800 p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400">{title}</span>

        <span className="text-blue-400">{icon}</span>
      </div>

      <p className="mt-3 text-2xl font-bold text-white">{value}</p>
    </div>
  );
}
