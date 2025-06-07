"use client"

import { useAppSelector } from "@/lib/redux/hooks"
import { MainNav } from "./main-nav"
import { DashboardNav } from "./dashboard-nav"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export function ConditionalNav() {
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth)
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  // Đánh dấu component đã mount để tránh hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Luôn hiển thị DashboardNav trong các route dashboard
  const isDashboardRoute = pathname.startsWith("/dashboard")

  // Nếu chưa mount, trả về null để tránh hydration mismatch
  if (!mounted) {
    return null
  }

  // Sửa lại logic hiển thị navigation dựa trên route

  // Chỉ hiển thị DashboardNav khi ở trong các route dashboard
  // Không phụ thuộc vào trạng thái đăng nhập
  if (isDashboardRoute) {
    return <DashboardNav />
  }

  // Hiển thị MainNav cho tất cả các trang khác
  // MainNav sẽ tự xử lý hiển thị các phần tử khác nhau dựa trên trạng thái đăng nhập
  return <MainNav />
}
