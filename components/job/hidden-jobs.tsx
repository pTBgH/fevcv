"use client";

import { useState, useEffect } from "react";
import { JobSearchBar } from "@/components/job/job-search-bar";
import { JobGrid } from "@/components/job/job-grid";
import { useLanguage } from "@/lib/i18n/context";
import { getFilteredJobs } from "@/lib/job-service";
import {
  DisplayModeSelector,
  type DisplayMode,
} from "@/components/job/display-mode-selector";
import { useIsMobile } from "@/hooks/use-mobile";
import { JobFilterSidebar } from "@/components/job/job-filter-sidebar";
import { FilterBar } from "@/components/job/filter-bar";

export function HiddenJobs() {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const [displayMode, setDisplayMode] = useState<DisplayMode>({
    columns: isMobile ? 1 : 3,
    rows: isMobile ? 1 : 3,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({});
  const [jobs, setJobs] = useState<any[]>([]);

  // Initial job load
  useEffect(() => {
    const filteredJobs = getFilteredJobs("", { type: "hidden" });
    setJobs(filteredJobs);
  }, []);

  // Update display mode when mobile status changes
  useEffect(() => {
    setDisplayMode({
      columns: isMobile ? 1 : 3,
      rows: isMobile ? 1 : 3,
    });
  }, [isMobile]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const filteredJobs = getFilteredJobs(term, { ...filters, type: "hidden" });
    setJobs(filteredJobs);
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    const filteredJobs = getFilteredJobs(searchTerm, {
      ...newFilters,
      type: "hidden",
    });
    setJobs(filteredJobs);
  };

  const handleClearFilters = () => {
    setFilters({});
    setActiveFilter(null);
    const filteredJobs = getFilteredJobs(searchTerm, { type: "hidden" });
    setJobs(filteredJobs);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
    if (!showFilters) {
      setActiveFilter("category"); // Default active filter when opening
    } else {
      setActiveFilter(null);
    }
  };

  const handleFilterClick = (filterType: string) => {
    setActiveFilter(filterType);
    setShowFilters(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium">{t("dashboard.hiddenJobs")}</h2>
        <DisplayModeSelector
          onChange={setDisplayMode}
          currentMode={displayMode}
        />
      </div>

      <JobSearchBar
        defaultValue={searchTerm}
        onSearch={handleSearch}
        onToggleFilters={toggleFilters}
        showFilters={showFilters}
      />

      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onFilterClick={handleFilterClick}
        onClearAll={handleClearFilters}
        onSearch={() => handleSearch(searchTerm)}
        activeFilter={activeFilter}
      />

      <div className="flex flex-col md:flex-row gap-6">
        {showFilters && (
          <div className="w-full md:w-64 shrink-0">
            <JobFilterSidebar
              activeFilter={activeFilter}
              onFilterChange={handleFilterChange}
              className="sticky top-4"
            />
          </div>
        )}

        <div className="flex-1">
          <JobGrid
            type="hidden"
            itemsPerPage={displayMode.columns * displayMode.rows}
            displayMode={displayMode}
            jobs={jobs}
          />
        </div>
      </div>
    </div>
  );
}
