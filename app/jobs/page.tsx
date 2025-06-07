"use client"

import { useState } from "react"
import { JobSearch } from "@/components/job/job-search"
import { JobGrid } from "@/components/job/job-grid"
import { useLanguage } from "@/lib/i18n/context"

export default function JobsPage() {
  const { t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({})

  const handleSearch = (term: string) => {
    setSearchTerm(term)
  }

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters)
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">{t("jobs.allJobs")}</h1>
      <JobSearch onSearch={handleSearch} onFilterChange={handleFilterChange} />
      <div className="mt-6">
        <JobGrid searchTerm={searchTerm} filters={filters} itemsPerPage={8} />
      </div>
    </div>
  )
}
