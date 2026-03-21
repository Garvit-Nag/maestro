# Maestro

A conversational football intelligence assistant powered by Gemini 2.5 Flash with multi-tool AI orchestration. Users ask questions in natural language; the server decides which live-data APIs to call, executes them in parallel, injects the results into typed UI components, and returns a combined text + visualization response.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.1.6 (App Router) |
| Runtime | React 19.2.4 |
| Language | TypeScript 5.7.3 |
| AI Model | Google Gemini 2.5 Flash (`@google/generative-ai ^0.24.1`) |
| Database & Auth | Supabase (`@supabase/supabase-js ^2.99.3`, `@supabase/ssr ^0.9.0`) |
| Styling | Tailwind CSS v4, Radix UI primitives |
| Animation | Framer Motion ^12.38.0 |
| Charts | Recharts 2.15.0 |
| 3D | Three.js ^0.183.2 + @react-three/fiber |
| Forms | React Hook Form + Zod |
| Analytics | Vercel Analytics |

---

## External APIs

| API | Purpose | Rate Limit | Key Required |
|---|---|---|---|
| football-data.org v4 | Standings, fixtures, squads, scorers, H2H | 10 req/min (free) | Yes |
| API-Football v3 (api-sports.io) | Player stats, injuries, predictions, home/away form | Premium | Yes (optional — graceful fallback) |
| TheSportsDB v1 | Team/player/manager profiles, stadium info, honours | Free | No |
| NewsAPI v2 | Football news articles | 100 req/day (free) | Yes |

---

## Architecture

```
Browser (React 19)
  │
  └─ POST /api/chat ─────────────────────────────────────────────────────┐
                                                                          │
  Supabase Auth check                                                     │
  Fetch last 6 messages (user-only) + inject synthetic model acks        │
  Filter available tools (drop premium tools if API_FOOTBALL_KEY absent) │
  │                                                                       │
  Gemini 2.5 Flash (system prompt + 19 FunctionDeclarations)             │
  │                                                                       │
  ┌─ Tool call loop (max 5 iterations) ──────────────────────────────┐   │
  │  functionCalls() → Promise.all(executeTool × N) → sendMessage()  │   │
  └──────────────────────────────────────────────────────────────────┘   │
  │                                                                       │
  Parse JSON response (BOM strip → direct → code-block → brace-extract) │
  Inject tool data into component placeholders via COMPONENT_TOOL_MAP    │
  Filter errored/empty components                                         │
  Save to Supabase (messages table, JSONB components column)             │
  │                                                                       │
  Return { text, components[], conversationId, suggest_new_chat }        │
  │                                                                       │
  ComponentRenderer → type string → React component ←────────────────────┘
```

---

## Features

- **19 callable tools** declared as `FunctionDeclaration[]` to Gemini covering standings, fixtures, match results, squads, top scorers, assists, H2H, player/team/manager profiles, stadium info, injuries, home/away form, predictions, honours, news
- **19 typed UI components** rendered client-side: `standings_table`, `player_card`, `side_by_side_player`, `manager_card`, `stadium_card`, `team_card`, `fixture_list`, `match_result`, `scorer_leaderboard`, `assist_leaderboard`, `h2h_timeline`, `injury_grid`, `squad_grid`, `form_split`, `prediction_card`, `honours_card`, `club_grid`, `news_card`, `weekend_fixture_board`
- **Multi-turn conversations** stored in Supabase with per-user conversation history (last 6 messages as context)
- **Personalized fixture feed** — 3-tier selection: favourite team → followed leagues → fallback to top 6 competitions
- **Graceful API degradation** — 4 premium tools disabled at runtime if `API_FOOTBALL_KEY` is absent; `get_top_assists` falls back to football-data.org scorers sorted by assists
- **In-memory TTL caching** per API module: 30s (live fixtures) → 120s (standings) → 300s (match results/news) → 3600s (squad/honours)
- **Team name resolver** — fuzzy NFD-normalized name-to-ID lookup across 6 leagues with 24h cache
- **Onboarding flow** — team and league picker fetching from 6 competitions in parallel, deduplicated by team ID, cached 24h
- **Supabase Auth** — email/password + OAuth with SSR cookie-based session management

---

## Project Structure

```
maestro/
├── app/
│   ├── api/
│   │   ├── chat/route.ts              # Core AI endpoint
│   │   ├── fixtures/route.ts          # Personalized fixture feed
│   │   └── onboarding/teams/route.ts  # Team picker data
│   ├── auth/callback/route.ts         # OAuth code exchange
│   ├── chat/page.tsx                  # Chat UI (Client Component)
│   ├── layout.tsx                     # Root layout + AuthModalProvider
│   ├── page.tsx                       # Landing page
│   ├── error.tsx                      # Error boundary
│   └── not-found.tsx                  # 404
├── lib/
│   ├── gemini.ts                      # Gemini SDK init + FunctionDeclarations
│   ├── system-prompt.ts               # System instructions for Gemini
│   ├── supabase.ts                    # Browser client
│   ├── supabase-server.ts             # SSR client (cookie-based)
│   ├── auth-modal-context.tsx         # Auth state React context
│   ├── content/
│   │   ├── leagues.ts                 # League definitions
│   │   ├── chat.ts                    # Chat UI content
│   │   └── landing.ts                 # Landing page content
│   └── tools/
│       ├── football-data.ts           # football-data.org wrapper + cache
│       ├── api-football.ts            # API-Football wrapper + fallbacks
│       ├── sportsdb.ts                # TheSportsDB wrapper
│       ├── news.ts                    # NewsAPI wrapper
│       ├── league-map.ts              # fd code ↔ AF leagueId mapping
│       └── team-resolver.ts           # Team name → football-data.org ID
├── components/
│   ├── football/                      # 20 data visualization components
│   │   └── component-renderer.tsx     # Type string → React component dispatch
│   ├── maestro/                       # App-level UI components
│   └── ui/                            # Radix UI primitives
├── public/                            # Static assets
├── next.config.mjs
├── package.json
└── tsconfig.json
```

---

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=          # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=     # Supabase anon key (safe for browser)
GEMINI_API_KEY=                    # Google AI Studio API key
FOOTBALL_DATA_API_KEY=             # football-data.org key (free tier)
API_FOOTBALL_KEY=                  # api-sports.io key (optional, premium)
NEWS_API_KEY=                      # newsapi.org key (free developer tier)
```

`API_FOOTBALL_KEY` is optional. Without it, `get_injuries`, `get_predictions`, `get_player_stats`, and `get_home_away_form` are removed from the available tool list at runtime. `get_top_assists` falls back to football-data.org.

---

## Getting Started

```bash
npm install
```

Create `.env.local` with the variables above, then:

```bash
npm run dev
```

The app runs at `http://localhost:3000`. Authentication and AI features require all environment variables to be set.

```bash
npm run build   # Production build
npm start       # Start production server
npm run lint    # ESLint
```
