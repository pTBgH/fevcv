"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/lib/i18n/context"
import type { Resume } from "@/lib/types"

interface ResumeViewerProps {
  resume: Resume
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ResumeViewer({ resume, open, onOpenChange }: ResumeViewerProps) {
  const { t } = useLanguage()
  const [isFullscreen, setIsFullscreen] = useState(false)

  if (!open) return null

  const handleClose = () => {
    onOpenChange(false)
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  return (
    <div
      className={`${isFullscreen ? "fixed inset-0 z-50 bg-gradient-to-br from-slate-900 to-slate-800 backdrop-blur-sm" : ""}`}
    >
      <Card
        className={`${isFullscreen ? "h-full dark:bg-transparent border-0" : "dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-700 dark:border-slate-600 dark:shadow-xl dark:shadow-purple-900/30"}`}
      >
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold dark:text-white dark:drop-shadow-sm">{resume.title}</h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleFullscreen}
                className="dark:border-indigo-500/50 dark:text-indigo-300 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-200 transition-colors"
              >
                {isFullscreen ? t("common.exitFullscreen") : t("common.fullscreen")}
              </Button>
              {!isFullscreen && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClose}
                  className="dark:border-indigo-500/50 dark:text-indigo-300 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-200 transition-colors"
                >
                  {t("common.close")}
                </Button>
              )}
            </div>
          </div>

          <div className={`relative ${isFullscreen ? "h-[calc(100vh-120px)]" : "h-[600px]"}`}>
            <div className="absolute inset-0 rounded-md overflow-hidden bg-gradient-to-br from-indigo-900/20 to-slate-800 p-1">
              <Image
                src={resume.fileUrl || "/placeholder.svg?height=600&width=400"}
                alt={resume.title}
                fill
                className="object-contain dark:bg-slate-800 rounded-md"
                priority
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
export default ResumeViewer
