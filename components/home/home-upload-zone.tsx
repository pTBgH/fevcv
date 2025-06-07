"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useLanguage } from "@/lib/i18n/context"
import { useAppDispatch } from "@/lib/redux/hooks"
import { addResume } from "@/lib/redux/slices/resumeSlice"
import { useToastContext } from "@/components/common/toast-provider"
import { format } from "date-fns"
import { useAuth } from "@/hooks/use-auth"

const allowedFormats = ["pdf", "doc", "docx"]

export function HomeUploadZone() {
  const router = useRouter()
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const { t } = useLanguage()
  const dispatch = useAppDispatch()
  const { toast } = useToastContext()
  const { isAuthenticated, requireAuth } = useAuth()

  const validateFile = (file: File) => {
    const extension = file.name.split(".").pop()?.toLowerCase()
    return extension ? allowedFormats.includes(extension) : false
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      const files = e.dataTransfer.files
      if (files.length) {
        const selected = files[0]
        handleFileUpload(selected)
      }
    },
    [t],
  )

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (files?.length) {
        const selected = files[0]
        handleFileUpload(selected)
      }
    },
    [t],
  )

  const handleFileUpload = (file: File) => {
    const isValid = validateFile(file)

    if (!isValid) {
      toast({
        title: t("toast.invalidFile"),
        description: t("toast.pleaseUploadValidFile"),
        type: "error",
      })
      return
    }

    // Check if user is authenticated
    if (!isAuthenticated) {
      // Store file temporarily in sessionStorage
      const fileReader = new FileReader()
      fileReader.onload = (e) => {
        if (e.target?.result) {
          sessionStorage.setItem(
            "pendingUploadFile",
            JSON.stringify({
              name: file.name,
              type: file.type,
              data: e.target.result,
            }),
          )
        }
      }
      fileReader.readAsDataURL(file)

      // Redirect to auth page
      requireAuth()
      return
    }

    // Process file if user is authenticated
    const newResume = {
      id: Date.now().toString(),
      title: format(new Date(), "MMM dd, yyyy"),
      date: format(new Date(), "MMM dd, yyyy"),
      fileType: file.name.split(".").pop()?.toLowerCase() || "pdf",
      fileUrl: URL.createObjectURL(file),
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

    toast({
      title: t("toast.cvUploaded"),
      description: file.name,
      type: "success",
    })

    router.push("/upload/review")
  }

  return (
    <Card className="p-6 shadow-lg border-0 bg-white/90 backdrop-blur-sm dark:bg-gray-900/90">
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
          isDragging ? "border-primary bg-primary/5" : "border-gray-200 dark:border-gray-700"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleFileSelect}
        />
        <div className="text-center">
          <Upload className="mx-auto h-10 w-10 text-primary" />
          <h3 className="mt-3 text-lg font-medium text-primary">{t("resume.dragFileOrClickToUpload")}</h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{t("resume.supportForPdfDocDocx")}</p>
          <Button className="mt-4" size="sm">
            {t("resume.uploadResume")}
          </Button>
        </div>
      </div>
    </Card>
  )
}
