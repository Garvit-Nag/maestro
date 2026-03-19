import { CardShell, CardSkeleton, FallbackAvatar } from "./card-shell"

interface Scorer {
  player?: { name: string; nationality?: string }
  team?: { name: string; shortName?: string; crest?: string }
  goals?: number
  assists?: number
  penalties?: number
  playedMatches?: number
}

export function ScorerLeaderboard({ data }: { data: Scorer[] | unknown }) {
  const scorers = (Array.isArray(data) ? data : []) as Scorer[]

  if (!scorers.length) return <div className="text-white/30 text-[13px]">No scorer data available.</div>

  return (
    <CardShell label="Top Scorers">
      {/* Header */}
      <div className="flex items-center text-[9px] uppercase tracking-wider text-white/25 px-2 pb-2 border-b border-white/[0.05] mb-1">
        <span className="w-6">#</span>
        <span className="flex-1">Player</span>
        <span className="w-10 text-center">Club</span>
        <span className="w-10 text-center">Goals</span>
        <span className="w-10 text-right hidden sm:block">Assists</span>
      </div>

      <div className="space-y-0.5">
        {scorers.slice(0, 10).map((scorer, idx) => (
          <div
            key={idx}
            className="flex items-center py-2 px-2 rounded-lg hover:bg-white/[0.04] transition-colors"
          >
            <span className="w-6 text-[11px] shrink-0" style={{ color: idx === 0 ? "#C9A84C" : "rgba(255,255,255,0.25)" }}>
              {idx + 1}
            </span>

            <div className="flex items-center gap-2 flex-1 min-w-0">
              <FallbackAvatar name={scorer.player?.name ?? "?"} size="sm" />
              <div className="min-w-0">
                <p className="text-[13px] text-white/80 font-light truncate">{scorer.player?.name}</p>
                <p className="text-[10px] text-white/30">{scorer.player?.nationality}</p>
              </div>
            </div>

            <div className="w-10 text-center shrink-0">
              {scorer.team?.crest ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={scorer.team.crest} alt="" className="w-5 h-5 object-contain mx-auto" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none" }} />
              ) : (
                <span className="text-[10px] text-white/25">{scorer.team?.shortName?.slice(0, 3)}</span>
              )}
            </div>

            <span className="w-10 text-center text-[16px] font-black" style={{ color: idx === 0 ? "#C9A84C" : "rgba(255,255,255,0.9)" }}>
              {scorer.goals ?? 0}
            </span>

            <span className="w-10 text-right text-[12px] text-white/35 hidden sm:block">
              {scorer.assists ?? 0}
            </span>
          </div>
        ))}
      </div>
    </CardShell>
  )
}

export function ScorerLeaderboardSkeleton() {
  return <CardSkeleton rows={8} />
}
