"use client"

import { useState } from "react"
import { ResumeCard } from "@/components/resume/resume-card"
import { Pagination } from "@/components/common/pagination"
import type { Resume } from "@/lib/types"
import { useLanguage } from "@/lib/i18n/context"

interface ResumeGridProps {
  resumes: Resume[]
  isLoading: boolean
  emptyMessage: string
  context?: "resumes" | "bin" | "favorites"
  onSelectResume?: (id: string) => void
  selectedResumeId?: string | null
}

export function ResumeGrid({
  resumes,
  isLoading,
  emptyMessage,
  context = "resumes",
  onSelectResume,
  selectedResumeId,
}: ResumeGridProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const { t } = useLanguage()
  const itemsPerPage = 5

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-[80px] rounded-lg border border-gray-200 bg-gray-100 p-4 animate-pulse" />
        ))}
      </div>
    )
  }

  if (!resumes || resumes.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    )
  }

  // Pagination logic
  const totalPages = Math.ceil(resumes.length / itemsPerPage)
  const paginatedResumes = resumes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {paginatedResumes.map((resume) => (
          <ResumeCard
            key={resume.id}
            resume={resume}
            context={context}
            onSelect={() => onSelectResume && onSelectResume(resume.id)}
            isSelected={selectedResumeId === resume.id}
          />
        ))}
      </div>

      {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />}
    </div>
  )
}
