"use client"

import { CrashDashboard } from "@/components/crash-dashboard"
import { Button } from "@/components/ui/button"
import { isLoggedIn, logout } from "@/lib/auth"
import { LogOut } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to login if not logged in
    if (!isLoggedIn()) {
      router.push("/login")
    }
  }, [router])

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="w-full max-w-[1200px] mx-auto px-4 flex h-14 items-center">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <span className="h-6 w-6 rounded-full bg-red-500"></span>
            <span>CrashGuard Pro</span>
          </Link>
          <nav className="flex flex-1 items-center justify-end space-x-4">
            <Link href="/dashboard" className="text-sm font-medium">
              Dashboard
            </Link>
            <Link href="/teams" className="text-sm font-medium">
              Teams
            </Link>
            <Link href="/reports" className="text-sm font-medium">
              Reports
            </Link>
            <Link href="/settings" className="text-sm font-medium">
              Settings
            </Link>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <CrashDashboard />
      </main>
    </div>
  )
}
