"use client"

import Link from "next/link"
import { Upload, Heart, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/i18n/context"
import type { Resume } from "@/lib/types"

interface CVHeaderProps {
  showFavorites: boolean
  canGoPrev: boolean
  canGoNext: boolean
  isEditing: boolean
  selectedCVId: string
  selectedCV?: Resume
  onToggleFavorites: () => void
  onPrev: () => void
  onNext: () => void
  onEdit: () => void
  onDiscard: () => void
  onAccept: () => void
}

export default function CVHeader({
  showFavorites,
  canGoPrev,
  canGoNext,
  isEditing,
  selectedCVId,
  selectedCV,
  onToggleFavorites,
  onPrev,
  onNext,
  onEdit,
  onDiscard,
  onAccept,
}: CVHeaderProps) {
  const { t } = useLanguage()

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <h2 className="text-3xl font-bold">{t("dashboard.resumes")}</h2>
        <div className="flex items-center gap-1">
          <Link href="/upload">
            <Button variant="ghost" size="icon" className="h-9 w-9 bg-indigo-600 text-white hover:bg-indigo-700">
              <Upload className="h-5 w-5" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className={`h-9 w-9 ${showFavorites ? "text-indigo-600" : ""}`}
            onClick={onToggleFavorites}
          >
            <Heart className="h-5 w-5" fill={showFavorites ? "currentColor" : "none"} />
          </Button>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-9 w-9" disabled={!canGoPrev} onClick={onPrev}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9" disabled={!canGoNext} onClick={onNext}>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        {isEditing ? (
          <>
            <Button variant="outline" onClick={onDiscard}>
              {t("dashboard.discard")}
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={onAccept}>
              {t("dashboard.accept")}
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" onClick={onEdit}>
              {t("dashboard.edit")}
            </Button>
            <Button
              className="bg-indigo-600 hover:bg-indigo-700"
              onClick={() => {
                if (selectedCVId) {
                  window.location.href = `/search?mode=suggest&cvId=${selectedCVId}&cvDate=${encodeURIComponent(selectedCV?.title || "")}`
                }
              }}
            >
              {t("dashboard.suggest")}
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
