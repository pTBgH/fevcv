"use client"

import { useCallback } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks"
import { showLoginPrompt, hideLoginPrompt } from "@/lib/redux/slices/uiSlice"

export function useAuthCheck() {
  const router = useRouter()
  const dispatch = useAppDispatch()

  // Lấy trạng thái xác thực từ Redux
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  const loginPromptOpen = useAppSelector((state) => state.ui.loginPromptOpen)
  const currentFeature = useAppSelector((state) => state.ui.currentFeature)

  const checkAuth = useCallback(
    (callback: () => void, featureName: string) => {
      return () => {
        if (isAuthenticated) {
          // Nếu đã đăng nhập, thực hiện callback
          callback()
          return true
        } else {
          // Hiển thị login prompt
          console.log(`Yêu cầu đăng nhập để ${featureName}`)
          dispatch(showLoginPrompt(featureName))
          return false
        }
      }
    },
    [isAuthenticated, dispatch],
  )

  const redirectToLogin = useCallback(() => {
    // Lưu đường dẫn hiện tại để chuyển hướng sau khi đăng nhập
    const currentPath = typeof window !== "undefined" ? window.location.pathname : ""
    router.push(`/auth?redirect=${encodeURIComponent(currentPath)}`)
  }, [router])

  const closeLoginPrompt = useCallback(() => {
    dispatch(hideLoginPrompt())
  }, [dispatch])

  return {
    isAuthenticated,
    checkAuth,
    redirectToLogin,
    loginPromptOpen,
    closeLoginPrompt,
    currentFeature,
  }
}
