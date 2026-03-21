import { NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { genAI, MODEL_NAME, toolDeclarations } from "@/lib/gemini"
import { SYSTEM_PROMPT } from "@/lib/system-prompt"
import * as footballData from "@/lib/tools/football-data"
import * as apiFootball from "@/lib/tools/api-football"
import * as sportsdb from "@/lib/tools/sportsdb"
import * as news from "@/lib/tools/news"
import { Content, FunctionResponsePart } from "@google/generative-ai"

// Tool executor — maps tool name to function
async function executeTool(name: string, args: Record<string, string>): Promise<unknown> {
  try {
    switch (name) {
      case "get_standings": return await footballData.get_standings(args.competitionCode)
      case "get_fixtures": return await footballData.get_fixtures(args)
      case "get_match_result": return await footballData.get_match_result(args.matchId)
      case "get_squad": return await footballData.get_squad(args.teamId)
      case "get_top_scorers": return await footballData.get_top_scorers(args.competitionCode)
      case "get_head_to_head": return await footballData.get_head_to_head(args.matchId)
      case "get_league_teams": return await footballData.get_league_teams(args.competitionCode)
      case "get_player_stats": return await apiFootball.get_player_stats(args.playerId, args.season)
      case "get_top_assists": return await apiFootball.get_top_assists(args.leagueId, args.season)
      case "get_injuries": return await apiFootball.get_injuries(args.teamId)
      case "get_home_away_form": return await apiFootball.get_home_away_form(args.teamId, args.leagueId, args.season)
      case "get_predictions": return await apiFootball.get_predictions(args.fixtureId)
      case "get_team_next_events": return await sportsdb.get_team_next_events(args.teamId)
      case "get_team_profile": return await sportsdb.get_team_profile(args.teamName)
      case "get_player_profile": return await sportsdb.get_player_profile(args.playerName)
      case "get_manager_profile": return await sportsdb.get_manager_profile(args.managerName)
      case "get_stadium_info": return await sportsdb.get_stadium_info(args.stadiumName)
      case "get_team_honours": return await sportsdb.get_team_honours(args.teamName)
      case "get_news": return await news.get_news(args.query, args.pageSize ? parseInt(args.pageSize) : 5)
      default: return { error: `Unknown tool: ${name}` }
    }
  } catch (e: unknown) {
    return { error: (e as Error).message }
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { message, conversationId: existingConversationId } = await request.json()
    if (!message?.trim()) {
      return NextResponse.json({ error: "Message required" }, { status: 400 })
    }

    const userId = user.id

    // Get or create conversation
    let conversationId = existingConversationId
    if (!conversationId) {
      const { data: conv, error } = await supabase
        .from("conversations")
        .insert({ user_id: userId, title: message.slice(0, 60).trim() })
        .select("id")
        .single()
      if (error) throw error
      conversationId = conv.id
    }

    // Save user message
    await supabase.from("messages").insert({
      conversation_id: conversationId,
      role: "user",
      content: message,
    })

    // Fetch conversation history (last 6 messages — keeps context tight, reduces contamination)
    const { data: historyRows } = await supabase
      .from("messages")
      .select("role, content")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })
      .limit(6)

    // Primer exchange — always included so Gemini is never starting cold.
    // Prevents empty responses on first message in a new conversation.
    const HISTORY_PRIMER: Content[] = [
      { role: "user", parts: [{ text: "ready?" }] },
      { role: "model", parts: [{ text: '{"text":"Ready. Ask me anything about football.","components":[]}' }] },
    ]

    // Only include user messages in history — including assistant messages (even truncated)
    // causes Gemini to repeat tool calls and merge previous responses into new ones
    const userOnlyHistory: Content[] = (historyRows ?? []).slice(0, -1)
      .filter((row) => row.role === "user")
      .map((row) => ({
        role: "user" as const,
        parts: [{ text: row.content }],
      }))

    // Interleave synthetic model acknowledgments so Gemini sees valid alternating turns
    const conversationHistory: Content[] = []
    for (const entry of userOnlyHistory) {
      conversationHistory.push(entry)
      conversationHistory.push({
        role: "model",
        parts: [{ text: '{"text":"Got it.","components":[]}' }],
      })
    }

    const history: Content[] = [...HISTORY_PRIMER, ...conversationHistory]

    const totalMessages = historyRows?.length ?? 0

    // Initialize Gemini — filter out tools that have no reliable fallback when AF key is absent
    const hasAfKey = !!process.env.API_FOOTBALL_KEY
    const availableTools = toolDeclarations.filter((tool) => {
      if (!hasAfKey && ["get_injuries", "get_predictions", "get_player_stats", "get_home_away_form"].includes(tool.name)) return false
      return true
    })

    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      tools: [{ functionDeclarations: availableTools }],
      systemInstruction: SYSTEM_PROMPT,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 8192,
      },
    })

    console.log(`[chat] user=${userId} msg="${message.slice(0, 60)}"`);

    let chat = model.startChat({ history })
    let result = await chat.sendMessage(message)

    if (!result.response.text() && !result.response.functionCalls()?.length) {
      chat = model.startChat({ history })
      result = await chat.sendMessage(message)
    }

    let iterations = 0

    const calledTools: Array<{ name: string; data: unknown }> = []

    while (result.response.functionCalls()?.length && iterations < 5) {
      iterations++
      const calls = result.response.functionCalls()!

      const toolResponses: FunctionResponsePart[] = await Promise.all(
        calls.map(async (call) => {
          const toolResult = await executeTool(call.name, call.args as Record<string, string>)
          calledTools.push({ name: call.name, data: toolResult })
          return {
            functionResponse: {
              name: call.name,
              response: { result: toolResult },
            },
          }
        })
      )

      result = await chat.sendMessage(toolResponses)
    }

    // Map component type → which tool names supply its data
    const COMPONENT_TOOL_MAP: Record<string, string[]> = {
      standings_table:      ["get_standings"],
      fixture_list:         ["get_fixtures", "get_team_next_events"],
      match_result:         ["get_match_result"],
      squad_grid:           ["get_squad"],
      scorer_leaderboard:   ["get_top_scorers"],
      h2h_timeline:         ["get_head_to_head"],
      club_grid:            ["get_league_teams"],
      player_card:          ["get_player_stats", "get_player_profile"],
      side_by_side_player:  ["get_player_profile"],
      assist_leaderboard:   ["get_top_assists"],
      injury_grid:          ["get_injuries"],
      form_split:           ["get_home_away_form"],
      prediction_card:      ["get_predictions"],
      team_card:            ["get_team_profile"],
      manager_card:         ["get_manager_profile"],
      stadium_card:         ["get_stadium_info"],
      honours_card:         ["get_team_honours", "get_team_profile"],
      news_card:            ["get_news"],
      weekend_fixture_board:["get_fixtures"],
    }

    const rawText = result.response.text()
    let parsed: { text: string; components: Array<{ type: string; data: unknown }> }

    function extractParsed(raw: string) {
      const cleaned = raw.replace(/^\uFEFF/, "").trim()
      // 1. Direct parse
      try { return JSON.parse(cleaned) } catch {}
      // 2. Code block
      const codeBlock = cleaned.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/)
      if (codeBlock) {
        try { return JSON.parse(codeBlock[1]) } catch {}
      }
      // 3. First { to last } — single attempt
      const start = cleaned.indexOf("{")
      const end = cleaned.lastIndexOf("}")
      if (start !== -1 && end > start) {
        try { return JSON.parse(cleaned.slice(start, end + 1)) } catch {}
      }
      return null
    }

    const extracted = extractParsed(rawText)

    /** Returns true if tool data is an error or effectively empty */
    function isErroredOrEmpty(data: unknown): boolean {
      if (data == null) return true
      if (typeof data === "object" && !Array.isArray(data)) {
        const obj = data as Record<string, unknown>
        if ("error" in obj) return true
        if (Object.keys(obj).length === 0) return true
      }
      if (Array.isArray(data) && data.length === 0) return true
      return false
    }

    if (extracted && typeof extracted.text === "string") {
      // Inject real tool data into each component — Gemini only told us the type
      const enrichedComponents = (extracted.components ?? []).map(
        (comp: { type: string; data: unknown }) => {
          const toolNames = COMPONENT_TOOL_MAP[comp.type] ?? []
          const matches = calledTools.filter(t => toolNames.includes(t.name))
          if (matches.length === 0) return comp
          // Special case: player_card needs profile fields + flat stats merged
          if (comp.type === "player_card") {
            const profileResult = matches.find(m => m.name === "get_player_profile")?.data as Record<string, unknown> ?? {}
            const statsResult = matches.find(m => m.name === "get_player_stats")?.data
            const statsArr = Array.isArray(statsResult) ? statsResult as Array<{ statistics?: Array<{ games?: { appearances?: number; rating?: string }; goals?: { total?: number; assists?: number }; cards?: { yellow?: number; red?: number } }> }> : []
            const firstStats = statsArr[0]?.statistics?.[0]
            return {
              type: comp.type,
              data: {
                ...profileResult,
                ...(firstStats ? {
                  goals: firstStats.goals?.total ?? null,
                  assists: firstStats.goals?.assists ?? null,
                  rating: firstStats.games?.rating ? parseFloat(firstStats.games.rating).toFixed(1) : null,
                  appearances: firstStats.games?.appearances ?? null,
                } : {}),
              }
            }
          }
          // Single tool → pass data directly
          // Multiple calls of the SAME tool (e.g. 2x get_player_profile) → array so both survive
          // Multiple different tools → merge by tool name
          const uniqueNames = new Set(matches.map(m => m.name))
          const injectedData = matches.length === 1
            ? matches[0].data
            : uniqueNames.size === 1
              ? matches.map(m => m.data)
              : Object.fromEntries(matches.map(t => [t.name, t.data]))
          return { type: comp.type, data: injectedData }
        }
      ).filter((comp: { type: string; data: unknown }) => !isErroredOrEmpty(comp.data))
      parsed = { text: extracted.text, components: enrichedComponents }
    } else {
      // Fallback: plain text, surface whatever tool data we got as components
      const textOnly = rawText.replace(/```(?:json)?/g, "").replace(/```/g, "").trim()
      const fallbackComponents = calledTools
        .filter((t) => !isErroredOrEmpty(t.data))
        .map(t => {
          const compType = Object.entries(COMPONENT_TOOL_MAP).find(([, tools]) => tools.includes(t.name))?.[0]
          return compType ? { type: compType, data: t.data } : null
        }).filter(Boolean) as Array<{ type: string; data: unknown }>
      parsed = { text: textOnly, components: fallbackComponents }
    }

    // Save assistant message
    await supabase.from("messages").insert({
      conversation_id: conversationId,
      role: "assistant",
      content: parsed.text,
      components: parsed.components?.length ? parsed.components : null,
    })

    // Update conversation title if this is the first message
    if (totalMessages <= 1) {
      await supabase
        .from("conversations")
        .update({ title: message.slice(0, 60).trim() })
        .eq("id", conversationId)
    }

    return NextResponse.json({
      text: parsed.text,
      components: parsed.components ?? [],
      conversationId,
      suggest_new_chat: totalMessages > 20,
    })
  } catch (e: unknown) {
    console.error("Chat route error:", e)
    return NextResponse.json(
      { error: "VAR is reviewing this one. Try again.", text: "Something went wrong. Please try again.", components: [] },
      { status: 500 }
    )
  }
}
