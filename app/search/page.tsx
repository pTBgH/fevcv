"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Search, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchFilters } from "@/components/job/search-filters";
import { JobCard } from "@/components/job/job-card";
import { getFilteredJobs, toggleJobAction } from "@/lib/job-service";
import type { Job } from "@/lib/types";
import { ResumeSelector } from "@/components/resume/resume-selector";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/lib/i18n/context";
import { Pagination } from "@/components/common/pagination";
import { CompanyCard } from "@/components/cards/company-card";
import {
  DisplayModeSelector,
  type DisplayMode,
} from "@/components/job/display-mode-selector";
import { useIsMobile } from "@/hooks/use-mobile";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { FilterBar } from "@/components/job/filter-bar";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const cvId = searchParams.get("cvId");
  const cvDate = searchParams.get("cvDate");
  const initialQuery = searchParams.get("q") || "";
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const type = searchParams.get("type");
  const view = searchParams.get("view");

  const [selectedResumeId, setSelectedResumeId] = useState<string | undefined>(
    undefined
  );
  const [selectedDate, setSelectedDate] = useState<string | undefined>(
    undefined
  );
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [location, setLocation] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filters, setFilters] = useState<{
    types?: string[];
    locations?: string[];
    categories?: string[];
    minSalary?: number;
    maxSalary?: number;
  }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const [displayMode, setDisplayMode] = useState<DisplayMode>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("jobDisplayMode");
      if (saved) {
        try {
          return JSON.parse(saved) as DisplayMode;
        } catch (e) {
          // Ignore parse errors
        }
      }
    }
    return { columns: 3, rows: 2 };
  });

  const effectiveItemsPerPage = useMemo(() => {
    return 12;
  }, []);
  const itemsPerPage = effectiveItemsPerPage;

  let pageTitle = t("search.findYourDreamJob");

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("jobDisplayMode", JSON.stringify(displayMode));
    }
  }, [displayMode]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node) &&
        showMobileFilters
      ) {
        setShowMobileFilters(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMobileFilters]);

  useEffect(() => {
    if (mode === "suggest" && cvId) {
      setSelectedResumeId(cvId);
      setSelectedDate(cvDate ? decodeURIComponent(cvDate) : undefined);
    }

    const allJobs = getFilteredJobs(initialQuery);
    let filteredJobs = allJobs;
    if (type === "featured") {
      filteredJobs = allJobs.slice(0, 12);
      pageTitle = t("home.featuredJobs");
    } else if (type === "latest") {
      filteredJobs = allJobs.slice(-12);
      pageTitle = t("home.latestJobs");
    }

    setJobs(filteredJobs);
    setIsLoading(false);
  }, [mode, cvId, cvDate, initialQuery, t, type]);

  const handleSearch = () => {
    setIsLoading(true);
    const filteredJobs = getFilteredJobs(searchTerm, {
      city: location || undefined,
      ...filters,
    });
    setJobs(filteredJobs);
    setCurrentPage(1);
    setIsLoading(false);

    if (showMobileFilters) {
      setShowMobileFilters(false);
    }
  };

  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [locationFilter, setLocationFilter] = useState<string[]>([]);
  const [jobTypeFilter, setJobTypeFilter] = useState<string[]>([]);
  const [experienceFilter, setExperienceFilter] = useState<string[]>([]);
  const [postedDateFilter, setPostedDateFilter] = useState<string[]>([]);
  const [salaryFilter, setSalaryFilter] = useState<{ min?: number; max?: number }>({});

  const handleFilterChange = (type: string, value: any) => {
    switch (type) {
      case "category":
        setCategoryFilter(value);
        break;
      case "location":
        setLocationFilter(value);
        break;
      case "jobType":
        setJobTypeFilter(value);
        break;
      case "experience":
        setExperienceFilter(value);
        break;
      case "postedDate":
        setPostedDateFilter(value);
        break;
      case "salary":
        setSalaryFilter(value);
        break;
    }
  };

  const combinedFilters = useMemo(
    () => ({
      categories: categoryFilter.length ? categoryFilter : undefined,
      locations: locationFilter.length ? locationFilter : undefined,
      types: jobTypeFilter.length ? jobTypeFilter : undefined,
      experience: experienceFilter.length ? experienceFilter : undefined,
      postedDate: postedDateFilter.length ? postedDateFilter : undefined,
      minSalary: salaryFilter.min,
      maxSalary: salaryFilter.max,
    }),
    [categoryFilter, locationFilter, jobTypeFilter, experienceFilter, postedDateFilter, salaryFilter]
  );

  const handleResumeSelect = (id: string | null) => {
    setSelectedResumeId(id || undefined);
    setSelectedDate(id ? "Oct 09, 2024" : undefined);
  };

  const handleFavorite = (id: number) => {
    toggleJobAction(id, "favorites");
    setJobs((prev) =>
      prev.map((job) => (Number(job.id) === id ? { ...job } : job))
    );
  };

  const handleArchive = (id: number) => {
    toggleJobAction(id, "archived");
    setJobs((prev) =>
      prev.map((job) => (Number(job.id) === id ? { ...job } : job))
    );
  };

  const handleHide = (id: number) => {
    toggleJobAction(id, "hidden");
    setJobs((prev) => prev.filter((job) => Number(job.id) !== id));

    const updatedJobs = jobs.filter((job) => Number(job.id) !== id);
    const newTotalPages = Math.ceil(updatedJobs.length / itemsPerPage);
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    }
  };

  const totalPages = Math.ceil(jobs.length / itemsPerPage);
  const paginatedJobs = jobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (view === "companies") {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 dark:text-white dark:drop-shadow-sm">
          {t("home.topCompanies")}
        </h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array(12)
            .fill({
              id: 1,
              name: "Pinbus",
              logo: "/placeholder.svg?height=64&width=64",
              featured: true,
            })
            .map((company, index) => (
              <CompanyCard key={index} {...company} />
            ))}
        </div>
      </div>
    );
  }

  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.types && filters.types.length) count++;
    if (filters.locations && filters.locations.length) count++;
    if (filters.categories && filters.categories.length) count++;
    if (filters.minSalary !== undefined || filters.maxSalary !== undefined)
      count++;
    return count;
  }, [filters]);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6 text-center dark:text-white dark:drop-shadow-lg">
          {searchTerm ? `${t("search.resultsFor")} "${searchTerm}"` : pageTitle}
        </h1>
        <div className="max-w-3xl mx-auto mb-4">
          <ResumeSelector
            mode={mode === "suggest" ? "suggest" : "search"}
            selectedId={selectedResumeId}
            selectedDate={selectedDate}
            onSelect={handleResumeSelect}
          />
        </div>
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row gap-2 mt-4">
          <div className="flex-1 flex flex-col sm:flex-row gap-2">
            <Input
              placeholder={t("search.jobTitleOrKeyword")}
              className="flex-1 dark:bg-slate-800 dark:border-slate-600 dark:text-white dark:placeholder-indigo-300 focus:dark:border-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Input
              placeholder={t("search.location")}
              className="sm:w-48 dark:bg-slate-800 dark:border-slate-600 dark:text-white dark:placeholder-indigo-300 focus:dark:border-indigo-500"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {isMobile && (
              <Button
                className="flex-1 dark:border-slate-600 dark:text-indigo-300 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-200 transition-colors"
                onClick={() => setShowMobileFilters(true)}
              >
                <Filter className="h-4 w-4 mr-2" />
                {t("common.filter")}
              </Button>
            )}
            <Button
              onClick={handleSearch}
              className="bg-indigo-600 hover:bg-indigo-700 dark:bg-gradient-to-r dark:from-indigo-600 dark:to-indigo-500 dark:hover:from-indigo-500 dark:hover:to-indigo-400 flex-1 sm:flex-none transition-colors"
            >
              <Search className="h-4 w-4 mr-2" />
              {t("common.search")}
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-8 relative">
        <div className="hidden lg:block lg:w-64 sticky top-4 self-start">
          <DropdownMenu open={showFilterDropdown} onOpenChange={setShowFilterDropdown}>
            <DropdownMenuTrigger asChild>
              <Button className="relative">
                <Filter className="h-4 w-4 mr-2" />
                {t("common.filter")}
                {activeFilterCount > 0 && (
                  <Badge className="ml-2" variant="secondary">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 p-4">
              <FilterBar
                filters={{
                  category: categoryFilter,
                  location: locationFilter,
                  jobType: jobTypeFilter,
                  experience: experienceFilter,
                  postedDate: postedDateFilter,
                  salary: [salaryFilter.min, salaryFilter.max].filter(Boolean),
                }}
                onFilterChange={handleFilterChange} onFilterClick={function (filterType: string): void {
                  throw new Error("Function not implemented.");
                } } onClearAll={function (): void {
                  throw new Error("Function not implemented.");
                } } onSearch={function (): void {
                  throw new Error("Function not implemented.");
                } } activeFilter={null}              />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {isMobile && showMobileFilters && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex justify-end">
            <div
              ref={filterRef}
              className="bg-gradient-to-br from-slate-800 to-slate-700 w-[80%] max-w-xs h-full overflow-y-auto p-4 animate-slide-in-right border-l border-slate-600 shadow-xl shadow-purple-900/30"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-white">
                  {t("common.filter")}
                </h3>
                <Button
                  onClick={() => setShowMobileFilters(false)}
                  className="text-indigo-300 hover:text-indigo-200 hover:bg-indigo-900/30 transition-colors"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <FilterBar
                filters={{
                  category: categoryFilter,
                  location: locationFilter,
                  jobType: jobTypeFilter,
                  experience: experienceFilter,
                  postedDate: postedDateFilter,
                  salary: [salaryFilter.min, salaryFilter.max].filter(Boolean),
                }}
                onFilterChange={handleFilterChange} onFilterClick={function (filterType: string): void {
                  throw new Error("Function not implemented.");
                } } onClearAll={function (): void {
                  throw new Error("Function not implemented.");
                } } onSearch={function (): void {
                  throw new Error("Function not implemented.");
                } } activeFilter={null}              />
              <div className="mt-6 flex gap-2">
                <Button
                  className="flex-1 dark:border-slate-600 dark:text-indigo-300 dark:hover:bg-slate-700 transition-colors"
                  onClick={() => setShowMobileFilters(false)}
                >
                  {t("common.cancel")}
                </Button>
                <Button
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 dark:bg-gradient-to-r dark:from-indigo-600 dark:to-indigo-500 dark:hover:from-indigo-500 dark:hover:to-indigo-400 transition-colors"
                  onClick={() => {
                    handleSearch();
                    setShowMobileFilters(false);
                  }}
                >
                  {t("common.apply")}
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-[180px] rounded-lg border dark:border-slate-600 dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-700 p-4 animate-pulse"
                />
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="rounded-lg border dark:border-slate-600 dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-700 p-8 text-center dark:shadow-lg dark:shadow-purple-900/20">
              <h3 className="text-lg font-medium dark:text-white">
                {t("jobs.noJobsFound")}
              </h3>
              <p className="text-gray-500 dark:text-indigo-300 mt-2">
                {t("jobs.tryDifferentFilters")}
              </p>
            </div>
          ) : (
            <>
              <div className="mb-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <p className="text-sm text-gray-500 dark:text-indigo-300">
                    {t("search.showing")}{" "}
                    {Math.min(
                      jobs.length,
                      1 + (currentPage - 1) * itemsPerPage
                    )}
                    -{Math.min(currentPage * itemsPerPage, jobs.length)}{" "}
                    {t("search.of")} {jobs.length} {t("search.results")}
                  </p>
                  <DisplayModeSelector
                    currentMode={displayMode}
                    onChange={setDisplayMode}
                  />
                </div>
              </div>

              <div
                className={`grid gap-4 ${
                  displayMode.columns === 1
                    ? "grid-cols-1"
                    : displayMode.columns === 2
                    ? "grid-cols-1 sm:grid-cols-2"
                    : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                }`}
              >
                {paginatedJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onFavorite={handleFavorite}
                    onArchive={handleArchive}
                    onHide={handleHide}
                    onRestore={() => {}}
                  />
                ))}
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                className="mt-8"
                maxVisiblePages={5}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
