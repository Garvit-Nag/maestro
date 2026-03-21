import { LandingHero } from "@/components/maestro/landing-hero";
import { LandingCapabilities } from "@/components/maestro/landing-capabilities";
import { LandingFaq } from "@/components/maestro/landing-faq";
import { LandingCTA } from "@/components/maestro/landing-cta";
import { LandingFooter } from "@/components/maestro/landing-footer";
import { AuthModalTrigger } from "@/components/maestro/auth-modal-trigger";

export default function LandingPage() {
  return (
    <main className="min-h-screen relative bg-[#050508]">
      {/* Global Fixed Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.40]"
          style={{
            backgroundImage: "url('/bg-1.png')",
            mixBlendMode: "luminosity",
          }}
        />
        {/* Deep texture layers */}
        <div className="absolute inset-0 bg-[#050508]/60 backdrop-blur-[1px]" />
        <div className="absolute inset-0 bg-linear-to-b from-[#050508]/30 via-[#050508]/75 to-[#050508]" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <AuthModalTrigger />
        <LandingHero />
        <LandingCapabilities />
        <LandingFaq />
        <LandingCTA />
        <LandingFooter />
      </div>
    </main>
  );
}
