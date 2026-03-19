// NewsAPI — free developer tier: 100 req/day
const cache = new Map<string, { data: unknown; expires: number }>()

export async function get_news(query: string, pageSize = 5) {
  const key = `${query}:${pageSize}`
  const now = Date.now()
  const cached = cache.get(key)
  if (cached && cached.expires > now) return cached.data

  try {
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query + " football")}&sortBy=publishedAt&pageSize=${pageSize}&language=en&apiKey=${process.env.NEWS_API_KEY}`
    const res = await fetch(url)
    if (!res.ok) throw new Error(`NewsAPI ${res.status}`)

    const json = await res.json()
    const articles = (json.articles ?? []).map((a: {
      source?: { name?: string }
      title?: string
      description?: string
      url?: string
      urlToImage?: string
      publishedAt?: string
    }) => ({
      source: a.source?.name ?? "Unknown",
      title: a.title ?? "",
      summary: a.description ?? "",
      url: a.url ?? "",
      image: a.urlToImage ?? null,
      publishedAt: a.publishedAt ?? "",
    }))

    cache.set(key, { data: articles, expires: now + 600 * 1000 })
    return articles
  } catch (e: unknown) {
    return { error: (e as Error).message }
  }
}
