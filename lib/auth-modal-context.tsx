"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"
import { User } from "@supabase/supabase-js"

interface AuthModalContextType {
  isOpen: boolean
  openAuthModal: () => void
  closeAuthModal: () => void
  sessionUser: User | null
  setSessionUser: (user: User | null) => void
}

const AuthModalContext = createContext<AuthModalContextType>({
  isOpen: false,
  openAuthModal: () => {},
  closeAuthModal: () => {},
  sessionUser: null,
  setSessionUser: () => {},
})

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [sessionUser, setSessionUser] = useState<User | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setSessionUser(user)
    })
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) setIsOpen(false) // Close modal if logging out naturally
      setSessionUser(session?.user ?? null)
    })
    
    return () => subscription.unsubscribe()
  }, [])

  return (
    <AuthModalContext.Provider
      value={{
        isOpen,
        openAuthModal: () => setIsOpen(true),
        closeAuthModal: () => setIsOpen(false),
        sessionUser,
        setSessionUser
      }}
    >
      {children}
    </AuthModalContext.Provider>
  )
}

export function useAuthModal() {
  return useContext(AuthModalContext)
}
