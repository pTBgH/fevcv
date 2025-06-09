import type React from "react"
import { forwardRef, useState } from "react"
import { Heart, SquareArrowOutUpRight, Edit } from "lucide-react"
import type { Resume } from "@/lib/types"
import { useAppDispatch } from "@/lib/redux/hooks"
import { toggleFavorite } from "@/lib/redux/slices/resumeSlice"
import ExternalSquareArrow from '@/components/icons/SquareArrowOutSharp';

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
        className="relative border rounded-lg cursor-pointer transition-colors p-3 group bg-brand-background text-black border border-black hover:bg-gray-100"
        onClick={onSelect}
      >
        {/* External link icon ở góc trên bên phải */}
      <button
        className="absolute -top-1 -right-1 "
        onClick={(e) => {
          e.stopPropagation();
          window.open(cv.fileUrl, "_blank");
        }}
      >
        <ExternalSquareArrow className="w-4 h-4 text-black bg-brand-background" />
      </button>


      <div className="pt-1">
        <div className="flex items-center">
          <button 
            className="mr-2 p-1 rounded-md hover:bg-gray-200"
            onClick={handleEditClick}
          >
            <Edit className="h-4 w-4" />
          </button>
          {isEditing ? (
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleSaveEdit}
              onKeyPress={(e) => e.key === "Enter" && handleSaveEdit()}
              className="flex-1 truncate border-b-2 bg-transparent focus:outline-none focus:border-black text-inherit"
              autoFocus
            />
          ) : (
            <span className="flex-1 truncate font-medium">{title}</span>
          )}
          <button className="ml-2 p-1 rounded-md hover:bg-gray-200" onClick={handleToggleFavorite}>
            <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
          </button>
        </div>
      </div>
    </div>
  );
})

CVCard.displayName = "CVCard"

export default CVCard