"use client"

import { useEffect, useState } from "react"
import { Calendar } from "@/components/dashboard/calendar"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { RolesChart } from "@/components/dashboard/roles-chart"
import { JobDistribution } from "@/components/dashboard/job-distribution"
// Removed ExtractedSection import
import { useLanguage } from "@/lib/i18n/context"
import SuggestedSection from "@/components/dashboard/suggested-section"
import { SuggestedRoleSection } from "@/components/dashboard/suggested-role-section"

export default function DashboardPage() {
  // Add a fallback for translations in case the context isn't immediately available
  const [translations, setTranslations] = useState({
    "dashboard.jobsDeadlines": "Job Deadlines",
    "dashboard.extractedInformation": "Extracted Information",
  })

  // Thêm đoạn code để lấy cvId từ URL query params
  // Tìm phần khai báo các state và thêm:
  const searchParams = new URLSearchParams(window.location.search)
  const selectedCVId = searchParams.get("cvId")

  // Try to get the language context
  const languageContext = useLanguage()

  // Update translations when language context becomes available
  useEffect(() => {
    if (languageContext) {
      setTranslations({
        "dashboard.jobsDeadlines": languageContext.t("dashboard.jobsDeadlines"),
        "dashboard.extractedInformation": languageContext.t("dashboard.extractedInformation"),
      })
    }
  }, [languageContext])

  return (
    <div className="space-y-6 p-6">
      <StatsCards />

      {/* Updated grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/10 p-6">
            <h2 className="text-lg font-semibold mb-4 dark:text-white">{translations["dashboard.jobsDeadlines"]}</h2>
            <Calendar />
          </div>
          {/* Removed ExtractedSection component */}
          <SuggestedSection selectedCVId={selectedCVId || undefined} />
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/10 p-6">
            <RolesChart />
          </div>
          <SuggestedRoleSection selectedCVId={selectedCVId || undefined} />

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/10 p-6">
            <JobDistribution />
          </div>
        </div>
      </div>
    </div>
  )
}
