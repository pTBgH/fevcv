"use client"

import { useEffect, useState, type ReactNode } from "react"

interface HtmlWrapperProps {
  children: ReactNode
  defaultLang?: string
  className?: string
  // Thêm các thuộc tính khác mà bạn muốn áp dụng cho thẻ html
  foxified?: boolean
}

export function HtmlWrapper({ children, defaultLang = "vi", className = "", foxified = false }: HtmlWrapperProps) {
  // State để theo dõi xem component đã được hydrate chưa
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    // Đánh dấu đã hydrate
    setIsHydrated(true)

    // Lấy thẻ html
    const htmlElement = document.documentElement

    // Áp dụng thuộc tính foxified nếu cần
    if (foxified) {
      htmlElement.setAttribute("foxified", "true")
    } else {
      htmlElement.removeAttribute("foxified")
    }

    // Cleanup khi component unmount
    return () => {
      if (foxified) {
        htmlElement.removeAttribute("foxified")
      }
    }
  }, [foxified])

  // Trả về children mà không thay đổi DOM trực tiếp
  // Điều này đảm bảo rằng SSR và client render giống nhau trong lần render đầu tiên
  return <>{children}</>
}
