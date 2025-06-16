// "use client"

// import { useMemo, useEffect, useState } from "react"
// import { Button } from "@/components/ui/button"
// import { JobCard } from "@/components/job/job-card"
// import suggestedJobsData from "@/data/suggested-jobs.json"
// import { getAllJobs } from "@/lib/job-service"
// import { useLanguage } from "@/lib/i18n/context"
// import type { Job } from "@/lib/types"

// // Extend Job to include additional properties.
// interface ExtendedJob extends Job {
//   matchPercentage: number
//   daysLeft: number
// }

// interface SuggestedSectionProps {
//   selectedCVId?: string
// }

// // Add a function to fetch suggested jobs from the API
// async function fetchSuggestedJobs(cvId: string) {
//   try {
//     const apiUrl = process.env.NEXT_PUBLIC_API_URL
//     const response = await fetch(`${apiUrl}/api/suggestions?cvId=${cvId}`)
//     if (!response.ok) {
//       throw new Error("Failed to fetch suggested jobs")
//     }
//     return await response.json()
//   } catch (error) {
//     console.error("Error fetching suggested jobs:", error)
//     return []
//   }
// }

// // Update the component to use the API when available
// export default function SuggestedSection({ selectedCVId }: SuggestedSectionProps) {
//   const { t } = useLanguage()
//   const allJobs = useMemo(() => getAllJobs(), [])
//   const [isLoading, setIsLoading] = useState(false)
//   const [apiSuggestedJobs, setApiSuggestedJobs] = useState<ExtendedJob[]>([])

//   // Fetch suggested jobs from API when CV ID changes
//   useEffect(() => {
//     if (!selectedCVId) return

//     const fetchJobs = async () => {
//       setIsLoading(true)
//       try {
//         if (process.env.NEXT_PUBLIC_API_URL) {
//           // Use the API if the environment variable is available
//           const data = await fetchSuggestedJobs(selectedCVId)
//           if (data && data.length > 0) {
//             setApiSuggestedJobs(data)
//             setIsLoading(false)
//             return
//           }
//         }
//         // Fall back to local data if API fails or isn't configured
//         setApiSuggestedJobs([])
//       } catch (error) {
//         console.error("Error in suggested jobs effect:", error)
//         setApiSuggestedJobs([])
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     fetchJobs()
//   }, [selectedCVId])

//   // Use API data if available, otherwise fall back to local data
//   const suggestedJobs = useMemo<ExtendedJob[]>(() => {
//     if (apiSuggestedJobs.length > 0) {
//       return apiSuggestedJobs
//     }

//     if (!selectedCVId) return []

//     // Existing local data logic
//     const matchedJobIds = (suggestedJobsData[selectedCVId as keyof typeof suggestedJobsData] as string[]) || []

//     if (matchedJobIds.length === 0) return []

//     return matchedJobIds
//       .map((jobId) => {
//         const job = allJobs.find((j) => j.id === jobId)
//         if (!job) return null

//         // Tính số ngày còn lại
//         const endDate = new Date(job.endDate)
//         const now = new Date()
//         const diffTime = endDate.getTime() - now.getTime()
//         const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
//         const daysLeft = diffDays > 0 ? diffDays : 0

//         // Tính phần trăm phù hợp (giả lập)
//         const matchPercentage = Math.floor(70 + Math.random() * 30)

//         // Trả về job với thông tin bổ sung
//         return {
//           ...job,
//           daysLeft,
//           matchPercentage,
//         } as ExtendedJob
//       })
//       .filter((job): job is ExtendedJob => job !== null)
//       .sort((a, b) => b.matchPercentage - a.matchPercentage)
//       .slice(0, 3)
//   }, [selectedCVId, allJobs, apiSuggestedJobs])

//   if (isLoading) {
//     return (
//       <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/10 p-6">
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="font-bold">{t("dashboard.suggestedJobs")}</h2>
//         </div>
//         <div className="p-6 text-center">
//           <div className="animate-pulse flex flex-col space-y-4">
//             <div className="h-24 bg-gray-200 rounded"></div>
//             <div className="h-24 bg-gray-200 rounded"></div>
//             <div className="h-24 bg-gray-200 rounded"></div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   if (suggestedJobs.length === 0) {
//     return (
//       <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/10 p-6">
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="font-bold">{t("dashboard.suggestedJobs")}</h2>
//         </div>
//         <div className="p-6 text-center bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
//           <p className="text-gray-500 dark:text-gray-400">{t("common.noResults")}</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/10 p-6">
//       <div className="flex items-center justify-between mb-4">
//         <h2 className="font-bold">{t("dashboard.suggestedJobs")}</h2>
//         <Button variant="ghost" size="sm" className="text-blue-600">
//           {t("common.viewAll")}
//         </Button>
//       </div>

//       <div className="grid grid-cols-1 gap-4 mt-6">
//         {suggestedJobs.map((job) => (
//           <div key={job.id} className="relative">
//             <JobCard job={job} onFavorite={() => {}} onArchive={() => {}} onHide={() => {}} />
//             {job.matchPercentage && (
//               <div className="absolute top-2 left-2 bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
//                 {job.matchPercentage}% {t("dashboard.match")}
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }
