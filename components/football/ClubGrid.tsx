import { CardShell, CardSkeleton } from "./card-shell"

interface Club {
  id?: number
  name?: string
  shortName?: string
  crest?: string
  area?: { name?: string }
}

export function ClubGrid({ data }: { data: Club[] | unknown }) {
  const clubs = (Array.isArray(data) ? data : []) as Club[]
  if (!clubs.length) return <div className="text-white/30 text-[13px]">No clubs found.</div>

  return (
    <CardShell label="Clubs">
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {clubs.map((club, idx) => (
          <div
            key={club.id ?? idx}
            className="flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200 cursor-default"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            {club.crest ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={club.crest} alt="" className="w-10 h-10 object-contain" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none" }} />
            ) : (
              <div className="w-10 h-10 rounded-full bg-white/10" />
            )}
            <span className="text-[10px] text-white/50 text-center leading-tight">{club.shortName ?? club.name}</span>
          </div>
        ))}
      </div>
    </CardShell>
  )
}

export function ClubGridSkeleton() {
  return <CardSkeleton rows={3} />
}
