"use client"

import { useState, useEffect } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useLanguage } from "@/lib/i18n/context"

interface JobFilterSidebarProps {
  onFilterChange?: (filters: any) => void
  onClearFilters?: () => void
  className?: string
  activeFilter: string | null
}

export function JobFilterSidebar({ onFilterChange, className = "", activeFilter }: JobFilterSidebarProps) {
  const { t } = useLanguage()
  const [filters, setFilters] = useState<Record<string, any>>({})

  // Reset filters when activeFilter changes
  useEffect(() => {
    setFilters({})
  }, [activeFilter])

  const handleFilterChange = (category: string, value: string, checked: boolean) => {
    const newFilters = { ...filters }

    if (!newFilters[category]) {
      newFilters[category] = []
    }

    if (checked) {
      newFilters[category] = [...newFilters[category], value]
    } else {
      newFilters[category] = newFilters[category].filter((item: string) => item !== value)
    }

    setFilters(newFilters)

    if (onFilterChange) {
      onFilterChange(newFilters)
    }
  }

  // Define filter options for each category
  const filterOptions = {
    category: ["Commerce", "Telecommunications", "Hotels & Tourism", "Education", "Financial Services"],
    location: ["Ho Chi Minh City", "Hanoi", "Da Nang", "Can Tho", "Nha Trang"],
    jobType: ["Full-time", "Part-time", "Contract", "Freelance", "Internship"],
    experience: ["Entry Level", "Mid Level", "Senior Level", "Manager", "Executive"],
    postedDate: ["Today", "Last 3 days", "Last week", "Last month", "Any time"],
    salary: ["Under $30K", "$30K - $50K", "$50K - $80K", "$80K - $100K", "Above $100K"],
  }

  // If no active filter, don't show anything
  if (!activeFilter) {
    return null
  }

  // Get options for the active filter
  const options = filterOptions[activeFilter as keyof typeof filterOptions] || []

  return (
    <div className={`bg-white rounded-lg border p-4 ${className}`}>
      <div className="space-y-4">
        {options.map((option) => (
          <div key={option} className="flex items-start space-x-2">
            <Checkbox
              id={`${activeFilter}-${option}`}
              checked={filters[activeFilter]?.includes(option) || false}
              onCheckedChange={(checked) => handleFilterChange(activeFilter, option, checked === true)}
            />
            <Label
              htmlFor={`${activeFilter}-${option}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {option}
            </Label>
          </div>
        ))}
      </div>
    </div>
  )
}
