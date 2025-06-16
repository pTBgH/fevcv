"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CVCard } from "@/components/resume/cv-card";
import { JobCard } from "@/components/job/job-card";
import { AnimatedButton } from "@/components/common/rolate-button";
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
import { MinimalNav } from "@/components/home/minimal-nav";

// Đổi tên component và export nó để có thể import ở file page.jsx
export function SuggestionsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { t } = useLanguage();

  // --- Lấy State từ Redux Store ---
  const suggestedJobs = useAppSelector(selectSuggestedJobs);
  const suggestionsLoading = useAppSelector(selectSuggestionsLoading);
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
        if (targetCvId !== selectedResumeIdFromStore) {
          dispatch(setSelectedResumeAction(targetCvId));
        }
      }
    }
  }, [allResumes, selectedResumeIdFromStore, searchParams, dispatch]);

  // --- Các hàm xử lý sự kiện ---
  const handleSelectResume = useCallback(
    (cv: Resume) => {
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
    const updatedJobs = suggestedJobs.filter((job) => job.id !== jobId);
    dispatch(setSuggestedJobs(updatedJobs));
  };

  const handleEdit = () => {
    if (selectedResumeForSuggestion) {
      router.push(`/resumes/edit?cvId=${selectedResumeForSuggestion.id}`);
    }
  };

  const handleUploadNew = () => {
    router.push("/");
  };

  // --- Logic phân trang ---
  const totalPages = Math.ceil(suggestedJobs.length / jobsPerPage);
  const currentJobs = suggestedJobs.slice(
    (currentPage - 1) * jobsPerPage,
    currentPage * jobsPerPage
  );

  // --- Logic Render ---
  if (resumesLoading && allResumes.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
        <span className="ml-2">{t("common.loading")}</span>
      </div>
    );
  }

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

  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden">
      <MinimalNav />
      <div className="mt-4 max-w-screen-2xl w-full mx-auto flex-1 flex overflow-hidden px-4">
        <div className="flex flex-1 overflow-hidden">
          <aside className="w-1/4 min-w-[300px] p-4 border-r dark:border-gray-700 overflow-y-auto flex flex-col">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3">
              {t("resume.yourResumes")}
            </h2>
            <div className="flex-grow overflow-y-auto pr-1 max-h-[300px] space-y-2">
              {allResumes.map((cv) => (
                <CVCard
                  key={cv.id}
                  cv={cv}
                  isSelected={selectedResumeForSuggestion?.id === cv.id}
                  onSelect={() => handleSelectResume(cv)}
                  onToggleFavorite={() => handleToggleResumeFavorite(cv.id)}
                />
              ))}
            </div>
            <div className="mt-4 space-y-2">
              <AnimatedButton
                className="w-full"
                onClick={handleEdit}
                variant="primary"
              >
                {t("resume.editResume")}
              </AnimatedButton>
              <AnimatedButton
                className="w-full"
                onClick={handleUploadNew}
                variant="primary"
              >
                {t("common.uploadNew")}
              </AnimatedButton>
            </div>
          </aside>

          <main className="flex-1 px-6 py-6 overflow-y-auto">
            {suggestionsLoading ? (
              <div className="flex items-center justify-between mb-4">
                <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
                <span className="ml-2 text-gray-500">{t("job.searchingForJobs")}</span>
              </div>
            ) : currentJobs.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
    </div>
  );
}