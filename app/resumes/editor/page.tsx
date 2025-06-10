"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CVCard } from "@/components/resume/cv-card";
import { ExtractedZone } from "@/components/resume/extracted-zone";
// Import trực tiếp FileRenderer thay vì ResumeViewer
import { FileRenderer } from "@/components/resume/resume-viewer";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  fetchResumes,
  selectActiveResumes,
  selectSelectedResumeId,
  setSelectedResume as setSelectedResumeAction,
  updateResume,
  toggleFavorite as toggleFavoriteAction,
} from "@/lib/redux/slices/resumeSlice";
import { useLanguage } from "@/lib/i18n/context";
import { useToastContext } from "@/components/common/toast-provider";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Resume } from "@/lib/types";
import { FileText, Upload } from "lucide-react";
import { MinimalNav } from "@/components/home/minimal-nav";

interface ExtractedData {
  degree: string;
  technicalSkills: string;
  softSkills: string;
  experience: string;
}

export default function ResumeEditorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { t } = useLanguage();
  const { toast } = useToastContext();

  const allResumes = useAppSelector(selectActiveResumes);
  const selectedResumeIdFromStore = useAppSelector(selectSelectedResumeId);
  const resumesLoading = useAppSelector((state) => state.resumes.loading);

  // State chính của trang để biết CV nào đang được chọn
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);

  // State cho việc chỉnh sửa
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<ExtractedData>({
    degree: "",
    technicalSkills: "",
    softSkills: "",
    experience: "",
  });

  // Fetch resumes khi component được mount
  useEffect(() => {
    dispatch(fetchResumes());
  }, [dispatch]);

  // Effect để xác định CV nào sẽ được hiển thị
  useEffect(() => {
    if (allResumes.length === 0) return;

    const cvIdFromUrl = searchParams.get("cvId");
    const targetCvId =
      cvIdFromUrl || selectedResumeIdFromStore || allResumes[0]?.id;

    const foundResume = allResumes.find((r) => r.id === targetCvId);
    const resumeToShow = foundResume || allResumes[0];

    if (resumeToShow) {
      setSelectedResume(resumeToShow);
      setEditedData(
        resumeToShow.data || {
          degree: "",
          technicalSkills: "",
          softSkills: "",
          experience: "",
        }
      );

      // Cập nhật Redux store nếu cần
      if (resumeToShow.id !== selectedResumeIdFromStore) {
        dispatch(setSelectedResumeAction(resumeToShow.id));
      }
    }
  }, [allResumes, selectedResumeIdFromStore, searchParams, dispatch]);

  const handleSelectResume = useCallback(
    (cv: Resume) => {
      setSelectedResume(cv);
      setEditedData(
        cv.data || {
          degree: "",
          technicalSkills: "",
          softSkills: "",
          experience: "",
        }
      );
      dispatch(setSelectedResumeAction(cv.id));
      setIsEditing(false); // Reset chế độ edit khi chuyển CV
      router.push(`/resumes/editor?cvId=${cv.id}`, { scroll: false });
    },
    [dispatch, router]
  );

  // Các hàm xử lý sự kiện
  const handleEditToggle = () => setIsEditing(!isEditing);

  const handleDataChange = useCallback((field: string, value: string) => {
    setEditedData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSaveChanges = () => {
    if (selectedResume) {
      dispatch(
        updateResume({
          id: selectedResume.id,
          data: { ...selectedResume, data: editedData },
        })
      );
      toast({ title: t("resume.saveSuccess"), type: "success" });
      setIsEditing(false);
    }
  };

  const handleDiscardChanges = () => {
    if (selectedResume) {
      setEditedData(
        selectedResume.data || {
          degree: "",
          technicalSkills: "",
          softSkills: "",
          experience: "",
        }
      );
    }
    setIsEditing(false);
  };

  const handleToggleFavorite = (id: string) => {
    dispatch(toggleFavoriteAction(id));
  };

  const handleUploadNew = () => router.push("/upload");
  const handleSuggest = () => router.push("/resumes/suggestions");

  // Các trạng thái loading và không có resume
  if (resumesLoading && allResumes.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        {t("common.loading")}
      </div>
    );
  }

  if (allResumes.length === 0 && !resumesLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4">
        <FileText size={64} className="text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold mb-2">
          {t("resume.noResumesFound")}
        </h2>
        <p className="text-gray-500 mb-6 text-center">
          {t("resume.uploadYourFirstResumeToEdit")}
        </p>
        <Button onClick={handleUploadNew}>
          <Upload className="mr-2 h-4 w-4" />
          {t("common.uploadResume")}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden bg-brand-background">
      <MinimalNav />
      {/* Thanh công cụ đã được đơn giản hóa */}
      <div className="flex items-center gap-2 p-4 border-b dark:border-gray-700">
        {isEditing ? (
          <>
            <Button variant="outline" onClick={handleDiscardChanges}>
              {t("common.cancel")}
            </Button>
            <Button onClick={handleSaveChanges}>{t("common.save")}</Button>
          </>
        ) : (
          selectedResume && (
            <Button onClick={handleEditToggle}>{t("common.edit")}</Button>
          )
        )}
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* === Cột trái: Danh sách CV === */}
        <aside className="w-100 p-4 dark:border-gray-700 overflow-y-auto">
          <h2 className="text-lg font-semibold text-black mb-3">
            {t("resume.yourResumes")}
          </h2>
          <ScrollArea className="h-[calc(100vh-280px)] pr-5">
            <div className="space-y-2">
              {allResumes.map((cv) => (
                <CVCard
                  key={cv.id}
                  cv={cv}
                  isSelected={selectedResume?.id === cv.id}
                  onSelect={() => handleSelectResume(cv)}
                  isFavorite={cv.isFavorite}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
          </ScrollArea>
          <Button
            className="w-full mt-4 bg-black text-white hover:bg-brand-dark-gray"
            onClick={handleUploadNew}
          >
            <Upload className="mr-2 h-4 w-4" />
            {t("common.uploadResume")}
          </Button>
          <Button
            className="w-full mt-2 bg-black text-white hover:bg-brand-dark-gray"
            onClick={handleSuggest}
          >
            Suggest
          </Button>
        </aside>

        {/* === Cột giữa: Thông tin trích xuất === */}
        <main className="flex-1 p-6 overflow-y-auto bg-white dark:bg-gray-900">
          {selectedResume ? (
            <ExtractedZone
              cvId={selectedResume.id}
              customData={editedData}
              isEditing={isEditing}
              onDataChange={handleDataChange}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              {t("resume.selectAResumeToViewOrEdit")}
            </div>
          )}
        </main>

        {/* === Cột phải: Hiển thị file CV (ĐÃ ĐƠN GIẢN HÓA) === */}
        <aside className="w-1/3 bg-white p-4 border-l dark:border-gray-700 overflow-hidden hidden lg:block">
          <h2 className="text-lg font-semibold mb-4 text-black">
            {t("resume.yourUploadedFile")}
          </h2>
          {selectedResume ? (
            <div className="h-[calc(100vh-120px)] relative rounded-lg border dark:border-gray-700 overflow-hidden">
              <FileRenderer
                fileUrl={selectedResume.fileUrl}
                title={selectedResume.title}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-brand-dark-gray">
              {t("resume.noCvSelected")}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
