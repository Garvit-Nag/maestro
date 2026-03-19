"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useAuthModal } from "@/lib/auth-modal-context"
import { Suspense } from "react"

function Trigger() {
  const searchParams = useSearchParams()
  const { openAuthModal } = useAuthModal()

  useEffect(() => {
    if (searchParams.get("auth") === "required") {
      openAuthModal()
    }
  }, [searchParams, openAuthModal])

  return null
}

export function AuthModalTrigger() {
  return (
    <Suspense fallback={null}>
      <Trigger />
    </Suspense>
  )
}
