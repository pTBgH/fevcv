// --- START OF MODIFIED FILE cv-upload-section.tsx ---

"use client"

import type React from "react"
import { useState, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { Upload, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
// import { useToastContext } from "@/components/common/toast-provider"
import { useAppDispatch } from "@/lib/redux/hooks"
import { addResume } from "@/lib/redux/slices/resumeSlice"
import { signIn, useSession } from "next-auth/react" // Import useSession
import { useLanguage } from "@/lib/i18n/context"
import { generateCVName } from "@/lib/cv-utils"
import type { Resume } from "@/lib/types"
import Image from "next/image"

// Interface để định nghĩa cấu trúc JSON trả về từ API /resume/fields
interface ExtractedFieldsResponse {
    degree: string;
    experience: string;
    technical_skill: string;
    soft_skill: string;
    exp_years: number;
    file_path: string;
}
const allowedMimeTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
];
const allowedExtensions = ["pdf", "doc", "docx"];

export function CVUploadSection() {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const router = useRouter();
  // const { toast } = useToastContext();
  const dispatch = useAppDispatch();
  const { data: session, status } = useSession(); // *** LẤY SESSION RA ĐỂ SỬ DỤNG ***
  const { t } = useLanguage();

  const fileInputRefButton = useRef<HTMLInputElement>(null);
  const fileInputRefDropzone = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback(async (selectedFile: File | null) => {
    if (!selectedFile) return;

    // 1. Kiểm tra trạng thái đăng nhập TRƯỚC KHI làm bất cứ điều gì
    if (status !== "authenticated" || !session?.accessToken) {
      // toast({ title: "Yêu cầu đăng nhập", description: "Bạn cần đăng nhập để thực hiện chức năng này.", type: "error" });
      signIn('keycloak'); // Chuyển hướng đến trang đăng nhập
      return;
    }
    
    // 2. Kiểm tra file ở client
    const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase() || '';
    if (!allowedExtensions.includes(fileExtension) || !allowedMimeTypes.includes(selectedFile.type)) {
      // toast({ title: "Tệp không hợp lệ", description: "Vui lòng tải lên file PDF, DOC, hoặc DOCX.", type: "error" });
      return;
    }
    if (selectedFile.size > 5 * 1024 * 1024) { // 5MB
      // toast({ title: "Tệp quá lớn", description: "Vui lòng tải lên tệp nhỏ hơn 5MB.", type: "error" });
      return;
    }

    setIsUploading(true);
    // toast({ title: "Đang phân tích CV...", description: "Vui lòng đợi trong giây lát.", type: "info" });

    const formData = new FormData();
    formData.append("cv", selectedFile);

    try {
      // 3. Gọi API và đính kèm `accessToken`
      console.log("Sending request with accessToken:", session.accessToken);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/resume/fields`, {
        method: 'POST',
        headers: {
          // *** ĐÂY LÀ DÒNG QUAN TRỌNG NHẤT ***
          'Authorization': `Bearer ${session.accessToken}`,
        },
        body: formData,
      });

      // Kiểm tra lỗi thông minh
      if (!response.ok) {
    // Nếu response có thể đọc dưới dạng JSON (trường hợp lỗi validation)
    if (response.headers.get('content-type')?.includes('application/json')) {
        const errorData = await response.json();
        // Log chi tiết các lỗi validation
        console.error("Validation errors:", errorData.errors);
        
        // Tạo một thông điệp lỗi rõ ràng hơn
        const errorMessages = Object.values(errorData.errors || {}).flat().join(' ');
        throw new Error(`Lỗi dữ liệu: ${errorMessages || response.statusText}`);
    } else {
        // Nếu là lỗi khác (HTML, text...)
        throw new Error(`Lỗi server: ${response.status} - ${await response.text()}`);
    }
  }
      
      const backendData: ExtractedFieldsResponse = await response.json();
      
      // 4. Tạo object Resume hoàn chỉnh từ backend response
      const newResume: Resume = {
        id: `cv-${Date.now()}`,
        title: generateCVName([], selectedFile.name),
        fileUrl: backendData.file_path,
        exp_years: backendData.exp_years,
        data: {
          file_path: backendData.file_path,
          degree: backendData.degree,
          experience: backendData.experience,
          technical_skill: backendData.technical_skill, // Mapping từ technical_skill -> technical_skill
          soft_skill: backendData.soft_skill,           // Mapping từ soft_skill -> soft_skill
        },
        isNew: true,
        isFavorite: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: null,
      };

      dispatch(addResume(newResume));
      router.push(`/resumes/editor?cvId=${newResume.id}`);

    } catch (error) {
      console.error("Lỗi khi trích xuất CV:", error);
      // toast({
      //     title: "Lỗi Tải Lên",
      //     description: error instanceof Error ? error.message : "Đã có lỗi không mong muốn xảy ra.",
      //     type: "error"
      // });
    } finally {
      setIsUploading(false);
    }
  }, [dispatch, router, session, status]); // *** THÊM `session` và `status` VÀO DEPENDENCY ARRAY ***

  // bỏ toast ở dòng trên

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (isUploading) return;
    setIsDragging(true);
  }, [isUploading]);

  const handleDragLeave = useCallback(() => setIsDragging(false), []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (isUploading) return;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  }, [isUploading, handleFileUpload]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files[0]);
    }
    e.target.value = "";
  }, [handleFileUpload]);
  
  const handleUploadClick = () => {
    if (isUploading) return;
    if (status !== 'authenticated') {
      signIn('keycloak');
      return;
    }
    fileInputRefButton.current?.click();
  }
  
  const handleDropzoneClick = () => {
    if (isUploading) return;
    if (status !== 'authenticated') {
      signIn('keycloak');
      return;
    }
    fileInputRefDropzone.current?.click();
  }

  // Giao diện JSX (giữ nguyên, chỉ thêm logic disable và loading)
  return (
    <div className="py-20 flex flex-col lg:flex-row items-center">
      {/* Left side */}
      <div className="lg:w-1/2 mb-10 lg:mb-0 lg:pr-12 text-center lg:text-left">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-black">
          {t("home.heroTitle")}
        </h1>
        <p className="text-lg text-brand-dark-gray mb-8">
          {t("home.heroSubtitle")}
        </p>
        <Button 
          className="flex items-center gap-2 mx-auto lg:mx-0 bg-black text-white hover:bg-brand-dark-gray border border-brand-cream rounded-md px-8 py-6"
          onClick={handleUploadClick}
          disabled={isUploading}
        >
          {isUploading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
          {isUploading ? "Đang xử lý..." : t("common.uploadResume")} 
        </Button>
        <input 
          id="file-upload-button-cv-section" type="file" className="hidden" 
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
          onChange={handleFileInput} ref={fileInputRefButton} disabled={isUploading}
        />
      </div>

      {/* Right side - Upload zone */}
      <div className="lg:w-1/2 w-full flex justify-center">
        <div className="bg-brand-cream rounded-3xl p-8 w-full max-w-xl flex flex-col items-center">
          <div
            className={`w-full border-2 border-dashed border-brand-dark-gray rounded-2xl p-8 bg-transparent flex flex-col items-center justify-center transition-all ${isUploading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
            onClick={handleDropzoneClick} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
          >
            {isUploading ? (
                <>
                    <Loader2 className="h-16 w-16 text-black animate-spin mb-4" />
                    <h3 className="text-lg font-bold mb-2 text-black">Đang phân tích CV...</h3>
                    <p className="text-base text-brand-dark-gray">Vui lòng đợi trong giây lát.</p>
                </>
            ) : (
                <>
                    <div className="flex justify-center mb-4 pointer-events-none">
                        <Image src="/pdf-doc-scan-svgrepo-com.svg" alt="PDF icon" width={64} height={64} />
                    </div>
                    <h3 className="text-lg font-bold mb-2 pointer-events-none text-black">{t("resume.dragFileOrClickToUpload")}</h3>
                    <p className="text-base text-brand-dark-gray mb-4 pointer-events-none">PDF, DOC, DOCX (max 5MB)</p>
                </>
            )}
            <input 
              id="dropzone-file-input-cv-section" type="file" className="hidden"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
              onChange={handleFileInput} ref={fileInputRefDropzone} disabled={isUploading}
            />
          </div>
          <Button
            className="w-full mt-8 py-4 bg-black text-white font-medium rounded-2xl hover:bg-brand-dark-gray hover:text-white"
            onClick={handleDropzoneClick}
          >
            {t("common.uploadNew") || "Get free jobs suggestion"}
          </Button>
        </div>
      </div>
    </div>
  );
}
