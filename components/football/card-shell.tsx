import { Skeleton } from "@/components/ui/skeleton"

interface CardShellProps {
  label?: string
  children: React.ReactNode
  className?: string
}

export function CardShell({ label, children, className = "" }: CardShellProps) {
  return (
    <div
      className={`mt-4 rounded-xl overflow-hidden ${className}`}
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <div
        className="h-px"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.45), transparent)",
        }}
      />
      <div className="p-4">
        {label && (
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#C9A84C] mb-4">
            {label}
          </p>
        )}
        {children}
      </div>
    </div>
  )
}

export function CardSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div
      className="mt-4 rounded-xl overflow-hidden"
      style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      <div className="h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.2), transparent)" }} />
      <div className="p-4 space-y-2.5">
        <Skeleton className="h-3 w-24 bg-white/[0.06]" />
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-full bg-white/[0.04]" style={{ animationDelay: `${i * 0.1}s` }} />
        ))}
      </div>
    </div>
  )
}

// Fallback avatar when image fails
export function FallbackAvatar({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) {
  const dim = size === "sm" ? "w-8 h-8 text-[10px]" : size === "lg" ? "w-16 h-16 text-[16px]" : "w-12 h-12 text-[12px]"
  return (
    <div
      className={`${dim} rounded-full flex items-center justify-center font-semibold text-white/60 shrink-0`}
      style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
    >
      {name?.slice(0, 2).toUpperCase() ?? "?"}
    </div>
  )
}

export function FormPill({ result }: { result: "W" | "D" | "L" | string }) {
  const styles: Record<string, string> = {
    W: "bg-green-500/20 text-green-400 border-green-500/30",
    D: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    L: "bg-red-500/20 text-red-400 border-red-500/30",
  }
  return (
    <span
      className={`inline-flex items-center justify-center w-5 h-5 rounded text-[9px] font-bold border ${styles[result] ?? "bg-white/10 text-white/40 border-white/10"}`}
    >
      {result}
    </span>
  )
}
