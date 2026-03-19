"use client"

import { useState, useRef, useEffect } from "react"

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (value.trim() && !disabled) {
      onSend(value.trim())
      setValue("")
    }
  }

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <div className="border-t border-[#1C1C23] bg-[#0A0A0C]">
      <form onSubmit={handleSubmit} className="px-8 lg:px-16 py-6">
        <div className={`flex items-center gap-4 transition-colors ${
          isFocused ? 'border-[#1C1C23]' : ''
        }`}>
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Ask about teams, players, tactics..."
            disabled={disabled}
            className="flex-1 bg-transparent text-[15px] text-white placeholder:text-[#3A3A48] focus:outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!value.trim() || disabled}
            className="text-white hover:text-[#C9A84C] transition-colors disabled:opacity-30 disabled:hover:text-white"
          >
            <span className="text-lg">→</span>
          </button>
        </div>
      </form>
    </div>
  )
}
