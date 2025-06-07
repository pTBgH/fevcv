"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/lib/i18n/context"

interface ExtractedSectionProps {
  title: string
  content: string
}

export function ExtractedSection({ title, content }: ExtractedSectionProps) {
  const { t } = useLanguage()

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        <Button variant="outline" size="sm">
          {t("dashboard.edit")}
        </Button>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500">{content}</p>
      </CardContent>
    </Card>
  )
}
