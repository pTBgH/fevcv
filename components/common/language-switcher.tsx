"use client"

import { useLanguage } from "@/lib/i18n/context"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Image from "next/image"
import { useEffect, useState } from "react"

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage()
  const [mounted, setMounted] = useState(false)

  // Only show the component after first mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-8 h-8"></div>
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative w-8 h-8 overflow-hidden rounded-full">
          {/* Display flag based on current language */}
          <Image
            src={`/flags/${locale === "en" ? "en" : "vi"}.svg`}
            alt={locale === "en" ? "English" : "Tiếng Việt"}
            fill
            className="object-cover"
          />
          <span className="sr-only">Chuyển đổi ngôn ngữ</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setLocale("vi")} className={locale === "vi" ? "bg-muted" : ""}>
          <div className="flex items-center gap-2">
            <div className="relative w-5 h-4 overflow-hidden rounded">
              <Image src="/flags/vi.svg" alt="Tiếng Việt" fill className="object-cover" />
            </div>
            <span>Tiếng Việt</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLocale("en")} className={locale === "en" ? "bg-muted" : ""}>
          <div className="flex items-center gap-2">
            <div className="relative w-5 h-4 overflow-hidden rounded">
              <Image src="/flags/en.svg" alt="English" fill className="object-cover" />
            </div>
            <span>English</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
