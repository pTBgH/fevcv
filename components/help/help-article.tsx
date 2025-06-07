"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/lib/i18n/context"

interface HelpArticleProps {
  title: string
  content: string
}

export function HelpArticle({ title, content }: HelpArticleProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [wasHelpful, setWasHelpful] = useState<boolean | null>(null)
  const { t } = useLanguage()

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
          <h3 className="font-medium">{title}</h3>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>
        </div>

        {isExpanded && (
          <>
            <p className="mt-4 text-sm text-gray-600 whitespace-pre-line">{content}</p>

            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2">{t("help.wasThisArticleHelpful")}</p>
              <div className="flex gap-2">
                <Button
                  variant={wasHelpful === true ? "default" : "outline"}
                  size="sm"
                  onClick={() => setWasHelpful(true)}
                >
                  {t("common.yes")}
                </Button>
                <Button
                  variant={wasHelpful === false ? "default" : "outline"}
                  size="sm"
                  onClick={() => setWasHelpful(false)}
                >
                  {t("common.no")}
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
