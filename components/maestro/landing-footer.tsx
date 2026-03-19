import Link from "next/link"
import { footerContent } from "@/lib/content/landing"

export function LandingFooter() {
  return (
    <footer
      className="bg-[#050508] px-8 lg:px-16 py-7"
      style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
    >
      <div className="flex items-center justify-between">
        <span className="text-[12px] text-white/20 tracking-wide">{footerContent.brand}</span>
        <div className="flex items-center gap-6">
          {footerContent.links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-[12px] text-white/20 hover:text-white/50 transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  )
}
