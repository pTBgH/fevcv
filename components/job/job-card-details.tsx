"use client"

import { MapPin, GraduationCap, Clock, LucideProps } from "lucide-react"
import React from "react"

// --- Helper Component: Tạo một component nhỏ cho mỗi Tag ---
// Component này chỉ được dùng trong file này để code gọn hơn.
interface JobAttributeTagProps {
  icon: React.ElementType<LucideProps>
  children: React.ReactNode
}

function JobAttributeTag({ icon: Icon, children }: JobAttributeTagProps) {
  // Bạn có thể tùy chỉnh style của tag ở một nơi duy nhất tại đây
  return (
    <span className="inline-flex items-center px-3 py-1 bg-brand-cream text-black rounded-full text-xs font-medium border border-brand-dark-gray">
      <Icon className="h-4 w-4 mr-1.5 flex-shrink-0" />
      <span className="truncate">{children}</span>
    </span>
  )
}

// --- Component chính: Giữ nguyên Props, chỉ thay đổi bên trong ---
interface JobCardDetailsProps {
  company: {
    name: string
    logo: string
  }
  category: string
  title: string
  city: string
  jobType: string
  salaryDisplay: string
  daysLeft: number
}

export function JobCardDetails({
  company,
  category,
  title,
  city,
  jobType,
  salaryDisplay,
  daysLeft,
}: JobCardDetailsProps) {
  // Thay vì hard-code JSX, chúng ta tạo một mảng dữ liệu cho các tag.
  // Điều này giúp code dễ đọc và dễ quản lý hơn.
  const displayTags = [
    {
      id: "location",
      icon: MapPin,
      text: city || "Remote", // Luôn có giá trị, nếu city rỗng thì hiện "Remote"
    },
    {
      id: "level",
      icon: GraduationCap,
      text: category || "Any level", // Nếu category rỗng thì hiện "Any level"
    },
    {
      id: "jobType",
      icon: Clock,
      text: jobType || "Full-time", // Nếu jobType rỗng thì hiện "Full-time"
    },
  ]

  return (
    <>
      {/* Top section */}
      <div className="bg-brand-cream p-5 text-black rounded-t-xl">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-white flex items-center justify-center rounded-lg mr-3 overflow-hidden flex-shrink-0">
            {company.logo ? (
              <img
                src={company.logo || "/placeholder.svg"}
                alt={`${company.name} logo`}
                className="object-contain w-full h-full"
              />
            ) : (
              <span className="text-black text-xl font-bold">
                {company.name.charAt(0)}
              </span>
            )}
          </div>
          <div className="overflow-hidden">
            <div className="font-semibold text-lg truncate">{company.name}</div>
            <div className="text-sm text-gray-400 truncate">
              {category || "Uncategorized"}
            </div>
          </div>
        </div>

        <h3 className="font-bold text-2xl mb-4 leading-tight truncate">
          {title}
        </h3>

        {/* Render các tag từ mảng dữ liệu đã tạo */}
        <div className="flex flex-wrap gap-2">
          {displayTags.map((tag) => (
            <JobAttributeTag key={tag.id} icon={tag.icon}>
              {tag.text}
            </JobAttributeTag>
          ))}
        </div>
      </div>

      {/* Bottom section (không thay đổi) */}
      <div className="bg-brand-dark-gray p-3 text-white rounded-b-xl flex justify-between items-center">
        <div className="flex items-center text-white text-sm">
          <Clock className="h-4 w-4 mr-1.5" />
          <span>
            {daysLeft} {daysLeft > 1 ? "days" : "day"} left
          </span>
        </div>
        <div className="font-semibold text-lg text-brand-cream">
          {salaryDisplay}
        </div>
      </div>
    </>
  )
}