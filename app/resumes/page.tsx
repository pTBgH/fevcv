"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Upload } from "lucide-react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/lib/i18n/context"
import { getAllResumes } from "@/lib/cv-service"
import { ResumeGrid } from "@/components/resume/resume-grid"
import type { Resume } from "@/lib/types"

export default function ResumesPage() {
  const [resumes, setResumes] = useState<Resume[]>([])
  const [activeResumes, setActiveResumes] = useState<Resume[]>([])
  const [favoriteResumes, setFavoriteResumes] = useState<Resume[]>([])
  const [deletedResumes, setDeletedResumes] = useState<Resume[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { t } = useLanguage()

  useEffect(() => {
    // Load resumes from the data file
    const allResumes = getAllResumes()
    console.log("Loaded resumes:", allResumes) // Thêm log để kiểm tra
    setResumes(allResumes)

    // Filter active resumes
    const active = allResumes.filter((resume) => resume.deletedAt === null)
    console.log("Active resumes:", active) // Thêm log để kiểm tra
    setActiveResumes(active)

    // Filter favorite resumes
    setFavoriteResumes(allResumes.filter((resume) => resume.isFavorite && resume.deletedAt === null))

    // Filter deleted resumes
    setDeletedResumes(allResumes.filter((resume) => resume.deletedAt !== null))

    setIsLoading(false)
  }, [])

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      // If search query is empty, reset to all resumes
      const allResumes = getAllResumes()
      setActiveResumes(allResumes.filter((resume) => resume.deletedAt === null))
      setFavoriteResumes(allResumes.filter((resume) => resume.isFavorite && resume.deletedAt === null))
      setDeletedResumes(allResumes.filter((resume) => resume.deletedAt !== null))
      return
    }

    const query = searchQuery.toLowerCase()
    const allResumes = getAllResumes()

    // Filter resumes based on search query
    const filteredResumes = allResumes.filter((resume) => resume.title.toLowerCase().includes(query))

    setActiveResumes(filteredResumes.filter((resume) => resume.deletedAt === null))
    setFavoriteResumes(filteredResumes.filter((resume) => resume.isFavorite && resume.deletedAt === null))
    setDeletedResumes(filteredResumes.filter((resume) => resume.deletedAt !== null))
  }

  const handleUploadClick = () => {
    router.push("/upload")
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">{t("dashboard.resumes")}</h1>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder={t("common.search")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="pl-10"
            />
          </div>
          <Button onClick={handleSearch}>{t("common.search")}</Button>
          <Button onClick={handleUploadClick} className="bg-indigo-600 hover:bg-indigo-700">
            <Upload className="h-4 w-4 mr-2" />
            {t("resume.uploadCv")}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">{t("common.all")}</TabsTrigger>
          <TabsTrigger value="favorites">{t("resume.favorite")}</TabsTrigger>
          <TabsTrigger value="deleted">{t("dashboard.bin")}</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <ResumeGrid resumes={activeResumes} isLoading={isLoading} emptyMessage={t("resume.noResumesFound")} />
        </TabsContent>

        <TabsContent value="favorites">
          <ResumeGrid resumes={favoriteResumes} isLoading={isLoading} emptyMessage={t("resume.noResumesFound")} />
        </TabsContent>

        <TabsContent value="deleted">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <p className="text-sm text-yellow-700">{t("dashboard.permanentlyDeleted")}</p>
          </div>
          <ResumeGrid
            resumes={deletedResumes}
            isLoading={isLoading}
            emptyMessage={t("common.noResults")}
            context="bin"
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
