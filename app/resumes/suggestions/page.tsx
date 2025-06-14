"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CVCard } from "@/components/resume/cv-card";
import { JobCard } from "@/components/job/job-card";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  fetchResumes,
  selectActiveResumes,
  selectSelectedResumeId,
  setSelectedResume as setSelectedResumeAction,
  toggleFavorite as toggleFavoriteAction,
} from "@/lib/redux/slices/resumeSlice";
import {
  toggleFavorite as toggleJobFavoriteAction,
  toggleArchived as toggleJobArchivedAction,
} from "@/lib/redux/slices/jobActionsSlice";
import { setSuggestedJobs, selectSuggestedJobs, selectSuggestionsLoading } from "@/lib/redux/slices/suggestionSlice";
import { useLanguage } from "@/lib/i18n/context";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Pagination } from "@/components/common/pagination";
import { FileText, Search, Upload, Loader2 } from "lucide-react";
import type { Job, Resume } from "@/lib/types";

export default function JobSuggestionsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { t } = useLanguage();

  // --- Lấy State từ Redux Store ---
  // Dữ liệu gợi ý
  const suggestedJobs = useAppSelector(selectSuggestedJobs);
  const suggestionsLoading = useAppSelector(selectSuggestionsLoading);

  // Dữ liệu Resumes
  const allResumes = useAppSelector(selectActiveResumes);
  const selectedResumeIdFromStore = useAppSelector(selectSelectedResumeId);
  const resumesLoading = useAppSelector((state) => state.resumes.loading);

  // --- State cục bộ của Component ---
  const [selectedResumeForSuggestion, setSelectedResumeForSuggestion] = useState<Resume | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 9;

  // Effect 1: Fetch danh sách resumes nếu chưa có
  useEffect(() => {
    if (allResumes.length === 0 && !resumesLoading) {
      dispatch(fetchResumes());
    }
  }, [dispatch, allResumes.length, resumesLoading]);

  // Effect 2: Xác định CV nào đang được chọn dựa trên URL hoặc state trong Redux
  useEffect(() => {
    const cvIdFromUrl = searchParams.get("cvId");
    const targetCvId = cvIdFromUrl || selectedResumeIdFromStore;

    if (allResumes.length > 0 && targetCvId) {
      const foundResume = allResumes.find((r) => r.id === targetCvId);
      if (foundResume) {
        setSelectedResumeForSuggestion(foundResume);
        // Đồng bộ lại Redux store nếu cần
        if (targetCvId !== selectedResumeIdFromStore) {
          dispatch(setSelectedResumeAction(targetCvId));
        }
      }
    }
  }, [allResumes, selectedResumeIdFromStore, searchParams, dispatch]);

  // --- Các hàm xử lý sự kiện ---

  const handleSelectResume = useCallback(
    (cv: Resume) => {
      // Khi người dùng chọn CV khác, ta sẽ đi lấy gợi ý mới
      // Cách đơn giản là điều hướng về trang editor để người dùng nhấn "Suggest" lại
      router.push(`/resumes/editor?cvId=${cv.id}`);
    },
    [router]
  );

  const handleToggleResumeFavorite = (id: string) => {
    dispatch(toggleFavoriteAction(id));
  };

  const handleToggleJobFavorite = (jobId: string) => {
    dispatch(toggleJobFavoriteAction(jobId));
  };

  const handleToggleJobArchived = (jobId: string) => {
    dispatch(toggleJobArchivedAction(jobId));
  };

  const handleHideJob = (jobId: string) => {
    // Tạm thời ẩn job ở client-side để có phản hồi ngay lập tức
    const updatedJobs = suggestedJobs.filter((job) => job.id !== jobId);
    dispatch(setSuggestedJobs(updatedJobs));
    // Bạn có thể dispatch một action khác để ẩn vĩnh viễn nếu cần
    // dispatch(toggleHidden(jobId));
  };

  // --- Logic phân trang ---
  const totalPages = Math.ceil(suggestedJobs.length / jobsPerPage);
  const currentJobs = suggestedJobs.slice(
    (currentPage - 1) * jobsPerPage,
    currentPage * jobsPerPage
  );

  // --- Logic Render ---

  // Trường hợp đang tải danh sách CV ban đầu
  if (resumesLoading && allResumes.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
        <span className="ml-2">{t("common.loading")}</span>
      </div>
    );
  }

  // Trường hợp không có CV nào trong hệ thống
  if (allResumes.length === 0 && !resumesLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4 text-center">
        <FileText size={64} className="text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold mb-2">{t("resume.noResumesFound")}</h2>
        <p className="text-gray-500 mb-6">{t("resume.uploadToGetSuggestions")}</p>
        <Button onClick={() => router.push("/")}>
          <Upload className="mr-2 h-4 w-4" />
          {t("common.uploadResume")}
        </Button>
      </div>
    );
  }

  // Giao diện chính
  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden">
      <header className="bg-white dark:bg-gray-800 shadow-sm p-4 flex justify-between items-center shrink-0">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white truncate">
          {t("dashboard.jobSuggestions") || "Job Suggestions"}
          {selectedResumeForSuggestion && ` ${t("common.for")} ${selectedResumeForSuggestion.title}`}
        </h1>
        <Button onClick={() => router.push("/search")}>
          {t("common.goToSearchPage") || "Advanced Search"}
        </Button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar trái: Danh sách CV */}
        <aside className="w-64 bg-gray-50 dark:bg-gray-800 p-4 border-r dark:border-gray-700 overflow-y-auto flex flex-col">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3">
            {t("resume.yourResumes")}
          </h2>
          <ScrollArea className="flex-grow pr-2">
            <div className="space-y-2">
              {allResumes.map((cv) => (
                <CVCard
                  key={cv.id}
                  cv={cv}
                  isSelected={selectedResumeForSuggestion?.id === cv.id}
                  onSelect={() => handleSelectResume(cv)}
                  isFavorite={cv.isFavorite}
                  onToggleFavorite={() => handleToggleResumeFavorite(cv.id)}
                />
              ))}
            </div>
          </ScrollArea>
          <Button className="w-full mt-4" onClick={() => router.push("/")}>
            <Upload className="mr-2 h-4 w-4" />
            {t("common.uploadResume")}
          </Button>
        </aside>

        {/* Nội dung chính: Lưới các công việc gợi ý */}
        <main className="flex-1 p-6 overflow-y-auto bg-white dark:bg-gray-900">
          {suggestionsLoading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
              <span className="ml-2 text-gray-500">{t("job.searchingForJobs")}</span>
            </div>
          ) : currentJobs.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {currentJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onFavorite={() => handleToggleJobFavorite(job.id)}
                    onArchive={() => handleToggleJobArchived(job.id)}
                    onHide={() => handleHideJob(job.id)}
                  />
                ))}
              </div>
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <Search size={48} className="mb-4 text-gray-400" />
              <p className="text-lg font-semibold">{t("job.noSuggestionsForCv")}</p>
              <p className="text-sm text-gray-400 mt-1">{t("job.tryAnotherCvOrSearch")}</p>
              <Button className="mt-4" onClick={() => router.push("/search")}>
                {t("common.searchJobs")}
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}