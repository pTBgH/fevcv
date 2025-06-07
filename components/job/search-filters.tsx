"use client"

import { useState, useEffect } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { getAllJobs } from "@/lib/job-service"
import { useLanguage } from "@/lib/i18n/context"
import { Button } from "@/components/ui/button"
import { RotateCcw } from "lucide-react"

interface SearchFiltersProps {
  onFilterChange: (filters: any) => void
  salaryInputType?: 'number'
}

export function SearchFilters({ onFilterChange, salaryInputType }: SearchFiltersProps) {
  const [salary, setSalary] = useState([0, 5000])
  const [jobTypes, setJobTypes] = useState<Record<string, boolean>>({})
  const [locations, setLocations] = useState<Record<string, boolean>>({})
  const [categories, setCategories] = useState<Record<string, boolean>>({})
  const { t } = useLanguage()

  // Get unique values for filters
  useEffect(() => {
    const jobs = getAllJobs()

    // Extract unique job types
    const types = jobs.reduce(
      (acc, job) => {
        acc[job.type] = true
        return acc
      },
      {} as Record<string, boolean>,
    )

    // Extract unique locations
    const cities = jobs.reduce(
      (acc, job) => {
        if (job.city) acc[job.city] = true
        return acc
      },
      {} as Record<string, boolean>,
    )

    // Extract unique categories
    const cats = jobs.reduce(
      (acc, job) => {
        acc[job.category] = true
        return acc
      },
      {} as Record<string, boolean>,
    )

    setJobTypes(types)
    setLocations(cities)
    setCategories(cats)
  }, [])

  const handleJobTypeChange = (type: string, checked: boolean) => {
    const newJobTypes = { ...jobTypes, [type]: checked }
    setJobTypes(newJobTypes)
    applyFilters(newJobTypes, locations, categories, salary)
  }

  const handleLocationChange = (location: string, checked: boolean) => {
    const newLocations = { ...locations, [location]: checked }
    setLocations(newLocations)
    applyFilters(jobTypes, newLocations, categories, salary)
  }

  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = { ...categories, [category]: checked }
    setCategories(newCategories)
    applyFilters(jobTypes, locations, newCategories, salary)
  }

  const handleSalaryChange = (value: number[]) => {
    setSalary(value)
    applyFilters(jobTypes, locations, categories, value)
  }

  const handleSalaryMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const min = Number(e.target.value);
    setSalary([min, salary[1]]);
    applyFilters(jobTypes, locations, categories, [min, salary[1]]);
  };

  const handleSalaryMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const max = Number(e.target.value);
    setSalary([salary[0], max]);
    applyFilters(jobTypes, locations, categories, [salary[0], max]);
  };

  const applyFilters = (
    types: Record<string, boolean>,
    locs: Record<string, boolean>,
    cats: Record<string, boolean>,
    sal: number[],
  ) => {
    const selectedTypes = Object.entries(types)
      .filter(([_, selected]) => selected)
      .map(([type]) => type)

    const selectedLocations = Object.entries(locs)
      .filter(([_, selected]) => selected)
      .map(([location]) => location)

    const selectedCategories = Object.entries(cats)
      .filter(([_, selected]) => selected)
      .map(([category]) => category)

    onFilterChange({
      types: selectedTypes.length > 0 ? selectedTypes : undefined,
      locations: selectedLocations.length > 0 ? selectedLocations : undefined,
      categories: selectedCategories.length > 0 ? selectedCategories : undefined,
      minSalary: sal[0] > 0 ? sal[0] : undefined,
      maxSalary: sal[1] < 5000 ? sal[1] : undefined,
    })
  }

  const resetFilters = () => {
    // Reset all filters to their default state
    setJobTypes(Object.keys(jobTypes).reduce((acc, key) => ({ ...acc, [key]: false }), {}))
    setLocations(Object.keys(locations).reduce((acc, key) => ({ ...acc, [key]: false }), {}))
    setCategories(Object.keys(categories).reduce((acc, key) => ({ ...acc, [key]: false }), {}))
    setSalary([0, 5000])

    // Apply the reset filters
    onFilterChange({})
  }

  return (
    <div className="space-y-6 bg-white dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-700 rounded-lg border dark:border-slate-600 p-4 dark:shadow-lg dark:shadow-purple-900/20">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold dark:text-white dark:drop-shadow-sm">{t("common.filter")}</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={resetFilters}
          className="text-gray-500 dark:text-indigo-300 hover:text-gray-700 dark:hover:text-indigo-200 dark:hover:bg-indigo-900/20 transition-colors"
        >
          <RotateCcw className="h-3 w-3 mr-1" />
          {t("common.reset")}
        </Button>
      </div>

      <Accordion type="multiple" defaultValue={["location", "jobType", "category", "salary"]} className="space-y-2">
        <AccordionItem value="jobType" className="border dark:border-slate-600 rounded-md px-3 dark:bg-slate-800/50">
          <AccordionTrigger className="py-3 dark:text-indigo-200 hover:dark:text-indigo-100 transition-colors">
            {t("search.jobType")}
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 py-2">
              {Object.keys(jobTypes).map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`type-${type}`}
                    checked={jobTypes[type]}
                    onCheckedChange={(checked) => handleJobTypeChange(type, checked === true)}
                    className="dark:border-indigo-400 dark:data-[state=checked]:bg-indigo-500 dark:data-[state=checked]:border-indigo-500 transition-colors"
                  />
                  <label
                    htmlFor={`type-${type}`}
                    className="text-sm cursor-pointer dark:text-indigo-200 hover:dark:text-indigo-100 transition-colors"
                  >
                    {type}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="location" className="border dark:border-slate-600 rounded-md px-3 dark:bg-slate-800/50">
          <AccordionTrigger className="py-3 dark:text-indigo-200 hover:dark:text-indigo-100 transition-colors">
            {t("search.location")}
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 py-2 max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-500 scrollbar-track-slate-700">
              {Object.keys(locations).map((location) => (
                <div key={location} className="flex items-center space-x-2">
                  <Checkbox
                    id={`location-${location}`}
                    checked={locations[location]}
                    onCheckedChange={(checked) => handleLocationChange(location, checked === true)}
                    className="dark:border-indigo-400 dark:data-[state=checked]:bg-indigo-500 dark:data-[state=checked]:border-indigo-500 transition-colors"
                  />
                  <label
                    htmlFor={`location-${location}`}
                    className="text-sm cursor-pointer dark:text-indigo-200 hover:dark:text-indigo-100 transition-colors"
                  >
                    {location}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="category" className="border dark:border-slate-600 rounded-md px-3 dark:bg-slate-800/50">
          <AccordionTrigger className="py-3 dark:text-indigo-200 hover:dark:text-indigo-100 transition-colors">
            {t("search.category")}
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 py-2 max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-500 scrollbar-track-slate-700">
              {Object.keys(categories).map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category}`}
                    checked={categories[category]}
                    onCheckedChange={(checked) => handleCategoryChange(category, checked === true)}
                    className="dark:border-indigo-400 dark:data-[state=checked]:bg-indigo-500 dark:data-[state=checked]:border-indigo-500 transition-colors"
                  />
                  <label
                    htmlFor={`category-${category}`}
                    className="text-sm cursor-pointer dark:text-indigo-200 hover:dark:text-indigo-100 transition-colors"
                  >
                    {category}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="salary" className="border dark:border-slate-600 rounded-md px-3 dark:bg-slate-800/50">
          <AccordionTrigger className="py-3 dark:text-indigo-200 hover:dark:text-indigo-100 transition-colors">
            {t("search.salary")}
          </AccordionTrigger>
          <AccordionContent>
            {salaryInputType === 'number' ? (
              <div className="flex gap-2 items-center py-2">
                <input
                  type="number"
                  min={0}
                  value={salary[0]}
                  onChange={handleSalaryMinChange}
                  className="w-24 px-2 py-1 border rounded dark:bg-slate-700 dark:text-white"
                  placeholder={t("search.minSalary")}
                />
                <span className="mx-1">-</span>
                <input
                  type="number"
                  min={0}
                  value={salary[1]}
                  onChange={handleSalaryMaxChange}
                  className="w-24 px-2 py-1 border rounded dark:bg-slate-700 dark:text-white"
                  placeholder={t("search.maxSalary")}
                />
              </div>
            ) : (
              <div className="space-y-4 py-2">
                <Slider
                  value={salary}
                  onValueChange={handleSalaryChange}
                  min={0}
                  max={5000}
                  step={100}
                  className="dark:bg-slate-700"
                />
                <div className="flex items-center justify-between text-sm dark:text-indigo-200">
                  <span>${salary[0]}</span>
                  <span>${salary[1]}</span>
                </div>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
