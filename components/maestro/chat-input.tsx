"use client"

import { useState, useRef, useEffect } from "react"
import { inputContent } from "@/lib/content/chat"

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
  hint?: string
}

export function ChatInput({ onSend, disabled, hint }: ChatInputProps) {
  const [value, setValue] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (value.trim() && !disabled) {
      onSend(value.trim())
      setValue("")
      // Reset textarea height
      if (inputRef.current) inputRef.current.style.height = "auto"
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as unknown as React.FormEvent)
    }
  }

  const handleInput = () => {
    const el = inputRef.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = Math.min(el.scrollHeight, 180) + "px"
  }

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const hasValue = value.trim().length > 0

  return (
    <div
      className="shrink-0 px-4 pt-3 pb-5"
      style={{ background: "rgba(5,5,8,0)" }}
    >
      {/* Centered container — same max-width as messages */}
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit}>
          <div
            className="relative flex items-end gap-3 rounded-2xl px-4 pt-3.5 pb-3 transition-all duration-200"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: isFocused
                ? "1px solid rgba(201,168,76,0.3)"
                : "1px solid rgba(255,255,255,0.09)",
              boxShadow: isFocused
                ? "0 0 0 4px rgba(201,168,76,0.05), 0 8px 32px rgba(0,0,0,0.3)"
                : "0 4px 24px rgba(0,0,0,0.2)",
              ...(disabled && { opacity: 0.5 }),
            }}
          >
            <textarea
              ref={inputRef}
              rows={1}
              value={value}
              onChange={(e) => { setValue(e.target.value); handleInput() }}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={inputContent.placeholder}
              disabled={disabled}
              className="flex-1 bg-transparent text-[15px] text-white placeholder:text-white/20 focus:outline-none font-light resize-none leading-relaxed"
              style={{ maxHeight: "180px", overflowY: "auto" }}
            />

            {/* Send button */}
            <button
              type="submit"
              disabled={!hasValue || disabled}
              className="shrink-0 w-8 h-8 flex items-center justify-center rounded-xl transition-all duration-200 mb-0.5"
              style={{
                background: hasValue && !disabled
                  ? "#C9A84C"
                  : "rgba(255,255,255,0.06)",
                color: hasValue && !disabled ? "#050508" : "rgba(255,255,255,0.2)",
                boxShadow: hasValue && !disabled ? "0 0 16px rgba(201,168,76,0.35)" : "none",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 2.5a.5.5 0 0 1 .5.5v9.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 12.793V3a.5.5 0 0 1 .5-.5z" transform="rotate(180, 8, 8)" />
              </svg>
            </button>
          </div>
        </form>

        {/* Hint */}
        <div className="text-center mt-2.5 space-y-1">
          {hint && (
            <p className="text-[11px] text-[#C9A84C]/40">{hint}</p>
          )}
          <p className="text-[11px] text-white/15">
            Press <kbd className="text-white/25">Enter</kbd> to send · <kbd className="text-white/25">Shift+Enter</kbd> for new line
          </p>
        </div>
      </div>
    </div>
  )
}
