"use client";

import { Button } from "@/components/ui/button";
import { ChevronDown, Search } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

interface FilterBarProps {
  onFilterClick: (filterType: string) => void;
  onClearAll: () => void;
  onSearch: () => void;
  activeFilter: string | null;
  filters: Record<string, any>;
  onFilterChange: (type: string, value: any) => void;
}

const filterOptions: Record<string, string[]> = {
  category: ["Commerce", "Telecommunications", "Hotels & Tourism", "Education", "Financial Services"],
  location: ["Ho Chi Minh City", "Hanoi", "Da Nang", "Can Tho", "Nha Trang"],
  jobType: ["Full-time", "Part-time", "Contract", "Freelance", "Internship"],
  experience: ["Entry Level", "Mid Level", "Senior Level", "Manager", "Executive"],
  postedDate: ["Today", "Last 3 days", "Last week", "Last month", "Any time"],
};

export function FilterBar({
  onFilterClick,
  onClearAll,
  onSearch,
  activeFilter,
  filters,
  onFilterChange,
}: FilterBarProps) {
  const { t } = useLanguage();

  const filterList = [
    { id: "category", label: "Category" },
    { id: "location", label: "Location" },
    { id: "jobType", label: "Job Type" },
    { id: "experience", label: "Experience" },
    { id: "postedDate", label: "Posted Date" },
    { id: "salary", label: "Salary" },
  ];

  return (
    <div className="flex gap-2 mb-4">
      {filterList.map((filter) => (
        <DropdownMenu key={filter.id}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="relative">
              {filter.label}
              <ChevronDown className="ml-1 h-4 w-4" />
              {filters[filter.id]?.length > 0 && (
                <Badge className="ml-2" variant="secondary">{filters[filter.id].length}</Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 p-4">
            {filter.id === "salary" ? (
              <div className="flex gap-2 items-center">
                <Input
                  type="number"
                  min={0}
                  value={filters.salary?.[0] || ""}
                  onChange={e => onFilterChange("salary", [{...filters.salary, min: Number(e.target.value)}, filters.salary?.[1]])}
                  placeholder="Min"
                  className="w-20"
                />
                <span>-</span>
                <Input
                  type="number"
                  min={0}
                  value={filters.salary?.[1] || ""}
                  onChange={e => onFilterChange("salary", [filters.salary?.[0], {...filters.salary, max: Number(e.target.value)}])}
                  placeholder="Max"
                  className="w-20"
                />
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {filterOptions[filter.id as keyof typeof filterOptions]?.map((option: string) => (
                  <label key={option} className="flex items-center gap-2">
                    <Checkbox
                      checked={filters[filter.id]?.includes(option)}
                      onCheckedChange={checked => {
                        const prev = filters[filter.id] || [];
                        if (checked) {
                          onFilterChange(filter.id, [...prev, option]);
                        } else {
                          onFilterChange(filter.id, prev.filter((v: string) => v !== option));
                        }
                      }}
                    />
                    {option}
                  </label>
                ))}
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ))}

      <div className="flex-1"></div>

      <Button variant="outline" className="ml-auto" onClick={onClearAll}>
        {t("common.clearAll")}
      </Button>

      <Button onClick={onSearch} className="flex items-center gap-1">
        <Search className="h-4 w-4" />
        {t("common.search")}
      </Button>
    </div>
  );
}
