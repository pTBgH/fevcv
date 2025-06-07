"use client"

import { JobCard } from "@/components/job/job-card"
import type { Job } from "@/lib/types"

interface SuggestedJobCardProps {
  job: Job
  onApply?: (id: number | string) => void
}

export function SuggestedJobCard({ job, onApply }: SuggestedJobCardProps) {
  const handleApply = () => {
    if (onApply) onApply(job.id)
  }

  return (
    <div className="relative">
      <JobCard job={job} onFavorite={() => {}} onArchive={() => {}} onHide={() => {}} />
      <div className="mt-2 flex justify-end">
        <button
          onClick={handleApply}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          Apply Now
        </button>
      </div>
    </div>
  )
}

export default SuggestedJobCard
