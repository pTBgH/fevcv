"use client"

import { CVCard } from "@/components/resume/cv-card"
import type { Resume } from "@/lib/types"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { toggleFavorite } from "@/lib/redux/slices/resumeSlice"

interface ResumeCardProps {
  resume: Resume
  context: "resumes" | "bin" | "favorites"
  onSelect?: () => void
  isSelected?: boolean
}

export function ResumeCard({ resume, context, onSelect, isSelected = false }: ResumeCardProps) {
  const dispatch = useAppDispatch()
  const favorites = useAppSelector((state) => state.resumes.favorites)
  const isFavorite = favorites.includes(resume.id)

  const handleToggleFavorite = () => {
    dispatch(toggleFavorite(resume.id))
  }

  return (
    <CVCard
      cv={resume}
      isSelected={isSelected}
      onSelect={onSelect || (() => {})}
      onToggleFavorite={handleToggleFavorite}
      isFavorite={isFavorite}
    />
  )
}
