"use client";

import { useState, useEffect, useCallback } from "react";
import { JobCard } from "@/components/job/job-card";
import { Pagination } from "@/components/common/pagination";
import { Loader } from "@/components/Loader";
import {
  getAllJobs,
  getFavoriteJobs,
  getArchivedJobs,
} from "@/lib/job-service";
import { useLanguage } from "@/lib/i18n/context";
import { useReduxToast } from "@/hooks/use-redux-toast";
import type { Job } from "@/lib/types";
import type { DisplayMode } from "@/components/job/display-mode-selector";

interface JobGridProps {
  type?: "all" | "favorite" | "archived" | "hidden";
  itemsPerPage?: number;
  searchTerm?: string;
  filters?: Record<string, any>;
  displayMode?: DisplayMode;
  jobs: Job[]; // <-- added property
}

export function JobGrid({
  type = "all",
  itemsPerPage = 6,
  searchTerm = "",
  filters = {},
  displayMode = { columns: 3, rows: 2 },
  jobs: initialJobs, // <-- accept jobs as a prop
}: JobGridProps) {
  const { t } = useLanguage();
  const { toast } = useReduxToast();
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [removedJobIds, setRemovedJobIds] = useState<number[]>([]);
  const [lastFetchParams, setLastFetchParams] = useState({
    type,
    searchTerm,
    filters,
  });

  // Memoize the fetch function to avoid infinite loops
  const fetchJobs = useCallback(async () => {
    try {
      let fetchedJobs: Job[] = [];

      switch (type) {
        case "favorite":
          fetchedJobs = getFavoriteJobs();
          console.log("Fetched favorite jobs:", fetchedJobs.length);
          break;
        case "archived":
          fetchedJobs = getArchivedJobs();
          console.log("Fetched archived jobs:", fetchedJobs.length);
          break;
        default:
          fetchedJobs = getAllJobs();
          console.log("Fetched all jobs:", fetchedJobs.length);
      }

      // Apply search filter if provided
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        fetchedJobs = fetchedJobs.filter(
          (job) =>
            job.title.toLowerCase().includes(term) ||
            (job.company.name &&
              job.company.name.toLowerCase().includes(term)) ||
            (job.city && job.city.toLowerCase().includes(term)) ||
            job.category.toLowerCase().includes(term)
        );
      }

      // Apply additional filters
      if (Object.keys(filters).length > 0) {
        fetchedJobs = fetchedJobs.filter((job) => {
          let match = true;

          // Check each filter
          for (const [key, value] of Object.entries(filters)) {
            if (value && job[key as keyof Job] !== value) {
              match = false;
              break;
            }
          }

          return match;
        });
      }

      console.log(`Setting ${fetchedJobs.length} jobs for type ${type}`);
      setJobs(fetchedJobs);
    } catch (error) {
      console.error(`Error fetching ${type} jobs:`, error);
      toast({
        title: t("common.error"),
        description: t("job.errorFetchingJobs"),
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [type, searchTerm, filters, t, toast]);

  useEffect(() => {
    // Only fetch if params have changed
    const paramsChanged =
      type !== lastFetchParams.type ||
      searchTerm !== lastFetchParams.searchTerm ||
      JSON.stringify(filters) !== JSON.stringify(lastFetchParams.filters);

    if (paramsChanged) {
      setLoading(true);
      fetchJobs();
      setLastFetchParams({ type, searchTerm, filters });
    }
  }, [type, searchTerm, filters, fetchJobs, lastFetchParams]);

  // Force fetch on initial load
  useEffect(() => {
    fetchJobs();
  }, []);

  const handleFavorite = useCallback(
    (id: number) => {
      if (type === "favorite") {
        setRemovedJobIds((prev) => [...prev, id]);
      }
    },
    [type]
  );

  const handleArchive = useCallback(
    (id: number) => {
      if (type === "archived") {
        setRemovedJobIds((prev) => [...prev, id]);
      }
    },
    [type]
  );

  const handleHide = useCallback((id: number) => {
    setRemovedJobIds((prev) => [...prev, id]);
  }, []);

  if (loading) {
    return <Loader />;
  }

  // Filter out removed jobs
  const filteredJobs = jobs.filter(
    (job) => !removedJobIds.includes(Number(job.id))
  );

  if (filteredJobs.length === 0) {
    return (
      <div className="bg-white rounded-lg border p-8 text-center">
        <p className="text-gray-500">
          {type === "favorite"
            ? t("dashboard.noFavoriteJobs")
            : type === "archived"
            ? t("dashboard.noArchivedJobs")
            : t("job.noJobsFound")}
        </p>
      </div>
    );
  }

  // Pagination logic
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedJobs = filteredJobs.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Determine grid columns based on displayMode
  const gridColsClass =
    displayMode.columns === 1
      ? "grid-cols-1"
      : displayMode.columns === 2
      ? "grid-cols-1 md:grid-cols-2"
      : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";

  return (
    <div className="space-y-6">
      <div className={`grid ${gridColsClass} gap-4 auto-rows-fr`}>
        {paginatedJobs.map((job) => (
          <JobCard
            key={job.id}
            job={{
              ...job,
              company: {
                name: job.company?.name || `Company ${job.id}`,
                logo:
                  job.company?.logo || "/placeholder.svg?height=64&width=64",
              },
            }}
            type={type}
            onFavorite={handleFavorite}
            onArchive={handleArchive}
            onHide={handleHide}
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
    </div>
  );
}
