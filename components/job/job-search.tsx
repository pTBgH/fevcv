"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { useLanguage } from "@/lib/i18n/context"

interface JobSearchProps {
  defaultValue?: string
  onSearch?: (term: string) => void
  onFilterChange?: (newFilters: any) => void
}

export function JobSearch({ defaultValue = "" }: JobSearchProps) {
  const [searchTerm, setSearchTerm] = useState(defaultValue)
  const router = useRouter()
  const { t } = useLanguage()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/search?q=${encodeURIComponent(searchTerm)}`)
  }

  return (
    <form onSubmit={handleSearch} className="flex w-full max-w-3xl mx-auto">
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder={t("search.jobTitleOrKeyword")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 w-full"
        />
      </div>
      <Button type="submit" className="ml-2 bg-indigo-600 hover:bg-indigo-700">
        {t("common.search")}
      </Button>
    </form>
  )
}
