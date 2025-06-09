// components/home/cv-upload-section.tsx
"use client"

import type React from "react"
import { useState, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToastContext } from "@/components/common/toast-provider" // ĐÃ THAY ĐỔI
import { useAppDispatch } from "@/lib/redux/hooks"
import { addResume } from "@/lib/redux/slices/resumeSlice"
import { format } from "date-fns"
import { useAuth } from "@/hooks/use-auth"
import { useLanguage } from "@/lib/i18n/context"
import { generateCVName } from "@/lib/cv-utils"
import { getActiveResumes } from "@/lib/cv-service"
import Image from "next/image"
const allowedFormats = ["pdf", "doc", "docx", "application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

export function CVUploadSection() {
  const [isDragging, setIsDragging] = useState(false);
  const router = useRouter();
  const { toast } = useToastContext(); // ĐÃ THAY ĐỔI
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading: authLoading, requireAuth } = useAuth();
  const { t } = useLanguage();

  const fileInputRefButton = useRef<HTMLInputElement>(null);
  const fileInputRefDropzone = useRef<HTMLInputElement>(null);

  const validateAndProcessFile = useCallback((selectedFile: File | null) => {
    if (!selectedFile) return;

    const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
    const isExtensionValid = fileExtension && allowedFormats.includes(fileExtension);
    const isMimeTypeValid = allowedFormats.includes(selectedFile.type);

    if (!isExtensionValid && !isMimeTypeValid) {
      toast({
        title: t("toast.invalidFile") || "Tập tin không hợp lệ",
        description: (t("toast.pleaseUploadValidFile") || "Vui lòng tải lên tập tin hợp lệ") + " (PDF, DOC, DOCX)",
        type: "error",
        duration: 4000,
      });
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) { // 5MB
      toast({
        title: t("toast.fileTooLarge.title") || "Tập tin quá lớn",
        description: t("toast.fileTooLarge.description") || "Vui lòng tải lên tập tin nhỏ hơn 5MB",
        type: "error",
        duration: 4000,
      });
      return;
    }

    if (!isAuthenticated) {
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        if (e.target?.result) {
          sessionStorage.setItem(
            "pendingUploadFile",
            JSON.stringify({
              name: selectedFile.name,
              type: selectedFile.type,
              data: e.target.result as string, // Data URL
            }),
          );
          console.log("CVUploadSection: File stored in sessionStorage for pending upload.");
        }
      };
      fileReader.readAsDataURL(selectedFile);
      requireAuth(); // Điều hướng đến trang đăng nhập, authSlice sẽ xử lý file chờ
      return;
    }
    
    // Người dùng đã đăng nhập, xử lý file ngay
    const existingResumeNames = getActiveResumes().map(r => r.title);
    const newResumeName = generateCVName(existingResumeNames);

    const newResume = {
      id: Date.now().toString(),
      title: newResumeName,
      // date: format(new Date(), "MMM dd, yyyy"), // Không cần trường date này theo type Resume
      fileType: selectedFile.name.split(".").pop()?.toLowerCase() || "unknown",
      fileUrl: URL.createObjectURL(selectedFile), 
      isNew: true, // Đánh dấu là CV mới để có thể yêu cầu đặt tên
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
      isFavorite: false,
      data: { // Dữ liệu trích xuất ban đầu rỗng
        degree: "",
        technicalSkills: "",
        softSkills: "",
        experience: "",
      },
    };

    dispatch(addResume(newResume));
    toast({
      title: t("toast.cvUploaded"),
      description: selectedFile.name,
      type: "success",
      duration: 3000,
    });

    // Chuyển hướng đến trang review với ID của CV
    router.push(`/upload/review?cvId=${newResume.id}`);

  }, [isAuthenticated, requireAuth, dispatch, router, t, toast]);


  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndProcessFile(e.dataTransfer.files[0]);
      if (fileInputRefDropzone.current) fileInputRefDropzone.current.value = ""; // Reset input
    }
  }, [validateAndProcessFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcessFile(e.target.files[0]);
    }
    e.target.value = ""; // Luôn reset input để có thể chọn lại cùng file
  }, [validateAndProcessFile]);

  // Hiển thị loading nếu auth state chưa sẵn sàng (chỉ cho section này)
  if (authLoading) {
    return (
      <div className="py-20 flex flex-col lg:flex-row items-center animate-pulse">
        <div className="lg:w-1/2 mb-10 lg:mb-0 lg:pr-12 space-y-6">
          <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
          <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
          <div className="h-12 bg-gray-400 dark:bg-gray-600 rounded w-1/3"></div>
        </div>
        <div className="lg:w-1/2 w-full">
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 h-72"></div>
          <div className="mt-4 h-10 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20 flex flex-col lg:flex-row items-center">
      {/* Left side - Text content */}
      <div className="lg:w-1/2 mb-10 lg:mb-0 lg:pr-12 text-center lg:text-left">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-black">
          {t("home.heroTitle")}
        </h1>
        <p className="text-lg text-brand-dark-gray mb-8">
          {t("home.heroSubtitle")}
        </p>
        <Button 
            size="lg" 
            className="flex items-center gap-2 mx-auto lg:mx-0 bg-black text-white hover:bg-brand-dark-gray border border-brand-cream rounded-md px-8 py-6"
            onClick={() => fileInputRefButton.current?.click()} // Trigger file input
        >
          <Upload className="h-5 w-5" />
          {t("common.uploadResume")}
        </Button>
        <input 
            id="file-upload-button-cv-section" // ID nên khác với input của dropzone
            type="file" 
            className="hidden" 
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
            onChange={handleFileInput}
            ref={fileInputRefButton}
        />
      </div>

      {/* Right side - Upload zone */}
      <div className="lg:w-1/2 w-full flex justify-center">
        <div className="bg-brand-cream rounded-3xl p-8 w-full max-w-xl flex flex-col items-center">
          <div
            className="w-full border-2 border-dashed border-brand-dark-gray rounded-2xl p-8 bg-transparent flex flex-col items-center justify-center cursor-pointer"
            onClick={() => fileInputRefDropzone.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex justify-center mb-4 pointer-events-none">
                <Image
                src="/pdf-doc-scan-svgrepo-com.svg"
                alt="PDF icon"
                width={64}
                height={64}
              />
            </div>
            <h3 className="text-lg font-bold mb-2 pointer-events-none text-black">
              {t("resume.dragFileOrClickToUpload")}
            </h3>
            <p className="text-base text-brand-dark-gray mb-4 pointer-events-none">
              PDF, DOC, DOCX (max 5MB)
            </p>
            <input 
              id="dropzone-file-input-cv-section"
              type="file" 
              className="hidden" 
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
              onChange={handleFileInput}
              ref={fileInputRefDropzone}
            />
          </div>
          <Button
            variant="ghost"
            className="w-full mt-8 py-4 bg-brand-cream text-brand-dark-gray font-medium rounded-2xl hover:bg-brand-dark-gray hover:text-white"
            onClick={() => router.push('/search')}
          >
            {t("home.getJobSuggestions") || "Get free jobs suggestion"}
          </Button>
        </div>
      </div>
    </div>
  );
}