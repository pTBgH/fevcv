"use client"

import { useEffect, useState, type ReactNode } from "react"

interface ReduxProviderCheckProps {
  children: ReactNode
  fallback?: ReactNode
}

export function ReduxProviderCheck({ children, fallback }: ReduxProviderCheckProps) {
  const [isReduxReady, setIsReduxReady] = useState(false)

  useEffect(() => {
    try {
      // Kiểm tra xem Redux store đã sẵn sàng chưa
      const reduxState = (window as any).__REDUX_STATE__
      if (reduxState) {
        setIsReduxReady(true)
      } else {
        // Nếu không có state, thử kiểm tra sau 100ms
        const timer = setTimeout(() => {
          setIsReduxReady(true) // Giả định là sẵn sàng sau timeout
        }, 100)
        return () => clearTimeout(timer)
      }
    } catch (error) {
      console.error("Error checking Redux state:", error)
      // Nếu có lỗi, vẫn hiển thị UI
      setIsReduxReady(true)
    }
  }, [])

  if (!isReduxReady) {
    // Hiển thị fallback hoặc null khi Redux chưa sẵn sàng
    return fallback ? <>{fallback}</> : null
  }

  return <>{children}</>
}
