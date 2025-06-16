// "use client"

// import { CalendarClock } from "lucide-react"
// import { useLanguage } from "@/lib/i18n/context"

// interface Deadline {
//   id: number
//   jobTitle: string
//   company: string
//   deadline: Date
// }

// interface DeadlineListProps {
//   date: Date
//   deadlines: Deadline[]
// }

// export function DeadlineList({ date, deadlines }: DeadlineListProps) {
//   const { t, locale } = useLanguage()

//   // Format date based on locale
//   const formattedDate =
//     locale === "vi"
//       ? date.toLocaleDateString("vi-VN", {
//           weekday: "long",
//           day: "numeric",
//           month: "long",
//           year: "numeric",
//         })
//       : date.toLocaleDateString("en-US", {
//           weekday: "long",
//           month: "long",
//           day: "numeric",
//           year: "numeric",
//         })

//   if (deadlines.length === 0) {
//     return (
//       <div className="mt-4 text-center py-6 border border-dashed dark:border-gray-700 rounded-lg">
//         <CalendarClock className="mx-auto h-8 w-8 text-gray-400 dark:text-gray-500" />
//         <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{t("dashboard.noDeadlinesForDate")}</p>
//       </div>
//     )
//   }

//   return (
//     <div className="mt-4">
//       <h4 className="font-medium mb-2 dark:text-white">{formattedDate}</h4>
//       <div className="space-y-3">
//         {deadlines.map((deadline) => (
//           <div
//             key={deadline.id}
//             className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 rounded-lg"
//           >
//             <div className="flex justify-between items-start">
//               <div>
//                 <h5 className="font-medium dark:text-white">{deadline.jobTitle}</h5>
//                 <p className="text-sm text-gray-600 dark:text-gray-400">{deadline.company}</p>
//               </div>
//               <div className="text-right">
//                 <p className="text-xs text-gray-500 dark:text-gray-400">{t("dashboard.deadline")}</p>
//                 <p className="text-sm font-medium text-red-600">
//                   {deadline.deadline.toLocaleTimeString(locale === "vi" ? "vi-VN" : "en-US", {
//                     hour: "2-digit",
//                     minute: "2-digit",
//                   })}
//                 </p>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }
