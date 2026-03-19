import { CardShell, CardSkeleton } from "./card-shell"
import { Trophy } from "lucide-react"

interface Honour {
  strHonour?: string
  strSeason?: string
  strTeam?: string
}

export function HonoursCard({ data }: { data: Honour[] | unknown }) {
  const honours = (Array.isArray(data) ? data : []) as Honour[]
  if (!honours.length) return <div className="text-white/30 text-[13px]">No honours data found.</div>

  // Group by competition
  const grouped = honours.reduce((acc, h) => {
    const key = h.strHonour ?? "Other"
    if (!acc[key]) acc[key] = []
    acc[key].push(h.strSeason ?? "")
    return acc
  }, {} as Record<string, string[]>)

  const sorted = Object.entries(grouped).sort((a, b) => b[1].length - a[1].length)
  const total = honours.length

  return (
    <CardShell label="Honours">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)" }}>
          <Trophy className="w-5 h-5 text-[#C9A84C]" />
        </div>
        <div>
          <p className="text-[24px] font-black text-white leading-none">{total}</p>
          <p className="text-[11px] text-white/35">Total Trophies</p>
        </div>
      </div>
      <div className="space-y-2">
        {sorted.slice(0, 10).map(([competition, seasons]) => (
          <div key={competition} className="flex items-start justify-between gap-3 py-2 px-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-bold text-white/70 w-6 shrink-0">{seasons.length}×</span>
              <span className="text-[12px] text-white/60 font-light">{competition}</span>
            </div>
            <span className="text-[10px] text-white/20 text-right shrink-0">{seasons.slice(-3).reverse().join(", ")}</span>
          </div>
        ))}
      </div>
    </CardShell>
  )
}

export function HonoursCardSkeleton() {
  return <CardSkeleton rows={5} />
}
