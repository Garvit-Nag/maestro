import { CardShell, CardSkeleton, FormPill } from "./card-shell"

interface TeamData {
  strTeam?: string
  strBadge?: string
  strStadium?: string
  strStadiumLocation?: string
  intStadiumCapacity?: string
  intFormedYear?: string
  strDescriptionEN?: string
  strWebsite?: string
  strTeamShort?: string
  strLeague?: string
  strCountry?: string
  // From football-data standings
  position?: number
  points?: number
  form?: string
}

export function TeamCard({ data }: { data: TeamData | unknown }) {
  const d = data as TeamData
  const form = d.form?.split(",").slice(-5) ?? []

  return (
    <CardShell label="Team Profile">
      <div className="flex gap-4 mb-4">
        {d.strBadge ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={d.strBadge} alt={d.strTeam ?? ""} className="w-16 h-16 object-contain shrink-0" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none" }} />
        ) : (
          <div className="w-16 h-16 rounded-xl bg-white/10 shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-[18px] font-bold text-white mb-0.5">{d.strTeam}</h3>
          <p className="text-[12px] text-white/40 font-light">{d.strLeague ?? d.strCountry}</p>
          {d.intFormedYear && (
            <p className="text-[11px] text-white/25 mt-0.5">Est. {d.intFormedYear}</p>
          )}
          {form.length > 0 && (
            <div className="flex gap-1 mt-2">
              {form.map((r, i) => <FormPill key={i} result={r} />)}
            </div>
          )}
        </div>
      </div>

      {d.strStadium && (
        <div
          className="flex items-center justify-between px-3 py-2.5 rounded-xl"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div>
            <p className="text-[11px] text-[#C9A84C]/70 uppercase tracking-wider text-[9px] mb-0.5">Stadium</p>
            <p className="text-[13px] text-white/70">{d.strStadium}</p>
            {d.strStadiumLocation && <p className="text-[11px] text-white/30">{d.strStadiumLocation}</p>}
          </div>
          {d.intStadiumCapacity && (
            <div className="text-right">
              <p className="text-[9px] text-white/25 uppercase tracking-wider">Capacity</p>
              <p className="text-[14px] font-bold text-white/70">{Number(d.intStadiumCapacity).toLocaleString()}</p>
            </div>
          )}
        </div>
      )}

      {d.strDescriptionEN && (
        <p className="text-[12px] text-white/35 mt-3 font-light leading-relaxed line-clamp-3">
          {d.strDescriptionEN}
        </p>
      )}
    </CardShell>
  )
}

export function TeamCardSkeleton() {
  return <CardSkeleton rows={3} />
}
