"use client"

import { usePathname } from "next/navigation"
import { Footer } from "./footer"

export function FooterWrapper() {
  const pathname = usePathname()

  // Không hiển thị footer trong các trang dashboard
  if (pathname.startsWith("/dashboard")) {
    return null
  }

  return <Footer />
}
