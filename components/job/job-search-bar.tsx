"use client"

import type React from "react"

import { useState } from "react"
import { Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/lib/i18n/context"

interface JobSearchBarProps {
  defaultValue?: string
  onSearch: (term: string) => void
  onToggleFilters: () => void
  showFilters: boolean
  selectedResumeId?: string
  selectedDate?: string
  onResumeSelect?: (id: string | null) => void
  mode?: "search" | "suggest"
}

export function JobSearchBar({
  defaultValue = "",
  onSearch,
  onToggleFilters,
  showFilters,
  selectedResumeId,
  selectedDate,
  onResumeSelect,
  mode = "search",
}: JobSearchBarProps) {
  const [searchTerm, setSearchTerm] = useState(defaultValue)
  const { t } = useLanguage()

  const handleSearch = () => {
    onSearch(searchTerm)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Input
              type="text"
              placeholder={t("search.jobTitleOrKeyword")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onToggleFilters} className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            {showFilters ? t("common.hideFilters") : t("common.showFilters")}
          </Button>
          <Button onClick={handleSearch}>{t("common.search")}</Button>
        </div>
      </div>
    </div>
  )
}
