// "use client"

// import { useState, useEffect } from "react"
// import Image from "next/image"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import ExtractedZone from "@/components/resume/extracted-zone"
// import { ChevronLeft, ChevronRight } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { getDeletedResumes, restoreResume } from "@/lib/cv-service"
// import type { Resume } from "@/lib/types"
// import { useLanguage } from "@/lib/i18n/context"
// import CVCard from "@/components/resume/cv-card"

// export function DeletedResumes() {
//   const [deletedResumes, setDeletedResumes] = useState<Resume[]>([])
//   const [selectedResume, setSelectedResume] = useState<Resume | null>(null)
//   const [startIndex, setStartIndex] = useState(0)
//   const { t } = useLanguage()

//   useEffect(() => {
//     // Lấy danh sách CV đã xóa
//     const resumes = getDeletedResumes()
//     setDeletedResumes(resumes)

//     if (resumes.length > 0) {
//       setSelectedResume(resumes[0])
//     }
//   }, [])

//   const handleRestore = (id: string) => {
//     // Trong ứng dụng thực tế, bạn sẽ gọi API để khôi phục CV
//     const restoredResume = restoreResume(id)

//     // Cập nhật UI
//     if (restoredResume) {
//       setDeletedResumes((prevResumes) => prevResumes.filter((resume) => resume.id !== id))

//       // Nếu không còn CV nào, chọn CV đầu tiên trong danh sách mới
//       if (selectedResume?.id === id) {
//         const remainingResumes = deletedResumes.filter((resume) => resume.id !== id)
//         setSelectedResume(remainingResumes.length > 0 ? remainingResumes[0] : null)
//       }
//     }
//   }

//   const handleDelete = (id: string) => {
//     // Trong ứng dụng thực tế, bạn sẽ gọi API để xóa vĩnh viễn CV

//     // Cập nhật UI
//     setDeletedResumes((prevResumes) => prevResumes.filter((resume) => resume.id !== id))

//     // Nếu CV đang được chọn bị xóa, chọn CV đầu tiên trong danh sách mới
//     if (selectedResume?.id === id) {
//       const remainingResumes = deletedResumes.filter((resume) => resume.id !== id)
//       setSelectedResume(remainingResumes.length > 0 ? remainingResumes[0] : null)
//     }
//   }

//   // Tính toán các CV hiển thị và điều hướng
//   const visibleCVs = deletedResumes.slice(startIndex, startIndex + 3)
//   const canGoNext = startIndex + 3 < deletedResumes.length
//   const canGoPrev = startIndex > 0

//   const handlePrev = () => {
//     if (canGoPrev) {
//       setStartIndex(startIndex - 3)
//       if (selectedResume && !visibleCVs.includes(selectedResume)) {
//         setSelectedResume(deletedResumes[startIndex - 3])
//       }
//     }
//   }

//   const handleNext = () => {
//     if (canGoNext) {
//       setStartIndex(startIndex + 3)
//       if (selectedResume && !visibleCVs.includes(selectedResume)) {
//         setSelectedResume(deletedResumes[startIndex + 3])
//       }
//     }
//   }

//   if (deletedResumes.length === 0) {
//     return (
//       <div className="text-center py-8">
//         <p className="text-gray-500">{t("common.noResults")}</p>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-6">
//       {/* CV Navigation */}
//       <div className="flex items-center justify-between mb-4">
//         <div className="flex items-center gap-2">
//           <Button variant="outline" size="icon" className="h-9 w-9" disabled={!canGoPrev} onClick={handlePrev}>
//             <ChevronLeft className="h-5 w-5" />
//           </Button>
//           <span className="text-sm text-gray-500">
//             {startIndex + 1}-{Math.min(startIndex + 3, deletedResumes.length)} / {deletedResumes.length}
//           </span>
//           <Button variant="outline" size="icon" className="h-9 w-9" disabled={!canGoNext} onClick={handleNext}>
//             <ChevronRight className="h-5 w-5" />
//           </Button>
//         </div>
//       </div>

//       {/* Timeline dates */}
//       <div className="grid grid-cols-3 gap-4">
//         {visibleCVs.map((resume) => (
//           <div
//             key={resume.id}
//             className={`flex flex-col items-center ${
//               selectedResume?.id === resume.id ? "text-primary" : "text-gray-500"
//             }`}
//           >
//             <div className="w-full relative">
//               <CVCard
//                 cv={resume}
//                 isSelected={selectedResume?.id === resume.id}
//                 onSelect={() => setSelectedResume(resume)}
//                 menuContext="bin"
//                 showFavorite={false}
//                 onRestoreClick={(e) => {
//                   e.stopPropagation()
//                   handleRestore(resume.id)
//                 }}
//                 onDeleteClick={(e) => {
//                   e.stopPropagation()
//                   handleDelete(resume.id)
//                 }}
//               />
//             </div>
//           </div>
//         ))}
//       </div>

//       {selectedResume && (
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
//           <div className="lg:col-span-2">
//             <ExtractedZone cvId={selectedResume.id} customData={selectedResume.data} />
//           </div>

//           <div className="lg:col-span-1">
//             <ScrollArea className="h-[600px] rounded-md border">
//               <div className="relative aspect-[3/4] w-full">
//                 <Image
//                   src="/placeholder.svg?height=600&width=400"
//                   alt="Resume preview"
//                   fill
//                   className="object-contain"
//                   priority
//                 />
//               </div>
//             </ScrollArea>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }
