"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/i18n/context"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
  maxVisiblePages?: number
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
  maxVisiblePages = 5,
}: PaginationProps) {
  const { t } = useLanguage()

  if (totalPages <= 1) return null

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
    }
  }

  // Calculate visible page numbers
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

  // Adjust if we're near the end
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1)
  }

  const pages = []

  // Add first page and ellipsis if needed
  if (startPage > 1) {
    pages.push(1)
    if (startPage > 2) {
      pages.push("ellipsis-start")
    }
  }

  // Add visible pages
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  // Add ellipsis and last page if needed
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      pages.push("ellipsis-end")
    }
    pages.push(totalPages)
  }

  return (
    <div className={`flex items-center justify-center space-x-2 ${className}`}>
      <Button
        variant="outline"
        size="icon"
        onClick={handlePrevious}
        disabled={currentPage === 1}
        aria-label={t("pagination.previous")}
        className="dark:border-slate-600 dark:bg-slate-800 dark:text-indigo-300 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-200 dark:hover:border-indigo-500/50 transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {pages.map((page, index) => {
        if (page === "ellipsis-start" || page === "ellipsis-end") {
          return (
            <span key={`ellipsis-${index}`} className="px-2 dark:text-indigo-300">
              ...
            </span>
          )
        }

        return (
          <Button
            key={`page-${page}`}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(page as number)}
            className={`min-w-[32px] ${
              currentPage === page
                ? "dark:bg-gradient-to-r dark:from-indigo-600 dark:to-indigo-500 dark:hover:from-indigo-500 dark:hover:to-indigo-400 dark:text-white"
                : "dark:border-slate-600 dark:bg-slate-800 dark:text-indigo-300 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-200 dark:hover:border-indigo-500/50"
            } transition-colors`}
          >
            {page}
          </Button>
        )
      })}

      <Button
        variant="outline"
        size="icon"
        onClick={handleNext}
        disabled={currentPage === totalPages}
        aria-label={t("pagination.next")}
        className="dark:border-slate-600 dark:bg-slate-800 dark:text-indigo-300 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-200 dark:hover:border-indigo-500/50 transition-colors"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
