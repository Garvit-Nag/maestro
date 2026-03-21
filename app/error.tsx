"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { FaArrowRight } from "react-icons/fa6"
import { Logo } from "@/components/maestro/logo"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Global Error Caught:", error)
  }, [error])

  return (
    <div className="min-h-screen bg-[#050508] flex flex-col items-center justify-center relative overflow-hidden p-4">
      {/* Global Fixed Background from Landing Page */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.40]"
          style={{
            backgroundImage: "url('/bg-1.png')",
            mixBlendMode: "luminosity",
          }}
        />
        <div className="absolute inset-0 bg-[#050508]/60 backdrop-blur-[1px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050508]/30 via-[#050508]/75 to-[#050508]" />
      </div>

      {/* Background glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20 pointer-events-none z-0"
        style={{ background: "radial-gradient(circle, rgba(201,168,76,0.15) 0%, transparent 60%)" }} 
      />
      
      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8 scale-125"
        >
          <Logo />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-sm"
        >
          <div className="w-12 h-12 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center mx-auto mb-6">
            <span className="text-[#C9A84C] text-xl font-bold">!</span>
          </div>
          <h2 className="text-[24px] font-bold text-white mb-3 tracking-tight">Something went wrong</h2>
          <p className="text-[15px] text-white/40 font-light leading-relaxed mb-8">
            An unexpected error has occurred. We've logged the issue and are looking into it.
          </p>
          
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => window.location.href = '/'}
              className="group relative inline-flex items-center gap-3 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-[#C9A84C]/40 text-white/80 transition-all duration-300 px-6 py-3 rounded-xl text-[14px]"
            >
              Return to home
              <span className="text-[#C9A84C] group-hover:translate-x-1 transition-transform flex items-center">
                <FaArrowRight className="w-3.5 h-3.5" />
              </span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
