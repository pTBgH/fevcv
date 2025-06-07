"use client"

import { useState, useEffect, useCallback } from "react"
import type { Resume } from "@/lib/types"
import CVCard from "@/components/resume/cv-card"
import CVHeader from "@/components/resume/cv-header"
import ExtractedZone from "@/components/resume/extracted-zone"
import { useLanguage } from "@/lib/i18n/context"
// Replace toast with addToast from useToast
import { useToast } from "@/hooks/use-toast"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import {
  selectActiveResumes,
  selectSelectedResumeId,
  setSelectedResume,
  toggleFavorite,
  updateResume,
} from "@/lib/redux/slices/resumeSlice"

interface CVMngtSectionProps {
  onCVSelect?: (cvId: string) => void
  cvId?: string
  resume?: Resume
}

export function CVMngtSection({ onCVSelect, cvId, resume }: CVMngtSectionProps) {
  const { t } = useLanguage()
  // Changed destructuring: use addToast instead of toast
  const { addToast } = useToast()
  const dispatch = useAppDispatch()

  // Get resumes from Redux store
  const resumes = useAppSelector(selectActiveResumes)
  const selectedCVId = useAppSelector(selectSelectedResumeId) || cvId || ""

  const [showFavorites, setShowFavorites] = useState(false)
  const [startIndex, setStartIndex] = useState(0)
  const [isEditing, setIsEditing] = useState(false)
  const [editedData, setEditedData] = useState({
    degree: "",
    technicalSkills: "",
    softSkills: "",
    experience: "",
  })

  // Initialize edited data when selected resume changes
  useEffect(() => {
    const selectedResume = resumes.find((r) => r.id === selectedCVId)
    if (selectedResume?.data) {
      setEditedData(selectedResume.data)
    }
  }, [selectedCVId, resumes])

  // Set initial selected CV
  useEffect(() => {
    if (cvId) {
      dispatch(setSelectedResume(cvId))
    } else if (resumes.length > 0 && !selectedCVId) {
      dispatch(setSelectedResume(resumes[0].id))
      // Notify parent component if needed
      if (onCVSelect) {
        onCVSelect(resumes[0].id)
      }
    }
  }, [dispatch, cvId, resumes, selectedCVId, onCVSelect])

  // Filter resumes based on favorites toggle
  const filteredCVs = showFavorites ? resumes.filter((cv) => cv.isFavorite) : resumes

  // Calculate visible CVs and navigation state
  const visibleCVs = filteredCVs.slice(startIndex, startIndex + 3)
  const canGoNext = startIndex + 3 < filteredCVs.length
  const canGoPrev = startIndex > 0

  // Navigation handlers
  const handlePrev = useCallback(() => {
    if (canGoPrev) {
      setStartIndex((prevIndex) => prevIndex - 1)
    }
  }, [canGoPrev])

  const handleNext = useCallback(() => {
    if (canGoNext) {
      setStartIndex((prevIndex) => prevIndex + 1)
    }
  }, [canGoNext])

  // Toggle favorite handler
  const handleToggleFavorite = useCallback(
    (id: string) => {
      dispatch(toggleFavorite(id))

      // Show toast notification using addToast
      const isFavorite = resumes.find((r) => r.id === id)?.isFavorite
      addToast({
        title: isFavorite ? t("resume.removedFromFavorites") : t("resume.addedToFavorites"),
        type: isFavorite ? "info" : "success",
        duration: 3000,
      })
    },
    [dispatch, resumes, addToast, t],
  )

  // Select CV handler
  const handleSelectCV = useCallback(
    (id: string) => {
      dispatch(setSelectedResume(id))
      if (onCVSelect) {
        onCVSelect(id)
      }
    },
    [dispatch, onCVSelect],
  )

  // Edit handlers
  const handleEdit = useCallback(() => {
    setIsEditing(true)
  }, [])

  const handleDiscard = useCallback(() => {
    const selectedResume = resumes.find((r) => r.id === selectedCVId)
    if (selectedResume?.data) {
      setEditedData(selectedResume.data)
    }
    setIsEditing(false)
  }, [resumes, selectedCVId])

  const handleAccept = useCallback(() => {
    dispatch(
      updateResume({
        id: selectedCVId,
        data: { data: editedData },
      }),
    )
    addToast({
      title: t("resume.saveSuccess"),
      description: t("resume.saveSuccessDescription"),
      type: "success",
    })
    setIsEditing(false)
  }, [selectedCVId, editedData, dispatch, addToast, t])

  const handleDataChange = useCallback((field: string, value: string) => {
    setEditedData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }, [])

  // Other handlers with explicit event types
  const handleDelete = useCallback(
    (id: string) => {
      addToast({
        title: t("resume.deleteConfirmation"),
        description: t("resume.deleteConfirmationDescription"),
        type: "warning",
        action: {
          label: t("common.confirm"),
          onClick: () => {
            // Delete logic would go here using Redux
            addToast({
              title: t("resume.deleted"),
              type: "success",
            })
          },
        },
      })
    },
    [addToast, t],
  )

  const handleRename = useCallback(
    (id: string) => {
      addToast({
        title: t("resume.rename"),
        description: "Rename functionality would be implemented here",
        type: "info",
      })
    },
    [addToast, t],
  )

  const handleDuplicate = useCallback(
    (id: string) => {
      addToast({
        title: t("resume.duplicated"),
        description: t("resume.duplicatedDescription"),
        type: "success",
      })
    },
    [addToast, t],
  )

  // Get selected CV
  const selectedCV = resumes.find((cv) => cv.id === selectedCVId)

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <CVHeader
          showFavorites={showFavorites}
          canGoPrev={canGoPrev}
          canGoNext={canGoNext}
          isEditing={isEditing}
          selectedCVId={selectedCVId}
          selectedCV={selectedCV}
          onToggleFavorites={() => setShowFavorites((prev) => !prev)}
          onPrev={handlePrev}
          onNext={handleNext}
          onEdit={handleEdit}
          onDiscard={handleDiscard}
          onAccept={handleAccept}
        />

        <div className="grid grid-cols-3 gap-4">
          {visibleCVs.map((cv) => (
            <CVCard
              key={cv.id}
              cv={cv}
              isSelected={cv.id === selectedCVId}
              onSelect={() => handleSelectCV(cv.id)}
              // Removed menuContext prop, since it is not defined in CVCardProps
              onToggleFavorite={handleToggleFavorite}
              isFavorite={cv.isFavorite}
              onRenameClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                e.stopPropagation()
                handleRename(cv.id)
              }}
              onDuplicateClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                e.stopPropagation()
                handleDuplicate(cv.id)
              }}
              onDeleteClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                e.stopPropagation()
                handleDelete(cv.id)
              }}
            />
          ))}
        </div>
      </div>

      {selectedCV && (
        <ExtractedZone
          cvId={selectedCVId}
          customData={isEditing ? editedData : selectedCV.data}
          isEditing={isEditing}
          onDataChange={handleDataChange}
        />
      )}
    </div>
  )
}

export default CVMngtSection
