"use client"

import type { ReactNode } from "react"

export function ClientProvider({ children }: { children: ReactNode }) {
  return <>{children}</>
}
