import { Activity, Gauge, Radio, Signal } from "lucide-react";

const metrics = [
  {
    title: "Signal Strength",
    description:
      "Measures the strength of the wireless signal received by connected devices.",
    icon: Signal,
    unit: "dBm",
  },
  {
    title: "Throughput",
    description:
      "Measures the amount of data successfully transmitted through the network.",
    icon: Gauge,
    unit: "Mbps",
  },
  {
    title: "Latency",
    description:
      "Measures the time required for data to travel across the network.",
    icon: Activity,
    unit: "ms",
  },
  {
    title: "Packet Loss",
    description:
      "Measures the percentage of network packets that fail to reach their destination.",
    icon: Radio,
    unit: "%",
  },
];

export default function MetricsSection() {
  return (
    <section id="metrics" className="bg-white py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="text-sm font-semibold text-blue-600">
            PERFORMANCE METRICS
          </span>

          <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
            Monitor the metrics that matter
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            The system uses key Wi-Fi performance indicators to help
            administrators understand the condition and quality of the campus
            wireless network.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => {
            const Icon = metric.icon;

            return (
              <div
                key={metric.title}
                className="rounded-2xl border border-slate-200 p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-blue-600">
                    <Icon size={21} />
                  </div>

                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                    {metric.unit}
                  </span>
                </div>

                <h3 className="mt-5 font-semibold text-slate-900">
                  {metric.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {metric.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
