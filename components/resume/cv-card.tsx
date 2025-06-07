"use client"

import type React from "react"
import { forwardRef } from "react"
import { Heart, ExternalLink } from "lucide-react"
import type { Resume } from "@/lib/types"
import { useAppDispatch } from "@/lib/redux/hooks"
import { toggleFavorite as toggleFavoriteAction } from "@/lib/redux/slices/resumeSlice"

interface CVCardProps {
  cv: Resume
  isSelected: boolean
  onSelect: () => void
  onToggleFavorite?: (id: string) => void
  isFavorite?: boolean
}

export const CVCard = forwardRef<HTMLDivElement, CVCardProps>(
  ({ cv, isSelected, onSelect, onToggleFavorite, isFavorite = false }, ref) => {
    const dispatch = useAppDispatch()

    const handleToggleFavorite = (e: React.MouseEvent) => {
      e.stopPropagation()
      if (onToggleFavorite) {
        onToggleFavorite(cv.id)
      } else {
        // Use Redux action if no callback provided
        dispatch(toggleFavoriteAction(cv.id))
      }
    }

    const handleViewClick = (e: React.MouseEvent) => {
      e.stopPropagation()
      if (cv.fileUrl) {
        window.open(cv.fileUrl, "_blank")
      }
    }

    return (
      <div
        ref={ref}
        className={`relative border rounded-lg cursor-pointer transition-colors ${
          isSelected ? "bg-black text-white" : "bg-white hover:border-gray-300"
        }`}
        onClick={onSelect}
      >
        <button
          className="absolute top-2 right-2 p-1 hover:bg-gray-200 hover:text-black rounded"
          onClick={handleViewClick}
        >
          <ExternalLink className="h-4 w-4" />
        </button>

        <div className="p-3">
          <div className="flex items-center">
            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M10 9H9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="flex-1 truncate">{cv.title}</span>
            <button className="ml-2 p-1 hover:bg-gray-200 hover:text-black rounded" onClick={handleToggleFavorite}>
              <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
            </button>
          </div>
        </div>
      </div>
    )
  },
)

CVCard.displayName = "CVCard"

export default CVCard
