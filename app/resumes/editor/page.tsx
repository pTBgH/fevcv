// app/dashboard/resumes/editor/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CVCard } from "@/components/resume/cv-card"; // CVCard mới hoặc CVCard hiện tại
import { ExtractedZone } from "@/components/resume/extracted-zone"; // Component để hiển thị và edit thông tin
import { ResumeViewer } from "@/components/resume/resume-viewer"; // Component hiển thị ảnh CV
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { 
  fetchResumes, 
  selectActiveResumes, 
  selectSelectedResumeId, 
  setSelectedResume as setSelectedResumeAction, // Đổi tên để tránh trùng
  updateResume,
  toggleFavorite as toggleFavoriteAction,
} from "@/lib/redux/slices/resumeSlice";
import { useLanguage } from "@/lib/i18n/context";
import { useToastContext } from "@/components/common/toast-provider";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Resume } from "@/lib/types";
import { FileText, Upload } from "lucide-react";


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

  const [isEditing, setIsEditing] = useState(false);
  const [selectedResumeForEditing, setSelectedResumeForEditing] = useState<Resume | null>(null);
  const [editedData, setEditedData] = useState<ExtractedData>({
    degree: "",
    technicalSkills: "",
    softSkills: "",
    experience: "",
  });

  // Fetch resumes on mount
  useEffect(() => {
    dispatch(fetchResumes());
  }, [dispatch]);

  // Effect để set selectedResumeForEditing khi resumes hoặc selectedResumeIdFromStore thay đổi
  useEffect(() => {
    const cvIdFromUrl = searchParams.get("cvId");
    const targetCvId = cvIdFromUrl || selectedResumeIdFromStore;

    if (targetCvId && allResumes.length > 0) {
      const foundResume = allResumes.find((r) => r.id === targetCvId);
      if (foundResume) {
        setSelectedResumeForEditing(foundResume);
        setEditedData(foundResume.data || { degree: "", technicalSkills: "", softSkills: "", experience: "" });
        // Dispatch action để cập nhật selectedResumeId trong store nếu nó đến từ URL và khác với store
        if (targetCvId !== selectedResumeIdFromStore) {
            dispatch(setSelectedResumeAction(targetCvId));
        }
      } else if (allResumes.length > 0 && !foundResume) {
        // Nếu cvId từ URL không hợp lệ, chọn cái đầu tiên
        setSelectedResumeForEditing(allResumes[0]);
        setEditedData(allResumes[0].data || { degree: "", technicalSkills: "", softSkills: "", experience: "" });
        dispatch(setSelectedResumeAction(allResumes[0].id));
      }
    } else if (allResumes.length > 0 && !targetCvId) {
      // Nếu không có cvId nào được chỉ định, chọn cái đầu tiên
      setSelectedResumeForEditing(allResumes[0]);
      setEditedData(allResumes[0].data || { degree: "", technicalSkills: "", softSkills: "", experience: "" });
      dispatch(setSelectedResumeAction(allResumes[0].id));
    }
  }, [allResumes, selectedResumeIdFromStore, searchParams, dispatch]);


  const handleSelectResume = useCallback((cv: Resume) => {
    setSelectedResumeForEditing(cv);
    setEditedData(cv.data || { degree: "", technicalSkills: "", softSkills: "", experience: "" });
    dispatch(setSelectedResumeAction(cv.id));
    setIsEditing(false); // Reset edit mode khi chuyển CV
    router.push(`/dashboard/resumes/editor?cvId=${cv.id}`, { scroll: false });
  }, [dispatch, router]);

  const handleEditToggle = () => setIsEditing(!isEditing);

  const handleDataChange = useCallback((field: string, value: string) => {
    setEditedData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSaveChanges = () => {
    if (selectedResumeForEditing) {
      dispatch(updateResume({ id: selectedResumeForEditing.id, data: { ...selectedResumeForEditing, data: editedData } }));
      toast({ title: t("resume.saveSuccess"), type: "success" });
      setIsEditing(false);
    }
  };

  const handleDiscardChanges = () => {
    if (selectedResumeForEditing) {
      setEditedData(selectedResumeForEditing.data || { degree: "", technicalSkills: "", softSkills: "", experience: "" });
    }
    setIsEditing(false);
  };
  
  const handleToggleFavorite = (id: string) => {
    dispatch(toggleFavoriteAction(id));
    const resume = allResumes.find(r => r.id === id);
    toast({
      title: resume?.isFavorite ? t("resume.removedFromFavorites") : t("resume.addedToFavorites"),
      type: "success",
    });
  };

  const handleUploadNew = () => {
    router.push('/upload');
  };

  if (resumesLoading && allResumes.length === 0) {
    return <div className="flex justify-center items-center h-screen">{t("common.loading")}</div>;
  }

  if (allResumes.length === 0 && !resumesLoading) {
     return (
      <div className="flex flex-col items-center justify-center h-screen p-4">
        <FileText size={64} className="text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold mb-2">{t("resume.noResumesFound")}</h2>
        <p className="text-gray-500 mb-6 text-center">{t("resume.uploadYourFirstResumeToEdit")}</p>
        <Button onClick={handleUploadNew}>
          <Upload className="mr-2 h-4 w-4" />
          {t("common.uploadResume")}
        </Button>
      </div>
    );
  }


  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden">
      <header className="bg-white dark:bg-gray-800 shadow-sm p-4 flex justify-between items-center shrink-0">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
          {t("dashboard.resumesEditor") || "Resumes Editor"}
        </h1>
        <div className="flex items-center gap-2">
         {isEditing ? (
            <>
              <Button variant="outline" onClick={handleDiscardChanges}>
                {t("common.cancel")}
              </Button>
              <Button onClick={handleSaveChanges}>
                {t("common.save")}
              </Button>
            </>
          ) : (
            selectedResumeForEditing && (
                 <Button onClick={handleEditToggle}>
                {t("common.edit")}
              </Button>
            )
          )}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar: List of Resumes */}
        <aside className="w-64 bg-gray-50 dark:bg-gray-800 p-4 border-r dark:border-gray-700 overflow-y-auto">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">{t("resume.yourResumes")}</h2>
             {/* Optional: Icons like delete all or favorite all if needed */}
          </div>
          <ScrollArea className="h-[calc(100vh-200px)] pr-2"> {/* Adjust height as needed */}
            <div className="space-y-2">
              {allResumes.map((cv) => (
                <CVCard
                  key={cv.id}
                  cv={cv}
                  isSelected={selectedResumeForEditing?.id === cv.id}
                  onSelect={() => handleSelectResume(cv)}
                  isFavorite={cv.isFavorite}
                  onToggleFavorite={(id) => {
                    // e.stopPropagation(); // Important to prevent select if user clicks only favorite
                    handleToggleFavorite(id);
                  }}
                  // Removed onRenameClick, onDuplicateClick, onDeleteClick, as they might not be needed here or handled by CVCard itself via context menu
                />
              ))}
            </div>
          </ScrollArea>
          <Button className="w-full mt-4" onClick={handleUploadNew}>
            <Upload className="mr-2 h-4 w-4" />
            {t("common.uploadResume")}
          </Button>
        </aside>

        {/* Middle Section: Extracted Information */}
        <main className="flex-1 p-6 overflow-y-auto bg-white dark:bg-gray-900">
          {selectedResumeForEditing ? (
            <ExtractedZone
              cvId={selectedResumeForEditing.id}
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

        {/* Right Sidebar: Resume Preview */}
        <aside className="w-1/3 bg-gray-50 dark:bg-gray-800 p-4 border-l dark:border-gray-700 overflow-hidden hidden lg:block">
          <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">
            {t("resume.yourUploadedFile")}
          </h2>
          {selectedResumeForEditing ? (
             <div className="h-[calc(100vh-120px)] relative"> {/* Adjust height as needed */}
                <ResumeViewer
                    resume={selectedResumeForEditing}
                    open={true} // Always open in this layout
                    onOpenChange={() => {}} // No need to change open state from here
                />
             </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              {t("resume.noCvSelected")}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}