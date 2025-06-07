"use client"

import type React from "react"
import { useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { LanguageProvider } from "@/lib/i18n/context"
import { useAppDispatch } from "@/lib/redux/hooks"
import { setNavType } from "@/lib/redux/slices/uiSlice"
import { DashboardNav } from "@/components/layout/dashboard-nav"
import { FooterWrapper } from "@/components/layout/footer-wrapper"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, isLoading, requireAuth } = useAuth()
  const dispatch = useAppDispatch()

  // Set navigation type to 'dashboard' when entering dashboard
  useEffect(() => {
    dispatch(setNavType("dashboard"))

    // Cleanup: reset navigation type to 'main' when leaving dashboard
    return () => {
      dispatch(setNavType("main"))
    }
  }, [dispatch])

  // Check authentication when page loads
  useEffect(() => {
    if (!isLoading) {
      requireAuth()
    }
  }, [isLoading, requireAuth])

  // Show loading when checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-500"></div>
      </div>
    )
  }

  // If not authenticated, return null (will be redirected by requireAuth)
  if (!isAuthenticated) {
    return null
  }

  // If authenticated, show dashboard layout
  return (
    <LanguageProvider>
      <div className="flex flex-col min-h-screen bg-[#F0F0F0]">
        <DashboardNav />
        <main className="flex-1 pt-16 p-4 md:p-6 overflow-auto">
          <div className="max-w-screen-xl mx-auto">{children}</div>
        </main>
        <FooterWrapper />
      </div>
    </LanguageProvider>
  )
}
