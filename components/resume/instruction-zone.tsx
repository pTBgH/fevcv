"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAppDispatch } from "@/lib/redux/hooks"
import { addResume } from "@/lib/redux/slices/resumeSlice"
import toast from "react-hot-toast"
// Thay đổi import từ useTranslation sang useLanguage
import { useLanguage } from "@/lib/i18n/context"
import { useAuthCheck } from "@/hooks/use-auth-check"

export default function InstructionZone() {
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const dispatch = useAppDispatch()
  // Trong component, thay đổi destructuring từ useTranslation sang useLanguage
  const { t } = useLanguage()
  const { checkAuth } = useAuthCheck()

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0]
      validateAndProcessFile(droppedFile)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0]
      validateAndProcessFile(selectedFile)
    }
  }

  const handleUploadSuccess = (cvId: string) => {
    // Hiển thị thông báo thành công
    toast({
      title: t("resume.uploadSuccess"),
      description: t("resume.processingDescription"),
    })

    // Chuyển hướng đến trang review với ID của CV
    router.push(`/upload/review?cvId=${cvId}`)
  }

  const validateAndProcessFile = (selectedFile: File) => {
    const authCheckedAction = checkAuth(() => {
      // Check file type
      const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ]
      if (!validTypes.includes(selectedFile.type)) {
        toast.error(t("resume.invalidFileFormat"), {
          duration: 3000,
          position: "bottom-right",
          className: "bg-red-50 text-red-800 border border-red-200",
          icon: "❌",
        })
        return
      }

      setFile(selectedFile)

      // Simulate file upload
      const loadingToast = toast.loading(t("common.loading"), {
        position: "bottom-right",
        className: "bg-blue-50 text-blue-800 border border-blue-200",
      })

      setTimeout(() => {
        toast.dismiss(loadingToast)

        // Add resume to Redux store
        const newResumeId = Math.floor(Math.random() * 10000)
        dispatch(
          addResume({
            id: newResumeId.toString(),
            name: selectedFile.name,
            uploadDate: new Date().toISOString(),
            fileSize: selectedFile.size,
            fileType: selectedFile.type,
            status: "active",
            isFavorite: false,
          }),
        )

        handleUploadSuccess(newResumeId.toString())

        // toast.success(t("resume.fileUploadedSuccessfully"), {
        //   duration: 3000,
        //   position: "bottom-right",
        //   className: "bg-green-50 text-green-800 border border-green-200",
        //   icon: "✅",
        // })

        // Redirect to review page
        // router.push("/upload/review")
      }, 1500)
    }, "tải lên CV")

    authCheckedAction()
  }

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".pdf,.doc,.docx" className="hidden" />
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900">{t("resume.dragFileOrClickToUpload")}</h3>
          <p className="text-sm text-gray-500">{t("resume.supportForPdfDocDocx")}</p>
        </div>
      </div>

      {file && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span className="text-sm font-medium text-gray-700 truncate flex-1">{file.name}</span>
            <span className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
          </div>
        </div>
      )}
    </div>
  )
}
