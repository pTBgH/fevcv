"use client"; // Component này vẫn cần là client component vì sử dụng hooks (useState) và events (onClick)

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/lib/i18n/context";
import type { Resume } from "@/lib/types";

interface ResumeViewerProps {
  resume: Resume;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Component để hiển thị nội dung file.
 * - Sử dụng <iframe> để hiển thị PDF.
 * - Sử dụng Google Docs Viewer để nhúng và hiển thị file .doc và .docx.
 * - Giữ lại Image component để hiển thị các định dạng ảnh làm fallback.
 */
export function FileRenderer({
  fileUrl,
  title,
}: {
  fileUrl: string;
  title: string;
}) {
  if (!fileUrl) {
    // Nếu không có URL, hiển thị một placeholder
    return (
      <div className="flex h-full w-full items-center justify-center bg-slate-800">
        <p className="text-slate-400">No file available</p>
      </div>
    );
  }

  const fileExtension = fileUrl.split(".").pop()?.toLowerCase();

  // Hiển thị PDF trực tiếp
  if (fileExtension === "pdf") {
    return (
      <iframe
        src={fileUrl}
        title={title}
        className="h-full w-full"
        frameBorder="0"
      />
    );
  }

  // Sử dụng Google Docs Viewer cho DOC và DOCX
  if (fileExtension === "doc" || fileExtension === "docx") {
    const googleViewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(
      fileUrl
    )}&embedded=true`;
    return (
      <iframe
        src={googleViewerUrl}
        title={title}
        className="h-full w-full"
        frameBorder="0"
      />
    );
  }

  // Fallback: Nếu là ảnh thì dùng Next/Image
  const imageExtensions = ["png", "jpg", "jpeg", "gif", "webp", "svg"];
  if (imageExtensions.includes(fileExtension || "")) {
    return (
      <Image
        src={fileUrl}
        alt={title}
        fill
        className="object-contain dark:bg-slate-800"
        priority
      />
    );
  }

  // Fallback cho các loại file không hỗ trợ xem trước
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-slate-800 text-center text-white">
      <p className="mb-4">
        Preview is not available for this file type (`.{fileExtension}`).
      </p>
      <Button asChild>
        <a href={fileUrl} download>
          Download File
        </a>
      </Button>
    </div>
  );
}

export function ResumeViewer({
  resume,
  open,
  onOpenChange,
}: ResumeViewerProps) {
  const { t } = useLanguage();
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!open) return null;

  const handleClose = () => {
    onOpenChange(false);
    if (isFullscreen) {
      setIsFullscreen(false); // Thoát fullscreen khi đóng
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Thêm nút đóng cho chế độ fullscreen
  const closeButton = (
    <Button
      variant="destructive"
      size="icon"
      onClick={handleClose}
      className="absolute top-4 right-4 z-10 h-10 w-10 rounded-full bg-black/50 text-white hover:bg-black/75"
      aria-label="Close viewer"
    >
      &times;
    </Button>
  );

  return (
    <div
      className={`${
        isFullscreen ? "fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" : ""
      }`}
    >
      {isFullscreen && closeButton}
      <Card
        className={`${
          isFullscreen
            ? "h-full w-full border-0 bg-transparent"
            : "dark:border-slate-600 dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-700 dark:shadow-xl dark:shadow-purple-900/30"
        }`}
      >
        <CardContent
          className={`p-4 ${isFullscreen ? "flex h-full flex-col" : ""}`}
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold dark:text-white dark:drop-shadow-sm">
              {resume.title}
            </h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleFullscreen}
                className="dark:border-indigo-500/50 dark:text-indigo-300 transition-colors dark:hover:bg-indigo-900/30 dark:hover:text-indigo-200"
              >
                {isFullscreen
                  ? t("common.exitFullscreen")
                  : t("common.fullscreen")}
              </Button>
              {!isFullscreen && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClose}
                  className="dark:border-indigo-500/50 dark:text-indigo-300 transition-colors dark:hover:bg-indigo-900/30 dark:hover:text-indigo-200"
                >
                  {t("common.close")}
                </Button>
              )}
            </div>
          </div>

          <div
            className={`relative rounded-md bg-slate-900/20 ${
              isFullscreen ? "flex-1" : "h-[600px]"
            }`}
          >
            <FileRenderer fileUrl={resume.fileUrl} title={resume.title} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ResumeViewer;
