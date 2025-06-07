"use client";

import type { DragEvent, ChangeEvent } from "react";
import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Upload, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/lib/i18n/context";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAppDispatch } from "@/lib/redux/hooks";
import { addResume } from "@/lib/redux/slices/resumeSlice";
import { useToastContext } from "@/components/common/toast-provider";
import { format } from "date-fns";
import { useAuth } from "@/hooks/use-auth";

const allowedFormats = ["pdf", "doc", "docx"];

export default function UploadPage() {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileMessage, setFileMessage] = useState<string>("");
  const [isValidFile, setIsValidFile] = useState(false);
  const { t } = useLanguage();
  const dispatch = useAppDispatch();
  const { toast } = useToastContext();
  const { isAuthenticated, isLoading, requireAuth } = useAuth();

  // Ensure `requireAuth` is always called, even if `isLoading` is true
  useEffect(() => {
    requireAuth();
  }, [requireAuth]);

  // Early return for loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Early return for unauthenticated state
  if (!isAuthenticated) {
    return null;
  }

  const validateFile = (file: File) => {
    const extension = file.name.split(".").pop()?.toLowerCase();
    return extension ? allowedFormats.includes(extension) : false;
  };

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files.length) {
        const selected = files[0];
        const isValid = validateFile(selected);
        setFile(selected);
        setIsValidFile(isValid);
        setFileMessage(
          isValid
            ? t("resume.fileUploadedSuccessfully")
            : t("resume.invalidFileFormat")
        );
      }
    },
    [t]
  );

  const handleFileSelect = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files?.length) {
        const selected = files[0];
        const isValid = validateFile(selected);
        setFile(selected);
        setIsValidFile(isValid);
        setFileMessage(
          isValid
            ? t("resume.fileUploadedSuccessfully")
            : t("resume.invalidFileFormat")
        );
      }
    },
    [t]
  );

  const handleAccept = () => {
    if (!isValidFile) {
      toast({
        title: t("toast.invalidFile"),
        description: t("toast.pleaseUploadValidFile"),
        type: "error",
      });
      return;
    }

    const newResume = {
      id: Date.now().toString(),
      title: format(new Date(), "MMM dd, yyyy"),
      date: format(new Date(), "MMM dd, yyyy"),
      fileType: file?.name.split(".").pop()?.toLowerCase() || "pdf",
      fileUrl: URL.createObjectURL(file as Blob),
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

    toast({
      title: t("toast.cvUploaded"),
      description: file?.name,
      type: "success",
    });

    router.push("/upload/review");
  };

  const handleDiscard = () => {
    setFile(null);
    setFileMessage("");
    setIsValidFile(false);
  };

  return (
    <div className="container mx-auto max-w-3xl py-8">
      <h1 className="text-2xl font-bold mb-6">
        {t("resume.uploadYourResume")}
      </h1>
      <Card className="p-8">
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 transition-colors ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-gray-200 dark:border-gray-700"
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
          {file ? (
            <div className="text-center">
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {file.name}
              </p>
              <p
                className={`mt-1 text-sm font-medium ${
                  isValidFile
                    ? "text-green-600 dark:text-green-500"
                    : "text-red-600 dark:text-red-500"
                }`}
              >
                {fileMessage}
              </p>

              {!isValidFile && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {t("resume.pleaseUploadValidFile")}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          ) : (
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
              <h3 className="mt-4 text-xl font-medium text-primary">
                {t("resume.dragFileOrClickToUpload")}
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {t("resume.supportForPdfDocDocx")}
              </p>
            </div>
          )}
        </div>

        {file && (
          <div className="mt-4 flex justify-end gap-4">
            <Button variant="outline" onClick={handleDiscard}>
              {t("common.discard")}
            </Button>
            <Button
              onClick={handleAccept}
              disabled={!isValidFile}
              className={!isValidFile ? "cursor-not-allowed" : ""}
            >
              {t("common.accept")}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
