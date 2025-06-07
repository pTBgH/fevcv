// components/home/cv-upload-section.tsx
"use client"

import type React from "react"
import { useState, useCallback, useRef, useEffect } from "react" // Thêm useRef và useEffect
import { useRouter } from "next/navigation"
import { FileText, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast" // Sử dụng useToast từ Shadcn
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
  const { toast: showToast } = useToast() // Đổi tên để tránh nhầm lẫn với Redux toast (nếu có)
  const dispatch = useAppDispatch()
  const { isAuthenticated, requireAuth } = useAuth()
  const { t } = useLanguage()
  const fileInputRefButton = useRef<HTMLInputElement>(null) // Ref cho input của nút
  const fileInputRefDropzone = useRef<HTMLInputElement>(null) // Ref cho input của dropzone

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
    if (fileToCheck.size > 5 * 1024 * 1024) { // Max 5MB
      showToast({
        title: t("toast.fileTooLarge" as any) || "File too large", // ép kiểu nếu cần
        description: t("toast.pleaseUploadFileSize" as any) || "Please upload a file smaller than 5MB",
        variant: "destructive",
      })
      return false
    }
    return true
  }

  const handleProcessAndNavigate = (selectedFile: File) => {
    if (!validateFile(selectedFile)) {
      return;
    }

    const existingResumeNames = getActiveResumes().map(r => r.title);
    const newResumeName = generateCVName(existingResumeNames);

    const newResume = {
      id: Date.now().toString(),
      title: newResumeName,
      date: format(new Date(), "MMM dd, yyyy"), // Redundant if `createdAt` is used for display
      fileType: selectedFile.name.split(".").pop()?.toLowerCase() || "pdf",
      fileUrl: URL.createObjectURL(selectedFile), // Create a temporary URL for the file
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
    };

    dispatch(addResume(newResume));

    showToast({
      title: t("toast.cvUploaded"),
      description: `${selectedFile.name} - ${t("toast.redirectingToReview") || "Redirecting to review..."}`,
    });

    router.push(`/upload/review?cvId=${newResume.id}`);
  }


  const handleFileUpload = useCallback((selectedFile: File) => {
     if (!isAuthenticated) {
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
          if (e.target?.result) {
            sessionStorage.setItem(
              "pendingUploadFile",
              JSON.stringify({
                name: selectedFile.name,
                type: selectedFile.type,
                data: e.target.result as string,
              })
            );
            requireAuth(); // Sẽ chuyển hướng, file sẽ được xử lý sau khi login thành công
          }
        };
        fileReader.readAsDataURL(selectedFile);
        return;
      }
      handleProcessAndNavigate(selectedFile);
  }, [isAuthenticated, requireAuth, dispatch, router, t, showToast, handleProcessAndNavigate]);


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
    // Reset giá trị của input để cho phép tải lại cùng một file
    e.target.value = ""
  }

  const triggerFileInput = (ref: React.RefObject<HTMLInputElement>) => {
    ref.current?.click()
  }

  return (
    <div className="py-20 flex flex-col lg:flex-row items-center">
      {/* Left side - Text content */}
      <div className="lg:w-1/2 mb-10 lg:mb-0 lg:pr-12 text-center lg:text-left">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
          {t('home.heroTitleCVSectionA') || "Find your next job"} {/* Fallback */}
          <br />
          {t('home.heroTitleCVSectionB') || "in seconds"}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          {t('home.heroSubtitleCVSection') || "We know job hunting can be overwhelming. That's why we created a simple—just upload your CV, and we'll instantly show you jobs that match your skills and experience."}
        </p>
        {/* Button này sẽ trigger fileInputRefButton */}
        <Button size="lg" className="flex items-center gap-2 mx-auto lg:mx-0" onClick={() => triggerFileInput(fileInputRefButton)}>
          <Upload className="h-5 w-5" />
          {t('common.uploadResume') || "Upload Resume"}
        </Button>
        <input
          id="file-upload-button"
          type="file"
          className="hidden"
          accept={allowedFormats.map(f => `.${f}`).join(",")}
          onChange={handleFileInput}
          ref={fileInputRefButton}
        />
      </div>

      {/* Right side - Upload zone */}
      <div className="lg:w-1/2">
        {/* Dropzone này sẽ trigger fileInputRefDropzone */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer ${ // Thêm cursor-pointer
            isDragging ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-300 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => triggerFileInput(fileInputRefDropzone)} // Thêm onClick để trigger input
        >
          <div className="flex justify-center mb-4 pointer-events-none"> {/* Thêm pointer-events-none */}
            <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full">
              <FileText className="h-8 w-8 text-gray-500 dark:text-gray-400" />
            </div>
          </div>
          <h3 className="text-lg font-medium mb-2 pointer-events-none">{t('home.dragDropCVTitle') || "Just drop your CV below, we'll handle the rest"}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 pointer-events-none">{t('home.dragDropCVSubtitle') || "Drag and drop here or click to upload"}</p>
          {/* Nút "Browse files" bên trong dropzone cũng trigger fileInputRefDropzone */}
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation(); // Ngăn sự kiện click của div cha
              triggerFileInput(fileInputRefDropzone);
            }}
          >
            {t('home.browseFiles') || "Browse files"}
          </Button>
          <input
            id="dropzone-file-input" // ID mới cho input này
            type="file"
            className="hidden"
            accept={allowedFormats.map(f => `.${f}`).join(",")}
            onChange={handleFileInput}
            ref={fileInputRefDropzone}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 pointer-events-none">
            {t('resume.supportForPdfDocDocx') || "Supported formats: PDF, DOC, DOCX (max 5MB)"}
          </p>
        </div>
        <div className="mt-4">
          <Button
            variant="ghost"
            className="w-full py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
            onClick={() => router.push("/search?mode=suggest")} // Hoặc router.push("/upload") nếu bạn muốn mở trang upload
          >
            {t('home.getFreeJobSuggestion') || "Get free jobs suggestion"}
          </Button>
        </div>
      </div>
    </div>
  )
}