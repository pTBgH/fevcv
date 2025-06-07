"use client"

import { useLanguage } from "@/lib/i18n/context"
import { getResumeById } from "@/lib/cv-service"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface ExtractedData {
  degree: string
  technicalSkills: string
  softSkills: string
  experience: string
}

interface ExtractedZoneProps {
  cvId: string
  customData?: ExtractedData
  isEditing?: boolean
  onDataChange?: (field: string, value: string) => void
  onEditClick?: () => void
}

export function ExtractedZone({ cvId, customData, isEditing = false, onDataChange, onEditClick }: ExtractedZoneProps) {
  // Use customData if provided, otherwise get from service
  const resumeData = customData ||
    getResumeById(cvId)?.data || {
      degree: "",
      technicalSkills: "",
      softSkills: "",
      experience: "",
    }

  const { t } = useLanguage()

  const handleContentChange = (field: string, value: string) => {
    onDataChange?.(field, value)
  }

  // Check if data is empty
  const isDataEmpty =
    !resumeData.degree && !resumeData.technicalSkills && !resumeData.softSkills && !resumeData.experience

  if (isDataEmpty) {
    return (
      <Alert
        variant="warning"
        className="mb-4 dark:bg-gradient-to-r dark:from-amber-900/30 dark:to-amber-800/20 dark:text-amber-200 dark:border-amber-700 dark:shadow-lg dark:shadow-amber-900/20"
      >
        <AlertCircle className="h-4 w-4 mr-2" />
        <AlertDescription>{t("resume.noExtractedData")}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <ExtractedField
        title="Degree"
        content={resumeData.degree || ""}
        isEditing={isEditing}
        onContentChange={(value) => handleContentChange("degree", value)}
      />
      <ExtractedField
        title="Technical Skills"
        content={resumeData.technicalSkills || ""}
        isEditing={isEditing}
        onContentChange={(value) => handleContentChange("technicalSkills", value)}
      />
      <ExtractedField
        title="Soft Skills"
        content={resumeData.softSkills || ""}
        isEditing={isEditing}
        onContentChange={(value) => handleContentChange("softSkills", value)}
      />
      <ExtractedField
        title="Experience"
        content={resumeData.experience || ""}
        isEditing={isEditing}
        onContentChange={(value) => handleContentChange("experience", value)}
      />
    </div>
  )
}

function ExtractedField({
  title,
  content,
  isEditing,
  onContentChange,
}: {
  title: string
  content: string
  isEditing: boolean
  onContentChange: (value: string) => void
}) {
  return (
    <div className="bg-white rounded-lg p-4 h-full">
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      {isEditing ? (
        <textarea
          className="w-full h-32 p-2 border border-gray-300 rounded-md bg-white text-gray-800"
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
        />
      ) : (
        <div className="text-gray-600 whitespace-pre-wrap min-h-[100px]">{content || "—"}</div>
      )}
    </div>
  )
}

export default ExtractedZone
