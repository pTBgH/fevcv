"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useLanguage } from "@/lib/i18n/context"
import suggestedJobsData from "@/data/suggested-jobs.json"
import { getAllJobs } from "@/lib/job-service"
import { useRouter } from "next/navigation"

interface SuggestedRoleSectionProps {
  selectedCVId?: string
}

export default function SuggestedRoleSection({ selectedCVId }: SuggestedRoleSectionProps) {
  const { t } = useLanguage()
  const router = useRouter()
  const allJobs = useMemo(() => getAllJobs(), [])

  // Tính toán vai trò phù hợp dựa trên CV được chọn
  const roleStats = useMemo(() => {
    if (!selectedCVId) return []

    // Lấy danh sách ID job phù hợp với CV được chọn
    const matchedJobIds = (suggestedJobsData[selectedCVId as keyof typeof suggestedJobsData] as string[]) || []

    if (!matchedJobIds || matchedJobIds.length === 0) return []

    // Lấy thông tin chi tiết của các job từ danh sách tất cả job
    const matchedJobs = matchedJobIds.map((jobId) => allJobs.find((j) => j.id === jobId)).filter(Boolean) // Lọc bỏ các giá trị null

    // Nhóm job theo danh mục
    const categoryGroups: Record<string, number> = {}
    matchedJobs.forEach((job) => {
      if (job?.category) {
        categoryGroups[job.category] = (categoryGroups[job.category] || 0) + 1
      }
    })

    // Tính tỷ lệ phần trăm và tạo mảng kết quả
    const totalJobs = matchedJobs.length
    return Object.entries(categoryGroups)
      .map(([category, count]) => ({
        category,
        count,
        percentage: Math.round((count / totalJobs) * 100),
      }))
      .sort((a, b) => b.percentage - a.percentage) // Sắp xếp theo phần trăm giảm dần
  }, [selectedCVId, allJobs])

  const handleRoleClick = (category: string) => {
    router.push(`/search?q=${encodeURIComponent(category)}`)
  }

  if (roleStats.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("dashboard.suitableRoles")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-6 text-center bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-500">{t("common.noResults")}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("dashboard.suitableRoles")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {roleStats.map((role, index) => (
          <div
            key={index}
            className="space-y-1 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors"
            onClick={() => handleRoleClick(role.category)}
          >
            <div className="flex justify-between text-sm">
              <span>{role.category}</span>
              <span className="font-medium">{role.percentage}%</span>
            </div>
            <Progress value={role.percentage} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
