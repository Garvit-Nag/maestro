import { CardShell, CardSkeleton } from "./card-shell"

interface PredictionData {
  predictions?: {
    winner?: { name?: string; comment?: string }
    win_or_draw?: boolean
    under_over?: string
    goals?: { home?: string; away?: string }
    advice?: string
    percent?: { home?: string; draw?: string; away?: string }
  }
  teams?: {
    home?: { name?: string; logo?: string; last_5?: { form?: string } }
    away?: { name?: string; logo?: string; last_5?: { form?: string } }
  }
}

function ProbBar({ label, pct, color }: { label: string; pct: number; color: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className="text-[20px] font-black" style={{ color }}>{pct}%</span>
      <div className="w-full rounded-full overflow-hidden h-1.5" style={{ background: "rgba(255,255,255,0.08)" }}>
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-[10px] text-white/35 uppercase tracking-wider">{label}</span>
    </div>
  )
}

export function PredictionCard({ data }: { data: PredictionData | unknown }) {
  const d = (Array.isArray(data) ? data[0] : data) as PredictionData
  const pred = d?.predictions
  const teams = d?.teams
  if (!pred) return <div className="text-white/30 text-[13px]">No prediction data.</div>

  const homeP = parseInt(pred.percent?.home ?? "0")
  const drawP = parseInt(pred.percent?.draw ?? "0")
  const awayP = parseInt(pred.percent?.away ?? "0")

  return (
    <CardShell label="Match Prediction">
      {/* Teams header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          {teams?.home?.logo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={teams.home.logo} alt="" className="w-8 h-8 object-contain" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none" }} />
          )}
          <span className="text-[13px] text-white/70">{teams?.home?.name}</span>
        </div>
        <span className="text-[11px] text-white/25">vs</span>
        <div className="flex items-center gap-2">
          <span className="text-[13px] text-white/70">{teams?.away?.name}</span>
          {teams?.away?.logo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={teams.away.logo} alt="" className="w-8 h-8 object-contain" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none" }} />
          )}
        </div>
      </div>

      {/* Probability bars */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <ProbBar label="Home" pct={homeP} color="#C9A84C" />
        <ProbBar label="Draw" pct={drawP} color="rgba(255,255,255,0.4)" />
        <ProbBar label="Away" pct={awayP} color="rgba(201,168,76,0.5)" />
      </div>

      {/* Advice */}
      {pred.advice && (
        <div
          className="px-3 py-2.5 rounded-xl"
          style={{ background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.15)" }}
        >
          <p className="text-[9px] uppercase tracking-wider text-[#C9A84C]/60 mb-1">Prediction</p>
          <p className="text-[13px] text-white/70 font-light">{pred.advice}</p>
        </div>
      )}
    </CardShell>
  )
}

export function PredictionCardSkeleton() {
  return <CardSkeleton rows={3} />
}
