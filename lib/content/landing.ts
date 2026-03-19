export const tickerItems = [
  "Live data from 150+ leagues",
  "Player stats updated in real time",
  "Ask in plain English",
  "Powered by Gemini",
  "Transfer news as it breaks",
  "2,800+ teams tracked",
  "250K+ player profiles",
]

export const knowledgeItems = [
  "Live scores & standings",
  "Player stats & injuries",
  "Transfers & team news",
]

export const heroContent = {
  label: "Football Intelligence",
  headline: ["The game,", "understood."],
  subtext: "Ask anything. Maestro knows.",
  cta: "Begin",
  enterLabel: "Enter",
}

export const capabilitiesContent = {
  label: "Built for the Game",
  heading: ["Everything you'd ask", "a football expert."],
  body: "Maestro understands your question, pulls live data, and shows you the answer — not just text.",
}

export const capabilityCards = [
  {
    id: 1,
    label: "Standings Response",
    type: "standings" as const,
  },
  {
    id: 2,
    label: "Player Stats Response",
    type: "stats" as const,
  },
  {
    id: 3,
    label: "Match Result Response",
    type: "match" as const,
  },
]

export const ctaContent = {
  question: "Ready to think differently about football?",
  cta: "Enter Maestro",
}

export const footerContent = {
  brand: "maestro · football intelligence",
  links: [
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
  ],
}

export const faqContent = {
  label: "Common Questions",
  heading: "What people ask.",
  items: [
    {
      q: "What leagues and competitions does Maestro cover?",
      a: "Maestro covers 150+ leagues and competitions worldwide — from the Premier League, La Liga, Bundesliga, Serie A, and Ligue 1, to the Champions League, Europa League, Copa América, and World Cup qualifiers. Regional leagues across Asia, Africa, and the Americas are included too.",
    },
    {
      q: "How current is the data?",
      a: "Live scores and match events update in real time during games. Standings, stats, and player data refresh within minutes of a match ending. Transfer news and injury updates are pulled as they're reported.",
    },
    {
      q: "Can I ask in natural language?",
      a: "Yes — that's the core of Maestro. You can ask things like \"Who's Arsenal's top scorer this season?\" or \"What was the result last time Liverpool played Madrid?\" and get a direct, structured answer. No filters, no dropdowns.",
    },
    {
      q: "Does Maestro show tactical and lineup analysis?",
      a: "Maestro provides confirmed lineups, formation data, and recent tactical trends for most top-flight clubs. Deeper tactical breakdowns are on the roadmap as we expand the data layer.",
    },
    {
      q: "How is Maestro different from just searching Google?",
      a: "Google returns pages — Maestro returns answers. Instead of scanning headlines and Wikipedia tables, you get a direct structured response with live data, stats cards, and context. It's the difference between searching for information and just knowing it.",
    },
    {
      q: "Is there a mobile app?",
      a: "Not yet — Maestro is currently web-only and optimised for desktop. A mobile experience is planned. The web app works on mobile browsers in the meantime.",
    },
  ],
}
