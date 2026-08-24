import { Activity, ArrowRight, Database, Lightbulb, Radar } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Collect Network Metrics",
    description:
      "Performance information is collected from registered campus access points, including signal strength, throughput, latency, packet loss, and utilization.",
    icon: Database,
  },
  {
    number: "02",
    title: "Analyze Performance",
    description:
      "The collected metrics are analyzed against defined performance thresholds to identify potential network problems.",
    icon: Radar,
  },
  {
    number: "03",
    title: "Detect Network Problems",
    description:
      "When performance metrics exceed defined thresholds, the system identifies the affected network condition and generates an alert.",
    icon: Activity,
  },
  {
    number: "04",
    title: "Generate Recommendations",
    description:
      "The system generates optimization recommendations to assist administrators in addressing detected performance problems.",
    icon: Lightbulb,
  },
];

export default function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="border-y border-slate-200 bg-slate-50 py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <span className="text-sm font-semibold text-blue-600">
              HOW IT WORKS
            </span>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              From network data to actionable decisions
            </h2>

            <p className="mt-5 max-w-lg text-sm leading-7 text-slate-500 sm:text-base">
              The system follows a structured process that transforms Wi-Fi
              performance data into useful information for network
              administrators.
            </p>
          </div>

          <div className="space-y-4">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.number}
                  className="relative flex gap-5 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
                    <Icon size={21} />
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-xs font-bold text-blue-600">
                        STEP {step.number}
                      </span>

                      {index < steps.length - 1 && (
                        <ArrowRight
                          size={14}
                          className="hidden text-slate-300 sm:block"
                        />
                      )}
                    </div>

                    <h3 className="mt-2 font-semibold text-slate-900">
                      {step.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
