import { LandingHero } from "@/components/maestro/landing-hero"
import { LandingCapabilities } from "@/components/maestro/landing-capabilities"
import { LandingFaq } from "@/components/maestro/landing-faq"
import { LandingCTA } from "@/components/maestro/landing-cta"
import { LandingFooter } from "@/components/maestro/landing-footer"
import { AuthModalTrigger } from "@/components/maestro/auth-modal-trigger"

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#050508]">
      <AuthModalTrigger />
      <LandingHero />
      <LandingCapabilities />
      <LandingFaq />
      <LandingCTA />
      <LandingFooter />
    </main>
  )
}
