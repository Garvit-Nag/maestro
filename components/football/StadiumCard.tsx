import { CardShell, CardSkeleton } from "./card-shell"

interface StadiumData {
  strStadium?: string
  strStadiumThumb?: string
  strStadiumLocation?: string
  intCapacity?: string
  intStadiumCapacity?: string
  strTeam?: string
  strDescriptionEN?: string
}

export function StadiumCard({ data }: { data: StadiumData | unknown }) {
  const d = data as StadiumData
  const capacity = d.intCapacity ?? d.intStadiumCapacity

  return (
    <CardShell label="Stadium">
      {d.strStadiumThumb && (
        <div className="w-full h-36 rounded-xl overflow-hidden mb-4" style={{ background: "rgba(255,255,255,0.05)" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={d.strStadiumThumb} alt={d.strStadium ?? ""} className="w-full h-full object-cover" onError={(e) => { (e.currentTarget as HTMLImageElement).parentElement!.style.display = "none" }} />
        </div>
      )}
      <h3 className="text-[18px] font-bold text-white mb-1">{d.strStadium}</h3>
      {d.strTeam && <p className="text-[12px] text-white/40 mb-3">{d.strTeam}</p>}
      <div className="flex gap-3">
        {d.strStadiumLocation && (
          <div className="flex-1 px-3 py-2.5 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="text-[9px] uppercase tracking-wider text-[#C9A84C]/60 mb-0.5">Location</p>
            <p className="text-[12px] text-white/65">{d.strStadiumLocation}</p>
          </div>
        )}
        {capacity && (
          <div className="px-3 py-2.5 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="text-[9px] uppercase tracking-wider text-[#C9A84C]/60 mb-0.5">Capacity</p>
            <p className="text-[14px] font-bold text-white/70">{Number(capacity).toLocaleString()}</p>
          </div>
        )}
      </div>
      {d.strDescriptionEN && (
        <p className="text-[12px] text-white/35 mt-3 font-light leading-relaxed line-clamp-3">{d.strDescriptionEN}</p>
      )}
    </CardShell>
  )
}

export function StadiumCardSkeleton() {
  return <CardSkeleton rows={2} />
}
