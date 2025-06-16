// "use client"

// import { FileText, Users, DollarSign } from "lucide-react"
// import { Card, CardContent } from "@/components/ui/card"
// import { useLanguage } from "@/lib/i18n/context"
// import { getAllResumes } from "@/lib/cv-service"
// import { getAllJobs } from "@/lib/job-service"
// import { useEffect, useState } from "react"

// export function StatsCards() {
//   const { t } = useLanguage()
//   const [resumeCount, setResumeCount] = useState(0)
//   const [jobCount, setJobCount] = useState(0)
//   const [avgSalary, setAvgSalary] = useState(0)

//   useEffect(() => {
//     // Count resumes
//     const resumes = getAllResumes()
//     setResumeCount(resumes.length)

//     // Count jobs and calculate average salary
//     const jobs = getAllJobs()
//     setJobCount(jobs.length)

//     // Calculate average salary from jobs with available salary data
//     const jobsWithSalary = jobs.filter((job) => job.maxSalary !== null)
//     if (jobsWithSalary.length > 0) {
//       const totalSalary = jobsWithSalary.reduce((sum, job) => {
//         const salary = job.maxSalary || 0
//         return sum + salary
//       }, 0)
//       setAvgSalary(Math.round(totalSalary / jobsWithSalary.length))
//     }
//   }, [])

//   const stats = [
//     {
//       title: t("dashboard.resumes"),
//       value: resumeCount,
//       icon: FileText,
//       color: "bg-blue-100",
//       iconColor: "text-blue-600",
//     },
//     {
//       title: t("dashboard.suitableJobs"),
//       value: jobCount,
//       icon: Users,
//       color: "bg-yellow-100",
//       iconColor: "text-yellow-500",
//     },
//     {
//       title: t("dashboard.avgSalary"),
//       value: `$${avgSalary.toLocaleString()}`,
//       icon: DollarSign,
//       color: "bg-pink-100",
//       iconColor: "text-pink-500",
//     },
//   ]

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//       {stats.map((stat, index) => (
//         <Card key={index} className="border-0 shadow-sm dark:bg-gray-800 dark:shadow-gray-950/10">
//           <CardContent className="p-3">
//             <div className="flex items-center gap-3">
//               <div className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.color}`}>
//                 <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{stat.title}</p>
//                 <p className="text-2xl font-bold dark:text-white">{stat.value}</p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       ))}
//     </div>
//   )
// }
