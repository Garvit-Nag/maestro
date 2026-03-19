import { CardShell, CardSkeleton } from "./card-shell"

interface MatchData {
  homeTeam?: { name: string; crest?: string }
  awayTeam?: { name: string; crest?: string }
  score?: {
    fullTime?: { home: number | null; away: number | null }
    winner?: string
  }
  goals?: Array<{ minute: number; team: { name: string }; scorer?: { name: string }; type?: string }>
  referees?: Array<{ name: string }>
  venue?: string
  utcDate?: string
  competition?: { name: string }
  matchday?: number
}

function StatBar({ label, home, away }: { label: string; home: number; away: number }) {
  const total = (home + away) || 1
  const homeW = Math.round((home / total) * 100)
  return (
    <div className="mb-2.5">
      <div className="flex justify-between text-[10px] text-white/40 mb-1">
        <span className="font-medium text-white/60">{home}</span>
        <span className="uppercase tracking-wider">{label}</span>
        <span className="font-medium text-white/60">{away}</span>
      </div>
      <div className="flex rounded-full overflow-hidden h-1" style={{ background: "rgba(255,255,255,0.06)" }}>
        <div className="h-full transition-all duration-500" style={{ width: `${homeW}%`, background: "rgba(201,168,76,0.5)" }} />
      </div>
    </div>
  )
}

export function MatchResultCard({ data }: { data: MatchData | unknown }) {
  const d = data as MatchData
  const score = d.score?.fullTime
  const home = d.homeTeam
  const away = d.awayTeam
  const homeGoals = d.goals?.filter((g) => g.team?.name === home?.name) ?? []
  const awayGoals = d.goals?.filter((g) => g.team?.name === away?.name) ?? []

  return (
    <CardShell label={d.competition?.name ?? "Match Result"}>
      {/* Score header */}
      <div className="flex items-center gap-4 mb-6">
        {/* Home */}
        <div className="flex-1 flex flex-col items-center gap-2">
          {home?.crest ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={home.crest} alt="" className="w-12 h-12 object-contain" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none" }} />
          ) : (
            <div className="w-12 h-12 rounded-full bg-white/10" />
          )}
          <span className="text-[12px] text-white/60 text-center font-light">{home?.name}</span>
          <span className="text-[11px] text-white/30 text-center text-[10px]">
            {homeGoals.map((g) => `${g.scorer?.name ?? "og"} ${g.minute}'`).join(", ")}
          </span>
        </div>

        {/* Score */}
        <div className="shrink-0 text-center">
          {score ? (
            <span className="text-[40px] font-black text-white leading-none">
              {score.home ?? 0} — {score.away ?? 0}
            </span>
          ) : (
            <span className="text-[24px] text-white/30">vs</span>
          )}
          {d.utcDate && (
            <p className="text-[10px] text-white/25 mt-1">
              {new Date(d.utcDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
            </p>
          )}
        </div>

        {/* Away */}
        <div className="flex-1 flex flex-col items-center gap-2">
          {away?.crest ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={away.crest} alt="" className="w-12 h-12 object-contain" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none" }} />
          ) : (
            <div className="w-12 h-12 rounded-full bg-white/10" />
          )}
          <span className="text-[12px] text-white/60 text-center font-light">{away?.name}</span>
          <span className="text-[11px] text-white/30 text-center text-[10px]">
            {awayGoals.map((g) => `${g.scorer?.name ?? "og"} ${g.minute}'`).join(", ")}
          </span>
        </div>
      </div>

      {/* Venue & Referee */}
      {(d.venue || d.referees?.length) && (
        <p className="text-[10px] text-white/25 text-center mb-4">
          {[d.venue, d.referees?.[0]?.name].filter(Boolean).join(" · ")}
        </p>
      )}
    </CardShell>
  )
}

export function MatchResultCardSkeleton() {
  return <CardSkeleton rows={3} />
}
