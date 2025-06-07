"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { ChatBot } from "@/components/common/chat-bot"
import { useLanguage } from "@/lib/i18n/context"

const topics = [
  { id: "feedback", label: "Feedback" },
  { id: "privacy", label: "Privacy" },
  { id: "page-errors", label: "Page Errors" },
  { id: "other", label: "Other" },
]

export default function ContactPage() {
  const [selectedTopic, setSelectedTopic] = useState<string>()
  const { t } = useLanguage()

  // Translate topics based on current language
  const getTopicLabel = (id: string) => {
    switch (id) {
      case "feedback":
        return t("contact.feedback")
      case "privacy":
        return t("contact.privacy")
      case "page-errors":
        return t("contact.pageErrors")
      case "other":
        return t("contact.other")
      default:
        return id
    }
  }

  return (
    <div className="container max-w-3xl mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">
          {t("contact.contactForm")} <span className="text-indigo-600">Form</span>
        </h1>
        <Link href="/" className="text-sm text-indigo-600 hover:text-indigo-700">
          {t("common.backToHomepage")}
        </Link>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Topic Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("contact.selectATopic")}</label>
              <div className="flex flex-wrap gap-2">
                {topics.map((topic) => (
                  <Button
                    key={topic.id}
                    variant={selectedTopic === topic.id ? "default" : "outline"}
                    className={selectedTopic === topic.id ? "bg-indigo-600 hover:bg-indigo-700" : ""}
                    onClick={() => setSelectedTopic(topic.id)}
                  >
                    {getTopicLabel(topic.id)}
                  </Button>
                ))}
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("contact.email")}</label>
                <Input type="email" className="bg-gray-50" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("contact.name")}</label>
                <Input className="bg-gray-50" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t("contact.message")}</label>
              <Textarea className="min-h-[150px] bg-gray-50" placeholder={t("contact.typeYourMessageHere")} />
            </div>

            <div className="flex justify-end">
              <Button className="bg-indigo-600 hover:bg-indigo-700">{t("contact.sendMessage")}</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">
          {t("contact.contactInformation")} <span className="text-indigo-600">Information</span>
        </h2>
        <p className="text-gray-600">abc city 123 stress</p>
      </div>

      {/* Chat Bot */}
      <ChatBot />
    </div>
  )
}
