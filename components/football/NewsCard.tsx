import { CardShell, CardSkeleton } from "./card-shell"
import { ExternalLink } from "lucide-react"

interface Article {
  source?: string
  title?: string
  summary?: string
  url?: string
  image?: string | null
  publishedAt?: string
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const hours = Math.floor(diff / 3600000)
  if (hours < 1) return "just now"
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

export function NewsCard({ data }: { data: Article[] | unknown }) {
  const articles = (Array.isArray(data) ? data : []) as Article[]

  if (!articles.length) return <div className="text-white/30 text-[13px]">No news found.</div>

  return (
    <CardShell label="Latest News">
      <div className="space-y-3">
        {articles.slice(0, 5).map((article, idx) => (
          <a
            key={idx}
            href={article.url ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex gap-3 group rounded-xl p-3 transition-all duration-200 block"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"
              ;(e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.09)"
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)"
              ;(e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.05)"
            }}
          >
            {/* Thumbnail */}
            {article.image && (
              <div className="shrink-0 w-16 h-12 rounded-lg overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={article.image}
                  alt=""
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).parentElement!.style.display = "none" }}
                />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className="text-[13px] text-white/80 font-medium leading-snug line-clamp-2 group-hover:text-white transition-colors">
                  {article.title}
                </p>
                <ExternalLink className="w-3 h-3 text-white/20 shrink-0 mt-0.5 group-hover:text-white/40 transition-colors" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[#C9A84C]/60">{article.source}</span>
                <span className="text-[10px] text-white/20">·</span>
                <span className="text-[10px] text-white/25">
                  {article.publishedAt ? timeAgo(article.publishedAt) : ""}
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </CardShell>
  )
}

export function NewsCardSkeleton() {
  return <CardSkeleton rows={5} />
}
