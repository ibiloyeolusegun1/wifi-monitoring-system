import Link from "next/link";
import { ArrowRight, Wifi } from "lucide-react";

export default function CTASection() {
  return (
    <section className="px-5 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-blue-600 px-6 py-14 text-center sm:px-10 lg:px-16 lg:py-16">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-white">
          <Wifi size={27} />
        </div>

        <h2 className="mx-auto mt-6 max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Take control of your campus Wi-Fi network
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-blue-100 sm:text-base">
          Access the monitoring dashboard to view network performance, detect
          problems, review alerts, and receive optimization recommendations.
        </p>

        <Link
          href="/login"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
        >
          Access Administrator Dashboard
          <ArrowRight size={17} />
        </Link>
      </div>
    </section>
  );
}
