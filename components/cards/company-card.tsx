"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/lib/i18n/context"

interface CompanyCardProps {
  name: string
  logo: string
  featured?: boolean
}

export function CompanyCard({ name, logo, featured }: CompanyCardProps) {
  const { locale } = useLanguage()

  return (
    <div className="bg-white dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-700 p-6 rounded-lg border dark:border-slate-600 hover:shadow-md transition-all duration-300 hover:scale-[1.02] dark:shadow-lg dark:shadow-indigo-900/20">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="relative overflow-hidden rounded-lg bg-white dark:bg-slate-700 w-12 h-12 flex items-center justify-center shadow-sm dark:shadow-indigo-900/20">
            <Image src={logo || "/placeholder.svg"} alt={name} width={48} height={48} className="object-contain" />
          </div>
          <div>
            <h3 className="font-medium dark:text-white">{name}</h3>
            <p className="text-sm text-gray-500 dark:text-indigo-200">{locale === "vi" ? "Việt Nam" : "Vietnam"}</p>
          </div>
        </div>
        {featured && (
          <Badge variant="secondary" className="dark:bg-indigo-600 dark:text-white">
            {locale === "vi" ? "Nổi bật" : "Featured"}
          </Badge>
        )}
      </div>
      <Button
        variant="outline"
        className="w-full mt-4 dark:border-indigo-500/50 dark:text-indigo-200 dark:hover:bg-indigo-600/20 dark:hover:border-indigo-400 transition-colors duration-300"
      >
        {locale === "vi" ? "Vị trí đang tuyển" : "Open Position"}
      </Button>
    </div>
  )
}
