// app/resumes/suggestions/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CVCard } from "@/components/resume/cv-card";
import { JobCard } from "@/components/job/job-card"; // Sử dụng JobCard đã có
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  fetchResumes,
  selectActiveResumes,
  selectSelectedResumeId,
  setSelectedResume as setSelectedResumeAction, // Đổi tên
  toggleFavorite as toggleFavoriteAction,
} from "@/lib/redux/slices/resumeSlice";
import {
  toggleFavorite as toggleJobFavoriteAction,
  toggleArchived as toggleJobArchivedAction,
  // toggleHidden đã có sẵn, nếu cần
} from "@/lib/redux/slices/jobActionsSlice"; // Import actions cho job
import { useLanguage } from "@/lib/i18n/context";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getFilteredJobs } from "@/lib/job-service"; // Để lấy job
import type { Job, Resume } from "@/lib/types";
import suggestedJobsData from "@/data/suggested-jobs.json";
import { Pagination } from "@/components/common/pagination";
import { FileText, Search, Upload } from "lucide-react";

export default function JobSuggestionsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { t } = useLanguage();

  const allResumes = useAppSelector(selectActiveResumes);
  const selectedResumeIdFromStore = useAppSelector(selectSelectedResumeId);
  const resumesLoading = useAppSelector((state) => state.resumes.loading);

  const allJobs = getFilteredJobs(); // Lấy tất cả jobs không ẩn

  const [selectedResumeForSuggestion, setSelectedResumeForSuggestion] =
    useState<Resume | null>(null);
  const [suggestedJobs, setSuggestedJobs] = useState<Job[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 9; // Số job hiển thị mỗi trang

  // Fetch resumes
  useEffect(() => {
    dispatch(fetchResumes());
  }, [dispatch]);

  // Set selected resume and load suggestions
  useEffect(() => {
    const cvIdFromUrl = searchParams.get("cvId");
    const targetCvId = cvIdFromUrl || selectedResumeIdFromStore;

    if (allResumes.length > 0 && targetCvId) {
      const foundResume = allResumes.find((r) => r.id === targetCvId);
      if (foundResume) {
        // Only update if the current selected resume is different
        if (
          !selectedResumeForSuggestion ||
          selectedResumeForSuggestion.id !== foundResume.id
        ) {
          setSelectedResumeForSuggestion(foundResume);
          if (targetCvId !== selectedResumeIdFromStore) {
            dispatch(setSelectedResumeAction(targetCvId));
          }
        }
      } else {
        if (
          !selectedResumeForSuggestion ||
          selectedResumeForSuggestion.id !== allResumes[0].id
        ) {
          setSelectedResumeForSuggestion(allResumes[0]);
          dispatch(setSelectedResumeAction(allResumes[0].id));
        }
      }
    } else if (allResumes.length > 0 && !targetCvId) {
      if (
        !selectedResumeForSuggestion ||
        selectedResumeForSuggestion.id !== allResumes[0].id
      ) {
        setSelectedResumeForSuggestion(allResumes[0]);
        dispatch(setSelectedResumeAction(allResumes[0].id));
      }
    }
  }, [allResumes, selectedResumeIdFromStore, searchParams, dispatch]);

  // Load suggested jobs when selectedResumeForSuggestion changes
  useEffect(() => {
    if (selectedResumeForSuggestion) {
      // Lấy job IDs từ file JSON (hoặc API sau này)
      const suggestedJobIds: string[] =
        (suggestedJobsData as Record<string, string[]>)[
          selectedResumeForSuggestion.id
        ] || [];

      // Lọc ra các jobs tương ứng từ `allJobs`
      const jobs = suggestedJobIds
        .map((id) => allJobs.find((job) => job.id === id))
        .filter((job) => job !== undefined) as Job[];
      setSuggestedJobs(jobs);
      setCurrentPage(1); // Reset về trang 1 khi CV thay đổi
    } else {
      setSuggestedJobs([]); // Không có CV được chọn, không có gợi ý
    }
  }, [selectedResumeForSuggestion, allJobs]);

  const handleSelectResume = useCallback(
    (cv: Resume) => {
      setSelectedResumeForSuggestion(cv);
      dispatch(setSelectedResumeAction(cv.id));
      router.push(`/resumes/suggestions?cvId=${cv.id}`, { scroll: false });
    },
    [dispatch, router]
  );

  const handleToggleResumeFavorite = (id: string) => {
    dispatch(toggleFavoriteAction(id));
  };

  // Handlers for JobCard actions (sử dụng jobActionsSlice)
  const handleToggleJobFavorite = (jobId: number) => {
    dispatch(toggleJobFavoriteAction(jobId));
  };
  const handleToggleJobArchived = (jobId: number) => {
    dispatch(toggleJobArchivedAction(jobId));
  };
  const handleHideJob = (jobId: number) => {
    // Giả sử bạn có action toggleHidden trong jobActionsSlice
    // dispatch(toggleHidden(jobId));
    // Sau khi ẩn, bạn có thể muốn load lại danh sách suggestedJobs
    setSuggestedJobs((prevJobs) =>
      prevJobs.filter((job) => job.id !== jobId.toString())
    );
  };

  const totalPages = Math.ceil(suggestedJobs.length / jobsPerPage);
  const currentJobs = suggestedJobs.slice(
    (currentPage - 1) * jobsPerPage,
    currentPage * jobsPerPage
  );

  const handleUploadNew = () => {
    router.push("/upload");
  };

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
          {t("resume.uploadToGetSuggestions")}
        </p>
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
          {t("dashboard.jobSuggestions") || "Job Suggestions"}
          {selectedResumeForSuggestion &&
            ` ${t("common.for")} ${selectedResumeForSuggestion.title}`}
        </h1>
        <Button onClick={() => router.push("/search")}>
          {t("common.goToSearchPage") || "Advanced Search"}
        </Button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar: List of Resumes */}
        <aside className="w-64 bg-gray-50 dark:bg-gray-800 p-4 border-r dark:border-gray-700 overflow-y-auto">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
              {t("resume.yourResumes")}
            </h2>
          </div>
          <ScrollArea className="h-[calc(100vh-200px)] pr-2">
            {" "}
            {/* Adjust height as needed */}
            <div className="space-y-2">
              {allResumes.map((cv) => (
                <CVCard
                  key={cv.id}
                  cv={cv}
                  isSelected={selectedResumeForSuggestion?.id === cv.id}
                  onSelect={() => handleSelectResume(cv)}
                  isFavorite={cv.isFavorite}
                  onToggleFavorite={handleToggleResumeFavorite}
                  // Các props khác của CVCard nếu cần
                />
              ))}
            </div>
          </ScrollArea>
          <Button className="w-full mt-4" onClick={handleUploadNew}>
            <Upload className="mr-2 h-4 w-4" />
            {t("common.uploadResume")}
          </Button>
        </aside>

        {/* Main Content: Suggested Jobs Grid */}
        <main className="flex-1 p-6 overflow-y-auto bg-white dark:bg-gray-900">
          {selectedResumeForSuggestion ? (
            currentJobs.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                  {currentJobs.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      onFavorite={() => handleToggleJobFavorite(Number(job.id))}
                      onArchive={() => handleToggleJobArchived(Number(job.id))}
                      onHide={() => handleHideJob(Number(job.id))}
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
                <p className="text-lg">{t("job.noSuggestionsForCv")}</p>
                <p className="text-sm text-gray-400">
                  {t("job.tryAnotherCvOrSearch")}
                </p>
                <Button className="mt-4" onClick={() => router.push("/search")}>
                  {t("common.searchJobs")}
                </Button>
              </div>
            )
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <FileText size={48} className="mb-4 text-gray-400" />
              <p>{t("resume.selectAResumeToSeeSuggestions")}</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
