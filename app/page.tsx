"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { isLoggedIn } from "@/lib/auth"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    if (isLoggedIn()) {
      router.push("/dashboard")
    } else {
      router.push("/login")
    }
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Loading...</h2>
        <p className="text-muted-foreground">Please wait while we redirect you</p>
      </div>
    </div>
  )
}
