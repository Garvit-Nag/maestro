import { CardShell, CardSkeleton, FallbackAvatar } from "./card-shell"

interface Assister {
  player?: { name: string; nationality?: string }
  team?: { name: string; shortName?: string; crest?: string }
  assists?: number
  goals?: number
}

export function AssistLeaderboard({ data }: { data: Assister[] | unknown }) {
  const assisters = (Array.isArray(data) ? data : []) as Assister[]
  if (!assisters.length) return <div className="text-white/30 text-[13px]">No assist data available.</div>

  return (
    <CardShell label="Top Assists">
      <div className="flex items-center text-[9px] uppercase tracking-wider text-white/25 px-2 pb-2 border-b border-white/[0.05] mb-1">
        <span className="w-6">#</span>
        <span className="flex-1">Player</span>
        <span className="w-12 text-center">Assists</span>
        <span className="w-10 text-right hidden sm:block">Goals</span>
      </div>
      <div className="space-y-0.5">
        {assisters.slice(0, 10).map((a, idx) => (
          <div key={idx} className="flex items-center py-2 px-2 rounded-lg hover:bg-white/[0.04] transition-colors">
            <span className="w-6 text-[11px] shrink-0" style={{ color: idx === 0 ? "#C9A84C" : "rgba(255,255,255,0.25)" }}>{idx + 1}</span>
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <FallbackAvatar name={a.player?.name ?? "?"} size="sm" />
              <div className="min-w-0">
                <p className="text-[13px] text-white/80 font-light truncate">{a.player?.name}</p>
                <p className="text-[10px] text-white/30">{a.player?.nationality}</p>
              </div>
            </div>
            <span className="w-12 text-center text-[16px] font-black" style={{ color: idx === 0 ? "#C9A84C" : "rgba(255,255,255,0.9)" }}>{a.assists ?? 0}</span>
            <span className="w-10 text-right text-[12px] text-white/35 hidden sm:block">{a.goals ?? 0}</span>
          </div>
        ))}
      </div>
    </CardShell>
  )
}

export function AssistLeaderboardSkeleton() {
  return <CardSkeleton rows={8} />
}
