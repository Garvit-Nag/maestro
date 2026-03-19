import { CardShell, CardSkeleton } from "./card-shell"

interface InjuryEntry {
  player?: { name?: string; photo?: string }
  team?: { name?: string; logo?: string }
  fixture?: { date?: string }
  injury?: { type?: string; reason?: string }
}

const STATUS_COLORS: Record<string, string> = {
  "Missing Fixture": "text-red-400/80 bg-red-500/10 border-red-500/20",
  "Questionable": "text-amber-400/80 bg-amber-500/10 border-amber-500/20",
  default: "text-red-400/80 bg-red-500/10 border-red-500/20",
}

export function InjuryGrid({ data }: { data: InjuryEntry[] | unknown }) {
  const injuries = (Array.isArray(data) ? data : []) as InjuryEntry[]

  if (!injuries.length) return (
    <CardShell label="Injury Report">
      <div
        className="text-center py-4 rounded-xl"
        style={{ background: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.15)" }}
      >
        <p className="text-[13px] text-green-400/70">All clear — no injuries reported.</p>
      </div>
    </CardShell>
  )

  return (
    <CardShell label="Injury Report">
      <div className="space-y-2">
        {injuries.slice(0, 12).map((entry, idx) => {
          const type = entry.injury?.type ?? "Injury"
          const colorClass = STATUS_COLORS[type] ?? STATUS_COLORS.default

          return (
            <div
              key={idx}
              className="flex items-center gap-3 py-2 px-3 rounded-xl"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
            >
              <div className="flex-1 min-w-0">
                <p className="text-[13px] text-white/75 font-light">{entry.player?.name}</p>
                <p className="text-[10px] text-white/30">{entry.injury?.reason}</p>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full border ${colorClass}`}>
                {type}
              </span>
            </div>
          )
        })}
      </div>
    </CardShell>
  )
}

export function InjuryGridSkeleton() {
  return <CardSkeleton rows={6} />
}
