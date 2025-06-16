// "use client"

// import { useMemo } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { useLanguage } from "@/lib/i18n/context"
// import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
// import suggestedJobsData from "@/data/suggested-jobs.json"
// import { getAllJobs } from "@/lib/job-service"

// // Màu sắc cho biểu đồ
// const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D", "#A4DE6C"]

// export function RolesChart() {
//   const { t } = useLanguage()
//   const allJobs = useMemo(() => getAllJobs(), [])

//   // Tính toán dữ liệu biểu đồ dựa trên tất cả CV
//   const chartData = useMemo(() => {
//     // Lấy tất cả job phù hợp từ tất cả CV
//     const allMatchedJobIds = new Set<string>()

//     // Duyệt qua tất cả CV và thu thập job phù hợp
//     Object.values(suggestedJobsData).forEach((jobIds) => {
//       if (Array.isArray(jobIds)) {
//         jobIds.forEach((id) => allMatchedJobIds.add(id))
//       }
//     })

//     // Lấy thông tin chi tiết của các job
//     const matchedJobs = Array.from(allMatchedJobIds)
//       .map((jobId) => allJobs.find((j) => j.id === jobId))
//       .filter(Boolean) // Lọc bỏ các giá trị null

//     // Nhóm job theo danh mục
//     const categoryGroups: Record<string, number> = {}
//     matchedJobs.forEach((job) => {
//       if (job?.category) {
//         categoryGroups[job.category] = (categoryGroups[job.category] || 0) + 1
//       }
//     })

//     // Tính tỷ lệ phần trăm và tạo mảng kết quả
//     const totalJobs = matchedJobs.length
//     let result = Object.entries(categoryGroups)
//       .map(([name, value]) => ({
//         name,
//         value,
//         percentage: Math.round((value / totalJobs) * 100),
//       }))
//       .sort((a, b) => b.value - a.value) // Sắp xếp theo số lượng giảm dần

//     // Nhóm các danh mục nhỏ vào "Others" nếu có quá nhiều danh mục
//     if (result.length > 6) {
//       const mainCategories = result.slice(0, 5)
//       const otherCategories = result.slice(5)

//       const otherValue = otherCategories.reduce((sum, item) => sum + item.value, 0)
//       const otherPercentage = Math.round((otherValue / totalJobs) * 100)

//       result = [...mainCategories, { name: "Others", value: otherValue, percentage: otherPercentage }]
//     }

//     return result
//   }, [allJobs])

//   // Custom tooltip cho biểu đồ
//   const CustomTooltip = ({ active, payload }: any) => {
//     if (active && payload && payload.length) {
//       const data = payload[0].payload
//       return (
//         <div className="bg-white dark:bg-gray-800 p-2 border dark:border-gray-700 rounded shadow-sm dark:text-white">
//           <p className="font-medium">{data.name}</p>
//           <p>
//             {data.value} jobs ({data.percentage}%)
//           </p>
//         </div>
//       )
//     }
//     return null
//   }

//   if (chartData.length === 0) {
//     return (
//       <Card className="dark:bg-gray-800 dark:border-gray-700">
//         <CardHeader>
//           <CardTitle className="dark:text-white">{t("dashboard.suitableRoles")}</CardTitle>
//         </CardHeader>
//         <CardContent className="h-[300px] flex items-center justify-center">
//           <p className="text-gray-500 dark:text-gray-400">{t("common.noResults")}</p>
//         </CardContent>
//       </Card>
//     )
//   }

//   return (
//     <Card className="dark:bg-gray-800 dark:border-gray-700">
//       <CardHeader>
//         <CardTitle className="dark:text-white">{t("dashboard.suitableRoles")}</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="h-[300px]">
//           <ResponsiveContainer width="100%" height="100%">
//             <PieChart>
//               <Pie
//                 data={chartData}
//                 cx="50%"
//                 cy="50%"
//                 labelLine={false}
//                 outerRadius={100}
//                 fill="#8884d8"
//                 dataKey="value"
//                 label={({ name, percentage }) => `${name}: ${percentage}%`}
//               >
//                 {chartData.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                 ))}
//               </Pie>
//               <Tooltip content={<CustomTooltip />} />
//               <Legend />
//             </PieChart>
//           </ResponsiveContainer>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }
