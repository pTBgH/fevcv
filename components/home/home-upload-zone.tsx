"use client"

import type React from "react"
import { useState, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { FileText, ArrowUp } from "lucide-react" // Thay Upload bằng ArrowUp
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useAppDispatch } from "@/lib/redux/hooks"
import { addResume } from "@/lib/redux/slices/resumeSlice"
import { format } from "date-fns"
import { useAuth } from "@/hooks/use-auth"
import { useLanguage } from "@/lib/i18n/context"
import { generateCVName } from "@/lib/cv-utils"
import { getActiveResumes } from "@/lib/cv-service"

const allowedFormats = ["pdf", "doc", "docx"]

export function CVUploadSection() {
  const [isDragging, setIsDragging] = useState(false)
  const router = useRouter()
  const { toast: showToast } = useToast()
  const dispatch = useAppDispatch()
  const { isAuthenticated, requireAuth } = useAuth()
  const { t } = useLanguage()
  const fileInputRefButton = useRef<HTMLInputElement>(null)
  const fileInputRefDropzone = useRef<HTMLInputElement>(null)

  const validateFile = (fileToCheck: File): boolean => {
    const extension = fileToCheck.name.split(".").pop()?.toLowerCase()
    if (!extension || !allowedFormats.includes(extension)) {
      showToast({
        title: t("toast.invalidFile"),
        description: t("toast.pleaseUploadValidFile"),
        variant: "destructive",
      })
      return false
    }
    if (fileToCheck.size > 5 * 1024 * 1024) {
      showToast({
        title: t("toast.fileTooLarge" as any) || "File too large",
        description: t("toast.pleaseUploadFileSize" as any) || "Please upload a file smaller than 5MB",
        variant: "destructive",
      })
      return false
    }
    return true
  }

  const handleProcessAndNavigate = (selectedFile: File) => {
    if (!validateFile(selectedFile)) {
      return
    }

    const existingResumeNames = getActiveResumes().map((r) => r.title)
    const newResumeName = generateCVName(existingResumeNames)

    const newResume = {
      id: Date.now().toString(),
      title: newResumeName,
      date: format(new Date(), "MMM dd, yyyy"),
      fileType: selectedFile.name.split(".").pop()?.toLowerCase() || "pdf",
      fileUrl: URL.createObjectURL(selectedFile),
      isNew: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
      isFavorite: false,
      data: {
        degree: "",
        technicalSkills: "",
        softSkills: "",
        experience: "",
      },
    }

    dispatch(addResume(newResume))

    showToast({
      title: t("toast.cvUploaded"),
      description: `${selectedFile.name} - ${t("toast.redirectingToReview") || "Redirecting to review..."}`,
    })

    router.push(`/upload/review?cvId=${newResume.id}`)
  }

  const handleFileUpload = useCallback(
    (selectedFile: File) => {
      if (!isAuthenticated) {
        const fileReader = new FileReader()
        fileReader.onload = (e) => {
          if (e.target?.result) {
            sessionStorage.setItem(
              "pendingUploadFile",
              JSON.stringify({
                name: selectedFile.name,
                type: selectedFile.type,
                data: e.target.result as string,
              })
            )
            requireAuth()
          }
        }
        fileReader.readAsDataURL(selectedFile)
        return
      }
      handleProcessAndNavigate(selectedFile)
    },
    [isAuthenticated, requireAuth, dispatch, router, t, showToast, handleProcessAndNavigate]
  )

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files[0])
    }
    e.target.value = ""
  }

  const triggerFileInput = (ref: React.RefObject<HTMLInputElement>) => {
    ref.current?.click()
  }

  return (
    <div className="bg-gray-50 min-h-screen w-full flex items-center justify-center">
      <div className="container mx-auto flex flex-col lg:flex-row items-center justify-center gap-12 px-6 py-20">
        {/* Left side - Text content */}
        <div className="lg:w-1/2 text-center lg:text-left">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-black">
                {t("home.heroTitleCVSectionA") || "Find your next job in seconds"}
            </h1>
            <p className="text-lg text-gray-500 mb-8 max-w-lg mx-auto lg:mx-0">
                {t("home.heroSubtitleCVSection") || "We know job hunting can be overwhelming. That's why we make it simple — just upload your CV, and we'll instantly show you jobs that actually match your skills and background."}
            </p>
            <Button size="lg" className="rounded-md flex items-center gap-2 mx-auto lg:mx-0 bg-black text-white hover:bg-gray-800 px-6 py-6" onClick={() => triggerFileInput(fileInputRefButton)}>
                {t("common.uploadResume") || "Upload Resume"}
                <ArrowUp className="h-5 w-5" />
            </Button>
            <input
                id="file-upload-button"
                type="file"
                className="hidden"
                accept={allowedFormats.map((f) => `.${f}`).join(",")}
                onChange={handleFileInput}
                ref={fileInputRefButton}
            />
        </div>

        {/* Right side - Upload zone */}
        <div className="lg:w-1/2 w-full max-w-md">
            <div
                className={`w-full rounded-2xl p-8 text-center bg-white cursor-pointer transition-colors duration-200 border-2 border-dashed ${isDragging ? "border-black" : "border-gray-200 hover:border-gray-400"}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => triggerFileInput(fileInputRefDropzone)}
            >
                <div className="flex justify-center mb-4 pointer-events-none">
                    <FileText className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2 pointer-events-none text-black">{t("home.dragDropCVTitle") || "Just drop your CV below, we'll handle the rest"}</h3>
                <p className="text-sm text-gray-500 mb-4 pointer-events-none">{t("home.dragDropCVSubtitle") || "Drag and drop here or click to upload"}</p>
                <input
                    id="dropzone-file-input"
                    type="file"
                    className="hidden"
                    accept={allowedFormats.map((f) => `.${f}`).join(",")}
                    onChange={handleFileInput}
                    ref={fileInputRefDropzone}
                />
            </div>
            <div className="mt-4">
                <Button
                    variant="ghost"
                    className="w-full py-3 rounded-md bg-gray-100 text-gray-900 font-medium hover:bg-gray-200"
                    onClick={() => router.push("/search?mode=suggest")}
                >
                    {t("home.getFreeJobSuggestion") || "Get free jobs suggestion"}
                </Button>
            </div>
        </div>
      </div>
    </div>
  )
}