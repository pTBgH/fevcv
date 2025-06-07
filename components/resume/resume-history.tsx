"use client"

import type React from "react"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { useLanguage } from "@/lib/i18n/context"
import { getResumeHistory, searchResumeHistory, formatHistoryDate } from "@/lib/history-service"
import type { ResumeHistoryItem } from "@/lib/history-service"

export function ResumeHistory() {
  const [searchQuery, setSearchQuery] = useState("")
  const [resumeHistory, setResumeHistory] = useState<ResumeHistoryItem[]>(getResumeHistory())
  const { t } = useLanguage()

  const handleSearch = () => {
    const results = searchResumeHistory(searchQuery)
    setResumeHistory(results)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder={t("dashboard.resumes")}
          className="flex-grow"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button type="submit" onClick={handleSearch}>
          <Search className="h-4 w-4 mr-2" />
          {t("common.search")}
        </Button>
      </div>

      {resumeHistory.length === 0 ? (
        <div className="text-center py-8 border rounded-md">
          <p className="text-gray-500">{t("common.noResults")}</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("dashboard.date")}</TableHead>
              <TableHead>{t("dashboard.time")}</TableHead>
              <TableHead>{t("dashboard.action")}</TableHead>
              <TableHead>{t("dashboard.resumes")}</TableHead>
              <TableHead>{t("dashboard.link")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {resumeHistory.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{formatHistoryDate(item.date)}</TableCell>
                <TableCell>{item.time}</TableCell>
                <TableCell>{item.action}</TableCell>
                <TableCell>{item.resume}</TableCell>
                <TableCell>
                  <a href={item.link} className="text-blue-600 hover:underline">
                    {t("dashboard.view")}
                  </a>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
