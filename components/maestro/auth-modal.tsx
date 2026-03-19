"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { createClient } from "@/lib/supabase"
import { useAuthModal } from "@/lib/auth-modal-context"

export function AuthModal() {
  const { isOpen, closeAuthModal } = useAuthModal()
  const router = useRouter()
  const [tab, setTab] = useState<"google" | "email">("google")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const supabase = createClient()

  const handleGoogle = async () => {
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      })
      if (error) {
        setError(error.message)
      } else {
        setMessage("Check your email for a confirmation link.")
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError(error.message)
      } else {
        closeAuthModal()
        router.push("/chat")
        router.refresh()
      }
    }
    setLoading(false)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
        onClick={(e) => { if (e.target === e.currentTarget) closeAuthModal() }}
      >
        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.97, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 12 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-sm rounded-2xl overflow-hidden"
          style={{
            background: "rgba(10,10,14,0.97)",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 32px 80px rgba(0,0,0,0.7)",
          }}
        >
          {/* Gold top accent */}
          <div
            className="h-px"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.6), transparent)",
            }}
          />

          <div className="p-7">
            {/* Logo */}
            <div className="flex items-center gap-2.5 mb-7">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.2)" }}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-[#C9A84C]" />
              </div>
              <span className="text-[13px] font-semibold tracking-[0.25em] text-white">maestro</span>
            </div>

            <h2 className="text-[20px] font-bold text-white mb-1.5">Welcome back</h2>
            <p className="text-[13px] text-white/40 mb-7 font-light">
              Sign in to continue your football intelligence journey.
            </p>

            {/* Tabs */}
            <div
              className="flex rounded-xl p-1 mb-6"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              {(["google", "email"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => { setTab(t); setError(null); setMessage(null) }}
                  className="flex-1 py-2 rounded-lg text-[12px] transition-all duration-200"
                  style={{
                    background: tab === t ? "rgba(255,255,255,0.07)" : "transparent",
                    color: tab === t ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.35)",
                    border: tab === t ? "1px solid rgba(255,255,255,0.1)" : "1px solid transparent",
                  }}
                >
                  {t === "google" ? "Google" : "Email"}
                </button>
              ))}
            </div>

            {tab === "google" ? (
              <button
                onClick={handleGoogle}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-[14px] font-medium transition-all duration-200"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: loading ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.85)",
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.1)"
                    ;(e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(201,168,76,0.3)"
                  }
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.06)"
                  ;(e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.1)"
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {loading ? "Redirecting..." : "Continue with Google"}
              </button>
            ) : (
              <form onSubmit={handleEmailAuth} className="space-y-3">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-xl text-[14px] text-white placeholder:text-white/25 focus:outline-none transition-all duration-200"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(201,168,76,0.35)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-xl text-[14px] text-white placeholder:text-white/25 focus:outline-none transition-all duration-200"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(201,168,76,0.35)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
                />

                {error && (
                  <p className="text-[12px] text-red-400/80 px-1">{error}</p>
                )}
                {message && (
                  <p className="text-[12px] text-green-400/80 px-1">{message}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl text-[14px] font-semibold transition-all duration-200"
                  style={{
                    background: loading ? "rgba(201,168,76,0.4)" : "#C9A84C",
                    color: "#050508",
                    boxShadow: loading ? "none" : "0 0 20px rgba(201,168,76,0.3)",
                  }}
                >
                  {loading ? "..." : isSignUp ? "Create account" : "Sign in"}
                </button>

                <button
                  type="button"
                  onClick={() => { setIsSignUp(!isSignUp); setError(null); setMessage(null) }}
                  className="w-full text-[12px] text-white/30 hover:text-white/60 transition-colors text-center py-1"
                >
                  {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
                </button>
              </form>
            )}

            {error && tab === "google" && (
              <p className="text-[12px] text-red-400/80 mt-3">{error}</p>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
