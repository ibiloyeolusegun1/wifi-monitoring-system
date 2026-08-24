import {
  Activity,
  AlertTriangle,
  BarChart3,
  Gauge,
  Lightbulb,
  ShieldCheck,
} from "lucide-react";

const features = [
  {
    title: "Real-Time Monitoring",
    description:
      "Monitor important Wi-Fi performance metrics from connected access points and view current network conditions.",
    icon: Activity,
  },
  {
    title: "Performance Analysis",
    description:
      "Analyze signal strength, throughput, latency, packet loss, and utilization to identify network performance problems.",
    icon: BarChart3,
  },
  {
    title: "Intelligent Recommendations",
    description:
      "Generate recommendations based on detected network conditions to support better network optimization decisions.",
    icon: Lightbulb,
  },
  {
    title: "Network Alerts",
    description:
      "Detect performance conditions that exceed defined thresholds and generate alerts for network administrators.",
    icon: AlertTriangle,
  },
  {
    title: "Campus Management",
    description:
      "Organize network infrastructure by campuses, buildings, and access points for easier network administration.",
    icon: Gauge,
  },
  {
    title: "Reliable Administration",
    description:
      "Provide a centralized administrative interface for managing and reviewing campus Wi-Fi network information.",
    icon: ShieldCheck,
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="bg-white py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold text-blue-600">
            SYSTEM FEATURES
          </span>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Everything needed to monitor campus Wi-Fi performance
          </h2>

          <p className="mt-4 text-sm leading-6 text-slate-500 sm:text-base">
            The system combines network monitoring, performance analysis,
            alerts, recommendations, and reporting into a centralized management
            platform.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg hover:shadow-slate-200/50"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                  <Icon size={22} />
                </div>

                <h3 className="mt-5 text-lg font-semibold text-slate-900">
                  {feature.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
