import type React from "react"
import { Inter } from "next/font/google"
import "../globals.css"

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section className = "abc">
      {children}
    </ section>
  )
}

export const metadata = {
  generator: "v0.dev",
}