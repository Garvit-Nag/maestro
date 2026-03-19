import Link from "next/link"

export function LandingCTA() {
  return (
    <section className="bg-[#111116] border-t border-b border-[#1C1C23]">
      <div className="px-8 lg:px-16 py-16 lg:py-20 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <p className="text-xl lg:text-2xl font-light text-white/80">
          Ready to think differently about football?
        </p>
        <Link 
          href="/chat"
          className="inline-flex items-center text-[15px] text-white group relative"
        >
          <span>Enter Maestro</span>
          <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
          <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#C9A84C] group-hover:w-full transition-all duration-300" />
        </Link>
      </div>
    </section>
  )
}
