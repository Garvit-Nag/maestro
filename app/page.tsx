import { LandingHero } from "@/components/maestro/landing-hero"
import { LandingCapabilities } from "@/components/maestro/landing-capabilities"
import { LandingCTA } from "@/components/maestro/landing-cta"
import { LandingFooter } from "@/components/maestro/landing-footer"

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0C]">
      <LandingHero />
      <LandingCapabilities />
      <LandingCTA />
      <LandingFooter />
    </main>
  )
}
