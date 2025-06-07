"use client"

import { RefreshCcw } from "lucide-react"
import { useLanguage } from "@/lib/i18n/context"

interface JobCardTemporaryStateProps {
  type: "hidden" | "unfavorited" | "unarchived"
  onRestore: () => void
}

export function JobCardTemporaryState({ type, onRestore }: JobCardTemporaryStateProps) {
  const { t } = useLanguage()

  const messages = {
    hidden: t("job.temporaryHidden"),
    unfavorited: t("job.temporaryUnfavorited"),
    unarchived: t("job.temporaryUnarchived"),
  }

  return (
    <div className="w-full rounded-xl shadow-md overflow-hidden relative bg-[#F0F0F0]">
      <div className="bg-black p-5 text-white rounded-t-xl">
        <p className="text-center py-4">{messages[type]}</p>
      </div>
      <div className="bg-white p-3 flex justify-center items-center rounded-b-xl">
        <button
          onClick={onRestore}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
        >
          <RefreshCcw className="h-4 w-4" />
          <span>{t("dashboard.undo")}</span>
        </button>
      </div>
    </div>
  )
}
