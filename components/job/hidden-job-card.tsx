"use client"

import { JobCard } from "@/components/job/job-card"
import type { Job } from "@/lib/types"
import { useReduxToast } from "@/hooks/use-redux-toast"
import { useLanguage } from "@/lib/i18n/context"

interface HiddenJobCardProps {
  job: Job
  onRestore: (id: number | string) => void
}

export function HiddenJobCard({ job, onRestore }: HiddenJobCardProps) {
  const { toast } = useReduxToast()
  const { t } = useLanguage()

  const handleRestore = () => {
    if (onRestore) {
      onRestore(job.id)

      // Show toast notification
      toast({
        title: t("toast.jobRestored"),
        type: "success",
        duration: 3000,
      })
    }
  }

  return (
    <div className="space-y-1 sm:space-y-2">
      <JobCard job={job} type="hidden" onFavorite={() => {}} onArchive={() => {}} onHide={handleRestore} />
    </div>
  )
}
