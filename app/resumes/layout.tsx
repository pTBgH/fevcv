"use client"

import type React from "react"

import { useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"

export default function ResumesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, isLoading, requireAuth } = useAuth()

  // Check authentication when page loads
  useEffect(() => {
    if (!isLoading) {
      requireAuth()
    }
  }, [isLoading, requireAuth])

  // Show loading state while checking authentication
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

  // If authenticated, show the resume management layout
  return <div className="min-h-screen bg-gray-50 pt-16">{children}</div>
}
