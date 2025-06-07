// Sửa lại hook để sử dụng Redux thay vì localStorage
"use client"

import { useCallback } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAppSelector } from "@/lib/redux/hooks"

export function useAuth() {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, isLoading, token, error } = useAppSelector((state) => state.auth)

  // Hàm yêu cầu xác thực, chuyển hướng nếu chưa đăng nhập
  const requireAuth = useCallback(() => {
    if (!isLoading && !isAuthenticated) {
      const returnUrl = encodeURIComponent(pathname)
      router.push(`/auth?redirect=${returnUrl}`)
    }
  }, [isAuthenticated, isLoading, pathname, router])

  // Hàm yêu cầu không xác thực, chuyển hướng nếu đã đăng nhập
  const requireNoAuth = useCallback(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, isLoading, router])

  return {
    isAuthenticated,
    isLoading,
    token,
    error,
    requireAuth,
    requireNoAuth,
  }
}
