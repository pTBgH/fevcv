"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, Search } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

// ... Interface và hằng số không đổi ...
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
  const [internalFilters, setInternalFilters] = useState(filters);

  useEffect(() => {
    setInternalFilters(filters);
  }, [filters]);

  const filterList = [
    { id: "category", label: "Category" },
    { id: "location", label: "Location" },
    { id: "jobType", label: "Job Type" },
    { id: "experience", label: "Experience" },
    { id: "postedDate", label: "Posted Date" },
    { id: "salary", label: "Salary" },
  ];

  const handleFilterChange = (type: string, value: any) => {
    // SỬA LỖI Ở ĐÂY: Thêm toán tử spread (...) để copy các filter cũ
    const newFilters = { ...internalFilters, [type]: value };
    
    setInternalFilters(newFilters);
    // Thay vì truyền `type` và `value`, chúng ta truyền cả object filters mới
    // để component cha có trạng thái chính xác nhất.
    onFilterChange(type, newFilters[type]); 
  };

  const handleSalaryChange = (field: 'min' | 'max', value: string) => {
    const salary = { ...internalFilters.salary };
    const numericValue = Number(value);
    salary[field] = isNaN(numericValue) || numericValue === 0 ? undefined : numericValue;
    handleFilterChange("salary", salary);
  };

  const totalSelected = Object.values(internalFilters).reduce((acc, val) => {
    if (Array.isArray(val)) return acc + val.length;
    if (val && (val.min || val.max)) return acc + 1;
    return acc;
  }, 0);

  // ... Phần JSX return không có gì thay đổi ...
  return (
    <div className="flex gap-2 mb-4 bg-brand-cream p-2 rounded-lg">
      {filterList.map((filter) => (
        <DropdownMenu key={filter.id}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="bg-brand-cream text-black hover:bg-brand-cream/80"
            >
              {filter.label}
              <ChevronDown className="ml-1 h-4 w-4" />
              {Array.isArray(internalFilters[filter.id]) && internalFilters[filter.id].length > 0 && (
                <Badge className="ml-2 bg-white text-black border-black">
                  {internalFilters[filter.id].length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 p-4 bg-brand-cream border-black">
            {filter.id === "salary" ? (
              <div className="flex gap-2 items-center">
                <Input
                  type="number"
                  min={0}
                  value={internalFilters.salary?.min || ""}
                  onChange={e => handleSalaryChange("min", e.target.value)}
                  placeholder="Min"
                  className="w-20 bg-white text-black border-black"
                />
                <span className="text-black">-</span>
                <Input
                  type="number"
                  min={0}
                  value={internalFilters.salary?.max || ""}
                  onChange={e => handleSalaryChange("max", e.target.value)}
                  placeholder="Max"
                  className="w-20 bg-white text-black border-black"
                />
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {filterOptions[filter.id as keyof typeof filterOptions]?.map((option: string) => {
                  const checkboxId = `${filter.id}-${option.replace(/\s+/g, '-')}`;
                  return (
                    <label key={option} htmlFor={checkboxId} className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        id={checkboxId}
                        checked={(internalFilters[filter.id] || []).includes(option)}
                        onCheckedChange={(checked) => {
                          const current = internalFilters[filter.id] || [];
                          const newValue = checked
                            ? [...current, option]
                            : current.filter((v: string) => v !== option);
                          handleFilterChange(filter.id, newValue);
                        }}
                        className="border-black"
                      />
                      <span className="text-black">{option}</span>
                    </label>
                  )
                })}
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ))}

      <div className="flex-1 flex items-center">
        {totalSelected > 0 && (
          <Badge className="bg-white text-black border-black ml-auto mr-2">
            {totalSelected} selected
          </Badge>
        )}
      </div>
      
      <Button
        variant="outline"
        className="bg-brand-cream text-black hover:bg-brand-cream/80 border-black"
        onClick={onClearAll}
      >
        {t("common.clearAll")}
      </Button>
      <Button
        onClick={onSearch}
        className="bg-brand-cream text-black hover:bg-brand-cream/80 border-black flex items-center gap-1"
      >
        <Search className="h-4 w-4 text-black" />
        {t("common.search")}
      </Button>
    </div>
  );
}