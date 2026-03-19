import Link from "next/link"

export function LandingFooter() {
  return (
    <footer className="bg-[#0A0A0C] px-8 lg:px-16 py-8">
      <div className="flex items-center justify-between">
        <span className="text-xs text-[#3A3A48]">
          maestro · football intelligence
        </span>
        <div className="flex items-center gap-6">
          <Link href="#" className="text-xs text-[#3A3A48] hover:text-[#6B6B7A] transition-colors">
            Privacy
          </Link>
          <Link href="#" className="text-xs text-[#3A3A48] hover:text-[#6B6B7A] transition-colors">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  )
}
