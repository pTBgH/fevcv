import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Providers } from "./providers"
import { SessionProviderWrapper } from "./SessionProviderWrapper"

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
    <html lang="en" className={inter.variable}>
      <body>
        <SessionProviderWrapper>
          <Providers>
            {children}
          </Providers>
        </SessionProviderWrapper>
      </body>
    </html>
  )
}

export const metadata = {
  generator: "v0.dev",
}
