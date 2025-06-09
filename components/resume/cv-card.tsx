import type React from "react"
import { forwardRef, useState } from "react"
import { Heart, ExternalLink, Edit } from "lucide-react"
import type { Resume } from "@/lib/types"
import { useAppDispatch } from "@/lib/redux/hooks"
import { toggleFavorite } from "@/lib/redux/slices/resumeSlice"

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
    const [isEditing, setIsEditing] = useState(false)
    const [title, setTitle] = useState(cv.title)

    const handleToggleFavorite = (e: React.MouseEvent) => {
      e.stopPropagation()
      if (onToggleFavorite) {
        onToggleFavorite(cv.id)
      } else {
        dispatch(toggleFavorite(cv.id))
      }
    }

    const handleViewClick = (e: React.MouseEvent) => {
      e.stopPropagation()
      if (cv.fileUrl) {
        window.open(cv.fileUrl, "_blank")
      }
    }

    const handleEditClick = (e: React.MouseEvent) => {
      e.stopPropagation()
      setIsEditing(true)
    }

    const handleSaveEdit = () => {
      // Logic to save the edited title can be added here
      setIsEditing(false)
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
            <button className="mr-2 p-1 hover:bg-gray-200 hover:text-black rounded" onClick={handleEditClick}>
              <Edit className="h-4 w-4" />
            </button>
            {isEditing ? (
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleSaveEdit}
                onKeyPress={(e) => e.key === "Enter" && handleSaveEdit()}
                className="flex-1 truncate border-b-2 bg-transparent focus:outline-none"
                autoFocus
              />
            ) : (
              <span className="flex-1 truncate">{title}</span>
            )}
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