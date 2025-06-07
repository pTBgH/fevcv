"use client"

import type React from "react"

import { useEffect } from "react"
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks"
import { selectTheme, setTheme } from "@/lib/redux/slices/uiSlice"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useAppSelector(selectTheme)
  const dispatch = useAppDispatch()

  // Khởi tạo theme từ localStorage chỉ một lần khi component mount
  useEffect(() => {
    // Lấy theme từ localStorage nếu có
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | "system" | null

    if (savedTheme && savedTheme !== theme) {
      dispatch(setTheme(savedTheme))
    } else {
      // Áp dụng theme hiện tại
      applyTheme(theme)
    }
  }, []) // Chỉ chạy một lần khi component mount

  // Effect riêng biệt để xử lý khi theme thay đổi
  useEffect(() => {
    // Áp dụng theme
    applyTheme(theme)

    // Lưu theme vào localStorage
    localStorage.setItem("theme", theme)
  }, [theme])

  // Lắng nghe thay đổi theme từ system
  useEffect(() => {
    if (theme !== "system") return

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

    const handleChange = () => {
      // Chỉ áp dụng theme mà không cập nhật state
      if (theme === "system") {
        const isDark = mediaQuery.matches
        if (isDark) {
          document.documentElement.classList.add("dark")
        } else {
          document.documentElement.classList.remove("dark")
        }
      }
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [theme])

  return <>{children}</>
}

// Hàm áp dụng theme
function applyTheme(theme: "light" | "dark" | "system") {
  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)

  if (isDark) {
    document.documentElement.classList.add("dark")
  } else {
    document.documentElement.classList.remove("dark")
  }
}
