import { CardShell, CardSkeleton } from "./card-shell"

interface FormStats {
  played?: number
  win?: number
  draw?: number
  lose?: number
  goals?: { for?: { total?: { total?: number } }; against?: { total?: { total?: number } } }
}

interface FormSplitData {
  team?: { name?: string; logo?: string }
  league?: { season?: number }
  fixtures?: {
    wins?: { home?: number; away?: number }
    draws?: { home?: number; away?: number }
    loses?: { home?: number; away?: number }
    played?: { home?: number; away?: number }
  }
  goals?: {
    for?: { total?: { home?: number; away?: number } }
    against?: { total?: { home?: number; away?: number } }
  }
}

function Column({ label, w, d, l, gf, ga, played }: { label: string; w: number; d: number; l: number; gf: number; ga: number; played: number }) {
  const pts = w * 3 + d
  const ppg = played > 0 ? (pts / played).toFixed(2) : "—"

  return (
    <div
      className="flex-1 rounded-xl p-4"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      <p className="text-[9px] uppercase tracking-[0.3em] text-[#C9A84C]/70 mb-3">{label}</p>
      <div className="space-y-1.5">
        {[
          { l: "Played", v: played },
          { l: "Won", v: w, color: "text-green-400/80" },
          { l: "Drawn", v: d, color: "text-amber-400/70" },
          { l: "Lost", v: l, color: "text-red-400/70" },
          { l: "GF", v: gf },
          { l: "GA", v: ga },
          { l: "Pts/G", v: ppg },
        ].map((row) => (
          <div key={row.l} className="flex justify-between">
            <span className="text-[11px] text-white/30">{row.l}</span>
            <span className={`text-[12px] font-semibold ${(row as { color?: string }).color ?? "text-white/70"}`}>{row.v}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function FormSplitCard({ data }: { data: FormSplitData | unknown }) {
  const d = (Array.isArray(data) ? data[0] : data) as FormSplitData
  if (!d?.fixtures) return <div className="text-white/30 text-[13px]">No form data available.</div>

  const f = d.fixtures
  const g = d.goals

  return (
    <CardShell label={`${d.team?.name ?? "Team"} Home vs Away`}>
      <div className="flex gap-3">
        <Column
          label="Home"
          played={f.played?.home ?? 0}
          w={f.wins?.home ?? 0}
          d={f.draws?.home ?? 0}
          l={f.loses?.home ?? 0}
          gf={g?.for?.total?.home ?? 0}
          ga={g?.against?.total?.home ?? 0}
        />
        <Column
          label="Away"
          played={f.played?.away ?? 0}
          w={f.wins?.away ?? 0}
          d={f.draws?.away ?? 0}
          l={f.loses?.away ?? 0}
          gf={g?.for?.total?.away ?? 0}
          ga={g?.against?.total?.away ?? 0}
        />
      </div>
    </CardShell>
  )
}

export function FormSplitCardSkeleton() {
  return <CardSkeleton rows={4} />
}
