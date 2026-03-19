import { CardShell, CardSkeleton, FallbackAvatar } from "./card-shell"

interface PlayerProfile {
  strPlayer?: string
  strThumb?: string
  strCutout?: string
  strTeam?: string
  strPosition?: string
  strNationality?: string
  dateBorn?: string
  strHeight?: string
  strWeight?: string
  strDescriptionEN?: string
}

interface SideBySideData {
  player1?: PlayerProfile
  player2?: PlayerProfile
}

function age(dateBorn?: string) {
  if (!dateBorn) return null
  const diff = Date.now() - new Date(dateBorn).getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25))
}

function MiniPlayer({ player }: { player: PlayerProfile }) {
  const photo = player.strCutout || player.strThumb || null
  return (
    <div className="flex-1 flex flex-col items-center gap-2 text-center">
      {photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={photo} alt={player.strPlayer ?? ""} className="w-16 h-16 rounded-xl object-cover" style={{ background: "rgba(255,255,255,0.05)" }} onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none" }} />
      ) : (
        <FallbackAvatar name={player.strPlayer ?? "?"} size="md" />
      )}
      <div>
        <p className="text-[14px] font-bold text-white leading-tight">{player.strPlayer}</p>
        <p className="text-[11px] text-white/40 font-light">{player.strTeam}</p>
      </div>
    </div>
  )
}

export function SideBySidePlayerCard({ data }: { data: SideBySideData | PlayerProfile[] | unknown }) {
  // Normalize: server sends array when same tool called twice (2x get_player_profile)
  let p1: PlayerProfile, p2: PlayerProfile
  if (Array.isArray(data) && data.length >= 2) {
    p1 = data[0] as PlayerProfile
    p2 = data[1] as PlayerProfile
  } else {
    const d = data as SideBySideData
    if (!d?.player1 && !d?.player2) return null
    p1 = d.player1 ?? {}
    p2 = d.player2 ?? {}
  }

  const rows = [
    { label: "Position", v1: p1.strPosition ?? "—", v2: p2.strPosition ?? "—" },
    { label: "Nationality", v1: p1.strNationality ?? "—", v2: p2.strNationality ?? "—" },
    { label: "Age", v1: age(p1.dateBorn) ?? "—", v2: age(p2.dateBorn) ?? "—" },
    { label: "Height", v1: p1.strHeight ?? "—", v2: p2.strHeight ?? "—" },
  ].filter(r => r.v1 !== "—" || r.v2 !== "—")

  return (
    <CardShell label="Head to Head">
      <div className="flex items-center gap-4 mb-5">
        <MiniPlayer player={p1} />
        <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white/40" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>VS</div>
        <MiniPlayer player={p2} />
      </div>

      {rows.length > 0 && (
        <div className="space-y-2">
          {rows.map((row) => (
            <div key={row.label} className="flex items-center justify-between gap-2">
              <span className="text-[12px] text-white/70 font-medium flex-1 text-left">{row.v1}</span>
              <span className="text-[9px] uppercase tracking-wider text-white/30 shrink-0 w-20 text-center">{row.label}</span>
              <span className="text-[12px] text-white/70 font-medium flex-1 text-right">{row.v2}</span>
            </div>
          ))}
        </div>
      )}
    </CardShell>
  )
}

export function SideBySidePlayerCardSkeleton() {
  return <CardSkeleton rows={4} />
}
