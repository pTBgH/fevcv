"use client"

import { MainNav } from "./main-nav"
import { DashboardNav } from "./dashboard-nav"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"

export function ConditionalNav() {
  // Using Next‑Auth to get session data (Keycloak)
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Always show DashboardNav for dashboard routes
  const isDashboardRoute = pathname.startsWith("/dashboard")

  if (!mounted) {
    return null
  }

  if (isDashboardRoute) {
    return <DashboardNav />
  }

  // MainNav now internally handles dynamic auth UI based on Next‑Auth session
  return <MainNav />
}
