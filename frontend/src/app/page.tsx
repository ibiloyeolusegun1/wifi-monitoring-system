import LandingNavbar from "@/src/components/landing/LandingNavbar";
import HeroSection from "@/src/components/landing/HeroSection";
import FeaturesSection from "@/src/components/landing/FeaturesSection";
import HowItWorksSection from "@/src/components/landing/HowItWorksSection";
import MetricsSection from "@/src/components/landing/MetricsSection";
import CTASection from "@/src/components/landing/CTASection";
import LandingFooter from "@/src/components/landing/LandingFooter";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <LandingNavbar />

      <HeroSection />

      <FeaturesSection />

      <HowItWorksSection />

      <MetricsSection />

      <CTASection />

      <LandingFooter />
    </main>
  );
}