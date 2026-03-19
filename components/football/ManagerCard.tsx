import { CardShell, CardSkeleton, FallbackAvatar } from "./card-shell"

interface ManagerData {
  strPlayer?: string
  strThumb?: string
  strCutout?: string
  strTeam?: string
  strNationality?: string
  strDescriptionEN?: string
  dateBorn?: string
  strPosition?: string
}

export function ManagerCard({ data }: { data: ManagerData | unknown }) {
  const d = data as ManagerData
  const photo = d.strCutout || d.strThumb || null

  return (
    <CardShell label="Manager">
      <div className="flex gap-4">
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo} alt={d.strPlayer ?? ""} className="w-20 h-20 rounded-xl object-cover shrink-0" style={{ background: "rgba(255,255,255,0.05)" }} onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none" }} />
        ) : (
          <FallbackAvatar name={d.strPlayer ?? "M"} size="lg" />
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-[17px] font-bold text-white mb-0.5">{d.strPlayer}</h3>
          <p className="text-[13px] text-white/50 font-light">{d.strTeam}</p>
          {d.strNationality && <p className="text-[11px] text-white/30 mt-0.5">{d.strNationality}</p>}
        </div>
      </div>
      {d.strDescriptionEN && (
        <p className="text-[12px] text-white/35 mt-4 font-light leading-relaxed line-clamp-4">{d.strDescriptionEN}</p>
      )}
    </CardShell>
  )
}

export function ManagerCardSkeleton() {
  return <CardSkeleton rows={2} />
}
