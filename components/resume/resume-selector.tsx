"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Heart } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useLanguage } from "@/lib/i18n/context"
import { getActiveResumes, toggleFavorite } from "@/lib/cv-service"
import type { Resume } from "@/lib/types"
import { useAuth } from "@/hooks/use-auth"
import { LoginPrompt } from "@/components/auth/login-prompt"

interface ResumeSelectorProps {
  mode?: "search" | "suggest"
  onSelect?: (id: string | null) => void
  selectedId?: string | null
  selectedDate?: string
}

export function ResumeSelector({
  mode: initialMode = "search",
  onSelect,
  selectedId,
  selectedDate,
}: ResumeSelectorProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [mode, setMode] = useState(initialMode)
  const [showDropdown, setShowDropdown] = useState(false)
  const [resumes, setResumes] = useState<Resume[]>([])
  const [favorites, setFavorites] = useState<Record<string, boolean>>({})
  const [currentDate, setCurrentDate] = useState(selectedDate)
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null)
  const [loginPromptOpen, setLoginPromptOpen] = useState(false)
  const { t } = useLanguage()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    // Get active resumes
    const activeResumes = getActiveResumes()
    setResumes(activeResumes)

    // Initialize favorite states
    const favoritesMap: Record<string, boolean> = {}
    activeResumes.forEach((resume) => {
      favoritesMap[resume.id] = resume.isFavorite
    })
    setFavorites(favoritesMap)

    // Set selected resume if ID is provided
    if (selectedId) {
      const selected = activeResumes.find((r) => r.id === selectedId)
      if (selected) {
        setSelectedResume(selected)
      }
    }
  }, [selectedId])

  useEffect(() => {
    if (selectedId && selectedDate) {
      setMode("suggest")
      setCurrentDate(selectedDate)
    }
  }, [selectedId, selectedDate])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()

    if (!isAuthenticated) {
      e.preventDefault()
      setLoginPromptOpen(true)
      return
    }

    // Update favorite state in UI
    setFavorites((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))

    // In a real app, you would call an API to update the state
    const updatedResume = toggleFavorite(id)
    if (updatedResume) {
      setResumes((prevResumes) => prevResumes.map((resume) => (resume.id === id ? updatedResume : resume)))
    }
  }

  const handleToggleDropdown = () => {
    if (!isAuthenticated) {
      setLoginPromptOpen(true)
      return
    }

    setShowDropdown(!showDropdown)
  }

  const handleSelectCV = (resume: Resume) => {
    if (!isAuthenticated) {
      setLoginPromptOpen(true)
      return
    }

    setSelectedResume(resume)
    onSelect?.(resume.id)
    setMode("suggest")
    setCurrentDate(resume.title)
    setShowDropdown(false)

    // Navigate to suggest mode
    router.push(`/search?mode=suggest&cvId=${resume.id}&cvDate=${encodeURIComponent(resume.title)}`)
  }

  const handleUploadNew = () => {
    if (!isAuthenticated) {
      const returnUrl = encodeURIComponent(pathname)
      router.push(`/auth?redirect=${returnUrl}`)
      return
    }

    router.push("/upload")
  }

  const closeLoginPrompt = () => {
    setLoginPromptOpen(false)
  }

  const handleLoginRedirect = () => {
    const returnUrl = encodeURIComponent(pathname)
    router.push(`/auth?redirect=${returnUrl}`)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex items-center gap-2">
        <div className="text-gray-700 dark:text-gray-200 font-medium whitespace-nowrap">
          {t("common.optimizeForResume")}:
        </div>

        {selectedResume ? (
          <button
            onClick={handleToggleDropdown}
            className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 px-4 py-2 rounded-md text-gray-800 dark:text-white transition-colors"
          >
            {selectedResume.title}
          </button>
        ) : (
          <button
            onClick={handleToggleDropdown}
            className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 px-4 py-2 rounded-md text-gray-800 dark:text-white transition-colors"
          >
            {t("resume.selectResume")}
          </button>
        )}
      </div>

      {showDropdown && (
        <div className="absolute z-50 mt-1 w-full max-w-md bg-white dark:bg-gray-800 rounded-md shadow-lg overflow-hidden">
          {resumes.length > 0 && (
            <div className="max-h-80 overflow-y-auto">
              {/* Selected resume highlighted at top */}
              {selectedResume && (
                <div
                  className="flex items-center justify-between p-3 bg-black text-white cursor-pointer"
                  onClick={() => handleSelectCV(selectedResume)}
                >
                  <span>{selectedResume.title}</span>
                  <Heart
                    className={cn(
                      "h-5 w-5 cursor-pointer",
                      favorites[selectedResume.id] ? "fill-red-500 text-red-500" : "text-gray-300",
                    )}
                    onClick={(e) => handleFavorite(selectedResume.id, e)}
                  />
                </div>
              )}

              {/* List of all resumes */}
              {resumes.map((resume) => (
                <div
                  key={resume.id}
                  className={cn(
                    "flex items-center justify-between p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-t border-gray-200 dark:border-gray-700",
                    selectedResume?.id === resume.id ? "bg-gray-100 dark:bg-gray-700" : "",
                  )}
                  onClick={() => handleSelectCV(resume)}
                >
                  <span className="text-gray-800 dark:text-white">{resume.title}</span>
                  <Heart
                    className={cn(
                      "h-5 w-5 cursor-pointer",
                      favorites[resume.id] ? "fill-red-500 text-red-500" : "text-gray-300",
                    )}
                    onClick={(e) => handleFavorite(resume.id, e)}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Upload new CV link */}
          <div className="p-3 text-center border-t border-gray-200 dark:border-gray-700">
            <Link
              href="#"
              className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
              onClick={(e) => {
                e.preventDefault()
                handleUploadNew()
              }}
            >
              {t("resume.uploadNewCv")}
            </Link>
          </div>
        </div>
      )}

      {/* Login Prompt */}
      <LoginPrompt isOpen={loginPromptOpen} onClose={closeLoginPrompt} featureName={t("resume.optimizeSearch")} />
    </div>
  )
}
