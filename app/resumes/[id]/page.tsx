"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Download, Heart, Pencil } from "lucide-react"
import { getResumeById, toggleFavorite } from "@/lib/cv-service"
import { useLanguage } from "@/lib/i18n/context"
import { useReduxToast } from "@/hooks/use-redux-toast"
import ExtractedZone from "@/components/resume/extracted-zone"
import type { Resume } from "@/lib/types"

export default function ResumeDetailPage({ params }: { params: { id: string } }) {
  const [resume, setResume] = useState<Resume | null>(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("preview")
  const router = useRouter()
  const { t } = useLanguage()
  const { toast } = useReduxToast()

  useEffect(() => {
    // Load resume by ID
    const resumeData = getResumeById(params.id)
    if (resumeData) {
      setResume(resumeData)
      setIsFavorite(resumeData.isFavorite)
    }
    setIsLoading(false)
  }, [params.id])

  const handleBack = () => {
    router.push("/resumes")
  }

  const handleToggleFavorite = () => {
    if (!resume) return

    // Toggle favorite state
    const updatedResume = toggleFavorite(resume.id)
    if (updatedResume) {
      setIsFavorite(!isFavorite)
      setResume(updatedResume)

      // Show toast notification
      toast({
        title: isFavorite ? t("resume.removedFromFavorites") : t("resume.addedToFavorites"),
        type: "success",
        duration: 3000,
      })
    }
  }

  const handleDownload = () => {
    if (!resume?.fileUrl) return

    // Create a temporary link and trigger download
    const link = document.createElement("a")
    link.href = resume.fileUrl
    link.download = resume.title || "resume.pdf"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Show toast notification
    toast({
      title: t("resume.download"),
      type: "success",
      duration: 3000,
    })
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="animate-pulse h-96 dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-700 rounded-lg dark:border dark:border-slate-600"></div>
      </div>
    )
  }

  if (!resume) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-700 dark:border-slate-600 dark:shadow-lg dark:shadow-purple-900/20">
          <CardContent className="p-6">
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold mb-2 dark:text-white dark:drop-shadow-sm">{t("resume.notFound")}</h2>
              <p className="text-gray-500 dark:text-indigo-300 mb-4">{t("resume.notFoundDescription")}</p>
              <Button
                onClick={handleBack}
                className="dark:bg-gradient-to-r dark:from-indigo-600 dark:to-indigo-500 dark:hover:from-indigo-500 dark:hover:to-indigo-400 transition-colors"
              >
                {t("common.back")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="dark:text-indigo-300 dark:hover:text-indigo-200 dark:hover:bg-indigo-900/30 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold dark:text-white dark:drop-shadow-sm">{resume.title}</h1>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleToggleFavorite}
            className={
              isFavorite
                ? "text-red-500 dark:text-pink-400 dark:border-pink-500/50 dark:hover:bg-pink-900/20 dark:hover:text-pink-300"
                : "dark:text-indigo-300 dark:border-indigo-500/50 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-200"
            }
          >
            <Heart className="h-5 w-5" fill={isFavorite ? "currentColor" : "none"} />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="dark:text-indigo-300 dark:border-indigo-500/50 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-200 transition-colors"
          >
            <Pencil className="h-5 w-5" />
          </Button>

          <Button
            variant="outline"
            onClick={handleDownload}
            className="dark:text-indigo-300 dark:border-indigo-500/50 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-200 transition-colors"
          >
            <Download className="h-5 w-5 mr-2" />
            {t("resume.download")}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="preview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 dark:bg-slate-800 dark:border dark:border-slate-600">
          <TabsTrigger
            value="preview"
            className="dark:data-[state=active]:bg-indigo-600 dark:data-[state=active]:text-white dark:text-indigo-200 transition-colors"
          >
            {t("resume.preview")}
          </TabsTrigger>
          <TabsTrigger
            value="extracted"
            className="dark:data-[state=active]:bg-indigo-600 dark:data-[state=active]:text-white dark:text-indigo-200 transition-colors"
          >
            {t("resume.extractedInformation")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="mt-6">
          <Card className="dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-700 dark:border-slate-600 dark:shadow-lg dark:shadow-purple-900/20">
            <CardContent className="pt-6">
              <div className="flex justify-center">
                <div className="relative aspect-[3/4] w-full max-w-md bg-gradient-to-br from-indigo-900/20 to-slate-800 p-1 rounded-md">
                  <Image
                    src={resume.fileUrl || "/placeholder.svg?height=600&width=400"}
                    alt="Resume preview"
                    fill
                    className="object-contain rounded-sm"
                    priority
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="extracted" className="mt-6">
          <Card className="dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-700 dark:border-slate-600 dark:shadow-lg dark:shadow-purple-900/20">
            <CardContent className="pt-6">
              <ExtractedZone cvId={resume.id} customData={resume.data} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
