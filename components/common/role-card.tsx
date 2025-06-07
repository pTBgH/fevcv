"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/lib/i18n/context"

interface RoleCardProps {
  title: string
  company: string
  matchPercentage: number
  isNew?: boolean
  onClick?: () => void
}

export function RoleCard({ title, company, matchPercentage, isNew = false, onClick }: RoleCardProps) {
  const { t } = useLanguage()

  return (
    <div className="bg-white dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-700 p-4 rounded-lg border dark:border-slate-600 hover:shadow-md transition-all duration-300 hover:scale-[1.02] dark:shadow-lg dark:shadow-indigo-900/20">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="font-medium dark:text-white">{title}</h3>
          <p className="text-sm text-gray-500 dark:text-indigo-200">{company}</p>
        </div>
        {isNew && <Badge className="bg-emerald-500 dark:bg-emerald-600 dark:text-white">New</Badge>}
      </div>
      <div className="mb-3">
        <div className="h-2 bg-gray-200 dark:bg-slate-600 rounded-full overflow-hidden">
          <div
            className="h-2 bg-indigo-600 dark:bg-gradient-to-r dark:from-indigo-500 dark:to-purple-500 rounded-full"
            style={{ width: `${matchPercentage}%` }}
          ></div>
        </div>
        <p className="text-xs text-right mt-1 dark:text-indigo-200">
          {matchPercentage}% {t("dashboard.match")}
        </p>
      </div>
      <Button
        onClick={onClick}
        className="w-full dark:bg-gradient-to-r dark:from-indigo-600 dark:to-indigo-500 dark:hover:from-indigo-500 dark:hover:to-indigo-400 dark:text-white transition-all duration-300"
      >
        {t("common.viewDetails")}
      </Button>
    </div>
  )
}
