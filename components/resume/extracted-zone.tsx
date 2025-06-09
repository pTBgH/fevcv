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

export function ExtractedZone({
  cvId,
  customData,
  isEditing = false,
  onDataChange,
  onEditClick,
}: ExtractedZoneProps) {
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
        className="mb-4 bg-brand-cream text-black border border-brand-dark-gray"
      >
        <AlertCircle className="h-4 w-4 mr-2 text-brand-dark-gray" />
        <AlertDescription className="text-brand-dark-gray">{t("resume.noExtractedData")}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      {/* Phần thông tin cá nhân - giả định rằng nó được hiển thị ở đây hoặc sẽ được tạo */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-brand-cream">
        <h2 className="text-xl font-bold mb-4 text-black">Personal Information</h2>
        {/* Các trường thông tin cá nhân sẽ được thêm vào đây, ví dụ:
        <ExtractedField
          title="Name"
          content="Phùng Thái Bảo"
          isEditing={false}
          onContentChange={() => {}}
        />
        ... và các trường khác như Phone, Email, Link, Date of Birth, Gender
        */}
        {/* Hiện tại, chỉ placeholder hoặc để trống cho phần này */}
        <div className="flex flex-col gap-4 text-black">
          <ExtractedPersonalField title="Name" content="Phùng Thái Bảo" isEditing={isEditing} onContentChange={() => {}} />
          <ExtractedPersonalField title="Gender" content="Male" isEditing={isEditing} onContentChange={() => {}} />
          <ExtractedPersonalField title="Phone number" content="0999999999" isEditing={isEditing} onContentChange={() => {}} />
          <ExtractedPersonalField title="Date of Birth" content="11/11/2004" isEditing={isEditing} onContentChange={() => {}} />
          <ExtractedPersonalField title="Email" content="baophungthai8@gmail.com" isEditing={isEditing} onContentChange={() => {}} />
          <ExtractedPersonalField title="Connected Link" content="likedin.com/in/nguyenvana" isEditing={isEditing} onContentChange={() => {}} />
        </div>
      </div>

      {/* Phần chi tiết CV */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-brand-cream">
        <h2 className="text-xl font-bold mb-4 text-black">Resume Detail</h2>
        <div className="flex flex-col gap-6">
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
      </div>
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
    <div className="bg-white rounded-xl p-4 h-full border border-brand-cream">
      <h3 className="text-lg font-bold mb-2 text-black">{title}</h3>
      {isEditing ? (
        <textarea
          className="w-full h-32 p-2 border border-brand-dark-gray rounded-md bg-white text-black focus:outline-none focus:ring-1 focus:ring-brand-dark-gray resize-none"
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
        />
      ) : (
        <div className="text-brand-dark-gray whitespace-pre-wrap min-h-[100px]">{content || "—"}</div>
      )}
    </div>
  )
}

// New component for personal information fields
function ExtractedPersonalField({
  title,
  content,
  isEditing,
  onContentChange,
}: {
  title: string;
  content: string;
  isEditing: boolean;
  onContentChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col">
      <span className="text-sm font-medium text-brand-dark-gray mb-1">{title}</span>
      {isEditing ? (
        <input
          type="text"
          className="w-full p-2 border border-brand-dark-gray rounded-md bg-white text-black focus:outline-none focus:ring-1 focus:ring-brand-dark-gray"
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
        />
      ) : (
        <span className="text-black font-semibold">{content || "—"}</span>
      )}
    </div>
  );
}

export default ExtractedZone
