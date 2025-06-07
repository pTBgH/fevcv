"use client"

import { Heart, Bookmark, EyeOff, RefreshCcw } from "lucide-react"
import { cn } from "@/lib/utils"

interface JobCardActionsProps {
  isFavorite: boolean
  isArchived: boolean
  isHovered: boolean
  isInBin: boolean
  handleToggleFavorite: () => void
  handleToggleArchived: () => void
  handleHideClick: () => void
  handleRestoreClick: () => void
}

export function JobCardActions({
  isFavorite,
  isArchived,
  isHovered,
  isInBin,
  handleToggleFavorite,
  handleToggleArchived,
  handleHideClick,
  handleRestoreClick,
}: JobCardActionsProps) {
  console.log("JobCardActions rendering with:", { isFavorite, isArchived })

  if (isInBin) {
    // Restore button for items in bin
    return (
      <div className="absolute -top-1.5 -right-1.5 z-20">
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            handleRestoreClick()
          }}
          className="flex items-center gap-2 bg-[#F0F0F0] text-black px-4 py-2 rounded-tr-xl rounded-bl-xl hover:bg-gray-300 transition-colors"
          aria-label="Restore job"
        >
          <span>restore</span>
          <RefreshCcw className="h-5 w-5" />
        </button>
      </div>
    )
  }

  // Normal action buttons
  return (
    <div className="absolute -top-1.5 -right-1.5 z-20 flex space-x-1 bg-[#F0F0F0] p-1.5 rounded-tr-xl rounded-bl-xl">
      <button
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          console.log("Favorite button clicked, current state:", isFavorite)
          handleToggleFavorite()
        }}
        className={cn(
          "p-2 bg-black hover:bg-gray-700 rounded-lg text-white transition-colors duration-200",
          isFavorite && "text-red-500",
        )}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        <Heart className="h-5 w-5" fill={isFavorite ? "currentColor" : "none"} />
      </button>
      <button
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          console.log("Archive button clicked, current state:", isArchived)
          handleToggleArchived()
        }}
        className={cn(
          "p-2 bg-black hover:bg-gray-700 rounded-lg text-white transition-colors duration-200",
          isArchived && "text-yellow-500",
        )}
        aria-label={isArchived ? "Unarchive" : "Archive"}
      >
        <Bookmark className="h-5 w-5" fill={isArchived ? "currentColor" : "none"} />
      </button>
      {isHovered && (
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            handleHideClick()
          }}
          className="p-2 bg-black hover:bg-gray-700 rounded-lg text-white transition-colors duration-200"
          aria-label="Hide job"
        >
          <EyeOff className="h-5 w-5" />
        </button>
      )}
    </div>
  )
}
