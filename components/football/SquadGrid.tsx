import { CardShell, CardSkeleton } from "./card-shell"

interface Player {
  name?: string
  shirtNumber?: number
  position?: string
  nationality?: string
  dateOfBirth?: string
}

const POSITION_ORDER = ["Goalkeeper", "Defence", "Midfield", "Offence", "Forward"]
const POSITION_LABELS: Record<string, string> = {
  Goalkeeper: "GK",
  Defence: "DEF",
  Midfield: "MID",
  Offence: "FWD",
  Forward: "FWD",
}

export function SquadGrid({ data }: { data: Player[] | unknown }) {
  const players = (Array.isArray(data) ? data : []) as Player[]

  if (!players.length) return <div className="text-white/30 text-[13px]">No squad data available.</div>

  const grouped = POSITION_ORDER.reduce((acc, pos) => {
    const group = players.filter((p) => p.position === pos || (pos === "Forward" && p.position === "Offence"))
    if (group.length) acc[pos] = group
    return acc
  }, {} as Record<string, Player[]>)

  return (
    <CardShell label="Squad">
      <div className="space-y-5">
        {Object.entries(grouped).map(([pos, posPlayers]) => (
          <div key={pos}>
            <p className="text-[9px] uppercase tracking-[0.3em] text-[#C9A84C]/70 mb-2">
              {POSITION_LABELS[pos] ?? pos}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {posPlayers.map((player, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
                >
                  {player.shirtNumber != null && (
                    <span className="text-[11px] text-white/20 w-5 shrink-0 text-right font-mono">{player.shirtNumber}</span>
                  )}
                  <span className="text-[12px] text-white/70 font-light truncate">{player.name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </CardShell>
  )
}

export function SquadGridSkeleton() {
  return <CardSkeleton rows={6} />
}
