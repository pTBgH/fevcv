"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { JobHistory } from "@/components/job/job-history"
import { ResumeHistory } from "@/components/job/resume-history"
import { useLanguage } from "@/lib/i18n/context"

export default function HistoryPage() {
  const { t } = useLanguage()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t("dashboard.history")}</h1>
      <Tabs defaultValue="jobs">
        <TabsList>
          <TabsTrigger value="jobs">{t("job.jobDetails")}</TabsTrigger>
          <TabsTrigger value="resumes">{t("dashboard.resumes")}</TabsTrigger>
        </TabsList>
        <TabsContent value="jobs">
          <JobHistory />
        </TabsContent>
        <TabsContent value="resumes">
          <ResumeHistory />
        </TabsContent>
      </Tabs>
    </div>
  )
}
