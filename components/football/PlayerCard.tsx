import { CardShell, CardSkeleton, FallbackAvatar } from "./card-shell"
import { Skeleton } from "@/components/ui/skeleton"

interface PlayerData {
  strPlayer?: string
  strThumb?: string
  strCutout?: string
  strTeam?: string
  strPosition?: string
  strNationality?: string
  strDescriptionEN?: string
  dateBorn?: string
  strHeight?: string
  strWeight?: string
  // From API-Football stats
  goals?: number
  assists?: number
  rating?: string | number
  minutes?: number
  appearances?: number
}

export function PlayerCard({ data }: { data: PlayerData | unknown }) {
  const d = data as PlayerData
  const photo = d.strCutout || d.strThumb || null
  const stats = [
    { label: "Goals", value: d.goals ?? null },
    { label: "Assists", value: d.assists ?? null },
    { label: "Rating", value: d.rating ? Number(d.rating).toFixed(1) : null },
    { label: "Apps", value: d.appearances ?? null },
  ]
  const hasStats = stats.some(s => s.value !== null)

  return (
    <CardShell label="Player Profile">
      <div className="flex gap-4">
        {/* Photo */}
        <div className="shrink-0">
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photo}
              alt={d.strPlayer ?? ""}
              className="w-20 h-20 rounded-xl object-cover"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
              onError={(e) => {
                const parent = (e.currentTarget as HTMLImageElement).parentElement
                if (parent) {
                  (e.currentTarget as HTMLImageElement).style.display = "none"
                }
              }}
            />
          ) : (
            <FallbackAvatar name={d.strPlayer ?? "?"} size="lg" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-[17px] font-bold text-white leading-tight mb-0.5">
            {d.strPlayer ?? "Unknown Player"}
          </h3>
          <p className="text-[13px] text-white/50 font-light mb-0.5">{d.strTeam ?? ""}</p>
          <div className="flex items-center gap-2 flex-wrap">
            {d.strPosition && (
              <span
                className="text-[10px] px-2 py-0.5 rounded-full text-[#C9A84C]"
                style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)" }}
              >
                {d.strPosition}
              </span>
            )}
            {d.strNationality && (
              <span className="text-[11px] text-white/30">{d.strNationality}</span>
            )}
          </div>
        </div>
      </div>

      {/* Stats grid — only shown when at least one stat is available */}
      {hasStats && (
        <div className="grid grid-cols-4 gap-2 mt-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl p-3 text-center"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <p className="text-[18px] font-black text-white leading-none mb-1">{stat.value ?? "—"}</p>
              <p className="text-[9px] text-white/30 uppercase tracking-wide">{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Bio snippet */}
      {d.strDescriptionEN && (
        <p className="text-[12px] text-white/35 mt-3 font-light leading-relaxed line-clamp-2">
          {d.strDescriptionEN}
        </p>
      )}
    </CardShell>
  )
}

export function PlayerCardSkeleton() {
  return (
    <div className="mt-4 rounded-xl overflow-hidden" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
      <div className="h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.2), transparent)" }} />
      <div className="p-4">
        <Skeleton className="h-3 w-24 bg-white/[0.06] mb-4" />
        <div className="flex gap-4 mb-4">
          <Skeleton className="w-20 h-20 rounded-xl bg-white/[0.06]" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-36 bg-white/[0.06]" />
            <Skeleton className="h-3 w-24 bg-white/[0.04]" />
            <Skeleton className="h-5 w-16 rounded-full bg-white/[0.04]" />
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[0,1,2,3].map(i => <Skeleton key={i} className="h-14 rounded-xl bg-white/[0.04]" />)}
        </div>
      </div>
    </div>
  )
}
