"use client"

import { useState } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { HelpArticle } from "@/components/help/help-article"
import { Card } from "@/components/ui/card"
import { ChatBot } from "@/components/common/chat-bot"
import { useLanguage } from "@/lib/i18n/context"

const helpArticles = [
  {
    id: 1,
    title: "What is Our Applications?",
    content:
      "Our application is a way for you to find your most suitable jobs based on your skills, experience, and preferences. By uploading your CV, our system analyses your qualifications and matches you with job opportunities that best align with your profile. With smart recommendations and a user-friendly interface, we make job searching easier and more efficient for you.",
  },
  {
    id: 2,
    title: "How can I save a job I'm interested in?",
    content: `Note: You must have an account to save jobs
You can save a job in two ways:
• Click the heart icon (♡) to add it to your Favourite Jobs
• Click the archive icon (⊞) to move it to Archived Jobs
Both sections can be accessed from your Dashboard.`,
  },
  {
    id: 3,
    title: "How can I unhide a job?",
    content: `If you've hidden a job and want to restore it:
• Go to the Bin section in your Dashboard
• Find the job you want to unhide
• Click the restore icon (↺) to restore it
Once restored, the job will reappear in your search results or saved lists.`,
  },
]

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const { t } = useLanguage()

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            type="search"
            placeholder={t("help.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select defaultValue="relevant">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t("help.sortBy")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevant">{t("help.mostRelevant")}</SelectItem>
            <SelectItem value="recent">{t("help.mostRecent")}</SelectItem>
            <SelectItem value="viewed">{t("help.mostViewed")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <div className="col-span-1">
          <nav className="space-y-2">
            <Button variant="ghost" className="w-full justify-start">
              {t("help.gettingStarted")}
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              {t("help.myProfile")}
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              {t("help.uploadingResumes")}
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              {t("help.jobSearchTips")}
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              {t("help.jobAlerts")}
            </Button>
          </nav>

          <Card className="mt-8 p-6 bg-primary text-primary-foreground">
            <h3 className="font-semibold mb-2">{t("help.didntFindWhatYouWereLookingFor")}</h3>
            <p className="text-sm mb-4">{t("help.contactOurCustomerService")}</p>
            <Link href="/dashboard/contact">
              <Button variant="secondary" className="w-full">
                {t("help.contactUs")}
              </Button>
            </Link>
          </Card>
        </div>

        <div className="col-span-3 space-y-4">
          {helpArticles.map((article) => (
            <HelpArticle key={article.id} {...article} />
          ))}
        </div>
      </div>
      {/* Add ChatBot component */}
      <ChatBot />
    </div>
  )
}
