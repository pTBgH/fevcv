"use client"

import { useEffect, useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useLanguage } from "@/lib/i18n/context"
import suggestedJobsData from "@/data/suggested-jobs.json"
import { getAllJobs } from "@/lib/job-service"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { SuggestedTag } from "@/components/suggested-tag"

// Add a function to fetch suggested roles from the API
async function fetchSuggestedRoles(cvId: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    const response = await fetch(`${apiUrl}/api/suggested-roles?cvId=${cvId}`)
    if (!response.ok) {
      throw new Error("Failed to fetch suggested roles")
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching suggested roles:", error)
    return []
  }
}

export function SuggestedRoleSection({ selectedCVId }: { selectedCVId?: string }) {
  const { t } = useLanguage()
  const [isLoading, setIsLoading] = useState(false)
  const [suggestedRoles, setSuggestedRoles] = useState<string[]>([])
  const router = useRouter()
  const allJobs = useMemo(() => getAllJobs(), [])

  // Fetch suggested roles from API when CV ID changes
  useEffect(() => {
    if (!selectedCVId) {
      // If no CV is selected, use default roles
      setSuggestedRoles([
        "UX Designer",
        "UI Designer",
        "Product Designer",
        "Graphic Designer",
        "Web Designer",
        "Mobile Designer",
      ])
      return
    }

    const fetchRoles = async () => {
      setIsLoading(true)
      try {
        if (process.env.NEXT_PUBLIC_API_URL) {
          // Use the API if the environment variable is available
          const data = await fetchSuggestedRoles(selectedCVId)
          if (data && data.length > 0) {
            setSuggestedRoles(data)
            setIsLoading(false)
            return
          }
        }

        // Fall back to default roles if API fails or isn't configured
        setSuggestedRoles([
          "UX Designer",
          "UI Designer",
          "Product Designer",
          "Graphic Designer",
          "Web Designer",
          "Mobile Designer",
        ])
      } catch (error) {
        console.error("Error in suggested roles effect:", error)
        // Fall back to default roles
        setSuggestedRoles([
          "UX Designer",
          "UI Designer",
          "Product Designer",
          "Graphic Designer",
          "Web Designer",
          "Mobile Designer",
        ])
      } finally {
        setIsLoading(false)
      }
    }

    fetchRoles()
  }, [selectedCVId])

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

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/10 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold">{t("dashboard.suggestedRoles")}</h2>
        </div>
        <div className="animate-pulse flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-8 bg-gray-200 rounded-full w-24"></div>
          ))}
        </div>
      </div>
    )
  }

  if (suggestedRoles.length > 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/10 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold">{t("dashboard.suggestedRoles")}</h2>
          <Button variant="ghost" size="sm" className="text-blue-600">
            {t("common.viewAll")}
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {suggestedRoles.map((role) => (
            <SuggestedTag key={role} tag={role} />
          ))}
        </div>
      </div>
    )
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
