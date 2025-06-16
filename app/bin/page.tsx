"use client"
import React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { DeletedResumes } from "@/components/resume/deleted-resumes"
import { HiddenJobs } from "@/components/job/hidden-jobs"
import { useLanguage } from "@/lib/i18n/context"
import { MinimalNav } from "@/components/home/minimal-nav"

export default function BinPage() {
  const { t } = useLanguage()

  return (
    <div className="space-y-6">
      <MinimalNav />
      <h1 className="text-2xl font-bold">{t("dashboard.bin")}</h1>
      <Tabs defaultValue="resumes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="resumes">{t("dashboard.deletedResumes")}</TabsTrigger>
          <TabsTrigger value="jobs">{t("dashboard.hiddenJobs")}</TabsTrigger>
        </TabsList>

        <TabsContent value="resumes">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <p className="text-sm text-yellow-700">{t("dashboard.permanentlyDeleted")}</p>
          </div>
          {/* <DeletedResumes /> */}
        </TabsContent>

        <TabsContent value="jobs">
          <HiddenJobs />
        </TabsContent>
      </Tabs>
    </div>
  )
}
