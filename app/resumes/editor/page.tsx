"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CVCard } from "@/components/resume/cv-card";
import { ExtractedZone } from "@/components/resume/extracted-zone";
import { FileRenderer } from "@/components/resume/resume-viewer";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  fetchResumes,
  selectActiveResumes,
  selectSelectedResumeId,
  setSelectedResume as setSelectedResumeAction,
  updateResume,
  toggleFavorite as toggleFavoriteAction,
  addResume,
} from "@/lib/redux/slices/resumeSlice";
import { setSuggestedJobs, setSuggestionsLoading, setSuggestionsError } from "@/lib/redux/slices/suggestionSlice";
import { useLanguage } from "@/lib/i18n/context";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { FileText, Upload, Loader2 } from "lucide-react";
import { MinimalNav } from "@/components/home/minimal-nav";
import type { Job, Resume } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AnimatedButton } from "@/components/common/rolate-button";
 

// Sửa lại interface này để nhất quán với backend và Redux
// Dùng snake_case như bạn đã yêu cầu
interface ExtractedData {
  degree: string;
  technical_skill: string;
  soft_skill: string;
  experience: string;
  file_path: string;
}

export default function ResumeEditorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { t } = useLanguage();
  const { data: session } = useSession();

  // Redux States
  const allResumes = useAppSelector(selectActiveResumes);
  const selectedResumeIdFromStore = useAppSelector(selectSelectedResumeId);
  const resumesLoading = useAppSelector((state) => state.resumes.loading);

  // Component States
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<ExtractedData>({
    degree: "",
    technical_skill: "",
    soft_skill: "",
    experience: "",
    file_path: "",
  });
  const [showNameDialog, setShowNameDialog] = useState(false);
  const [cvName, setCvName] = useState("");
  const [isSuggesting, setIsSuggesting] = useState(false);

  // Effect 1: Fetch resumes lần đầu
  useEffect(() => {
    if (allResumes.length === 0 && !resumesLoading) {
       dispatch(fetchResumes());
    }
  }, [dispatch, allResumes.length, resumesLoading]);

  // Effect 2: Đồng bộ CV được chọn từ URL và Redux
  useEffect(() => {
    const cvIdFromUrl = searchParams.get("cvId");
    
    // Ưu tiên cvId từ URL. Nếu không có, dùng ID từ store.
    const targetCvId = cvIdFromUrl || selectedResumeIdFromStore;

    // Nếu không có target nào cả thì thôi
    if (!targetCvId) {
      setSelectedResume(null); // Xóa CV đang chọn nếu không có target
      return;
    }

    // Tìm CV trong danh sách đã có
    const foundResume = allResumes.find((r) => r.id === targetCvId);
    
    // Cập nhật state của component
    // Chỉ cập nhật nếu foundResume khác với cái đang được chọn
    if (foundResume && foundResume.id !== selectedResume?.id) {
        setSelectedResume(foundResume);
        setEditedData(foundResume.data || { degree: "", technical_skill: "", soft_skill: "", experience: "", file_path: "" });
        setIsEditing(false);
    }

    // Đồng bộ ngược lại Redux store nếu URL có cvId
    if (cvIdFromUrl && cvIdFromUrl !== selectedResumeIdFromStore) {
        dispatch(setSelectedResumeAction(cvIdFromUrl));
    }
        
  }, [allResumes, selectedResumeIdFromStore, searchParams, dispatch, selectedResume?.id]);

  const handleSelectResume = useCallback((cvId: string) => {
    router.push(`/resumes/editor?cvId=${cvId}`, { scroll: false });
  }, [router]);

  const handleEditToggle = () => setIsEditing(!isEditing);

  const handleDataChange = useCallback((field: keyof ExtractedData, value: string) => {
    setEditedData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSaveChanges = () => {
    if (selectedResume) {
      const updatedData = { ...selectedResume, data: editedData, isNew: false };
      dispatch(updateResume({ id: selectedResume.id, data: updatedData }));
      setSelectedResume(updatedData);
      setIsEditing(false);
    }
  };

  const handleDiscardChanges = () => {
    if (selectedResume) {
      setEditedData(selectedResume.data || { degree: "", technical_skill: "", soft_skill: "", experience: "" });
    }
    setIsEditing(false);
  };

  const handleNameSubmit = () => {
    if (selectedResume) {
      const updatedData = { ...selectedResume, title: cvName, isNew: false };
      dispatch(updateResume({ id: selectedResume.id, data: updatedData }));
      setSelectedResume(updatedData);
      setShowNameDialog(false);
    }
  };

  const handleToggleFavorite = (id: string) => {
    // Tạm thời dùng action cũ, sau này sẽ chuyển sang async thunk
    dispatch(toggleFavoriteAction(id));
  };

  const handleUploadNew = () => router.push("/");

  const handleSuggest = async () => {
    if (!selectedResume || !session?.accessToken) {
        console.error("No resume selected or user not authenticated.");
        return;
    }

    setIsSuggesting(true);
    dispatch(setSuggestionsLoading());

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/resumes/${selectedResume.id}/suggest-jobs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${session.accessToken}`
            },
            // Gửi đi các trường với snake_case
            body: JSON.stringify({
                degree: editedData.degree,
                experience: editedData.experience,
                technical_skill: editedData.technical_skill,
                soft_skill: editedData.soft_skill,
                exp_years: selectedResume.exp_years || 0, // Đảm bảo trường này tồn tại trên Resume type
                fileUrl: selectedResume.fileUrl,
            })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Đã xảy ra lỗi khi gợi ý công việc.");
        }
        
        // === THÊM BƯỚC MAPPING DỮ LIỆU Ở ĐÂY ===
            const rawJobs = result.recommendations || [];
            
            const mappedJobs: Job[] = rawJobs.map((rawJob: any) => ({
                id: rawJob.id.toString(), // Đảm bảo ID là string
                title: rawJob.title,
                city: rawJob.city_name,
                district: rawJob.district_name,
                type: rawJob.job_type,
                minSalary: rawJob.salary_min,
                // maxSalary không có, sẽ là undefined
                deadline: rawJob.deadline,
                // Tính toán daysLeft từ deadline nếu cần, hoặc dùng days_since_open
                daysLeft: rawJob.days_since_open, // Hoặc tính toán từ deadline
                company: {
                    name: rawJob.company_name,
                    logo: `/placeholder.svg?text=${rawJob.company_name.charAt(0)}` // Tạo logo placeholder
                },
                score: rawJob.score,
                experience_years: rawJob.experience_years,
                // Các trường trạng thái mặc định
                isFavorite: false,
                isArchived: false,
                isHidden: false,
            }));

            // Dispatch dữ liệu ĐÃ ĐƯỢC MAPPED vào Redux store
            dispatch(setSuggestedJobs(mappedJobs));

            // Chuyển hướng đến trang suggestions
            router.push(`/resumes/suggestions?cvId=${selectedResume.id}`);

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Không thể lấy gợi ý công việc.";
        console.error("Failed to suggest jobs:", errorMessage);
        dispatch(setSuggestionsError(errorMessage));
    } finally {
        setIsSuggesting(false);
    }
  };

  if (resumesLoading && allResumes.length === 0) {
    return <div className="flex justify-center items-center h-screen">{t("common.loading")}</div>;
  }

  if (allResumes.length === 0 && !resumesLoading) {
    // ... JSX khi không có CV
  }

  return (
      <div className="min-h-screen flex flex-col">
    <div className="flex flex-col h-screen max-h-screen overflow-hidden bg-brand-background">
  <MinimalNav />
  
  <Dialog open={showNameDialog} onOpenChange={setShowNameDialog}>
    {/* ... JSX của Dialog ... */}
  </Dialog>

  <div className="flex flex-1 overflow-hidden">
    <aside className="w-1/4 min-w-[300px] p-4 border-r dark:border-gray-700 overflow-y-auto flex flex-col">
      <h2 className="text-lg font-semibold text-black mb-3">Your Resumes</h2>
      
  <div className="flex-grow overflow-y-auto pr-1 max-h-[300px]">
      <div className="space-y-2">
        {allResumes.map((cv) => (
          <CVCard
            key={cv.id}
            cv={cv}
            isSelected={selectedResume?.id === cv.id}
            onSelect={() => handleSelectResume(cv.id)}
            onToggleFavorite={() => handleToggleFavorite(cv.id)}
          />
        ))}
      </div>
    </div>
        <div className="mt-4 pt-4 border-t dark:border-gray-700 space-y-2">
        {/* === NÚT SUGGEST === */}
        <AnimatedButton
          className="w-full"
          onClick={handleSuggest}
          isLoading={isSuggesting}
          disabled={isSuggesting}
          loadingText={t("resume.suggestingJobs")}
          loadingIcon={<Loader2 className="h-4 w-4 animate-spin" />}
          variant="primary"
        >
          {t("resume.suggestJobs")}
        </AnimatedButton>

        {/* === NÚT UPLOAD === */}
        <AnimatedButton
          className="w-full"
          onClick={handleUploadNew}
          variant="primary"
        >
          {t("common.uploadNew")}
        </AnimatedButton>
      </div>
    </aside>

    <main className="flex-1 p-4 overflow-y-auto bg-brand-background dark:bg-gray-900 relative">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Resume Detail</h2>
      <div className="mt-4 flex gap-2">
        {isEditing ? (
          <>
            <Button variant="outline" onClick={handleDiscardChanges}>{t("common.cancel")}</Button>
            <Button onClick={handleSaveChanges}>{t("common.save")}</Button>
          </>
        ) : (
          <Button onClick={handleEditToggle}>{t("common.edit")}</Button>
        )}
      </div>
      {selectedResume ? (
        <>
          <ExtractedZone
            customData={editedData}
            isEditing={isEditing}
            onDataChange={handleDataChange}
          />
    
        </>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500">
          {t("resume.selectAResumeToViewOrEdit")}
        </div>
      )}
    </main>
    <aside className="w-1/3 bg-brand-background p-4 border-l dark:border-gray-700 overflow-hidden hidden lg:block">
      <h2 className="text-lg font-semibold mb-4 text-black">Your uploaded file</h2>
      {selectedResume ? (
        <div className="h-[calc(100vh-120px)] relative rounded-lg border dark:border-gray-700 overflow-hidden">
          <div className="p-4">
            <img src={selectedResume.profileImage} alt="Profile" className="w-16 h-16 rounded-full mb-2" />
            <h3 className="text-md font-semibold">Nguyễn Trò Quyền My</h3>
            <p className="text-sm text-gray-600">Bình Thạnh, Hồ Chí Minh</p>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500">{t("resume.noCvSelected")}</div>
      )}
    </aside>
  </div>
</div>
</div>
  );
}