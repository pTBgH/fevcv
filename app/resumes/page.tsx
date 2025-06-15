// "use client"

// import type React from "react"

// import { useEffect, useState } from "react"
// import { useLanguage } from "@/lib/i18n/context"
// import { ExternalLink, Heart, Trash2, ChevronDown } from "lucide-react"
// import { useRouter } from "next/navigation"
// import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
// import { fetchResumes, toggleFavorite } from "@/lib/redux/slices/resumeSlice"
// import Link from "next/link"
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// export default function ResumesManagement() {
//   const { t } = useLanguage()
//   const router = useRouter()
//   const dispatch = useAppDispatch()
//   const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null)

//   // Load resumes vào Redux store khi component mount
//   useEffect(() => {
//     dispatch(fetchResumes())
//   }, [dispatch])

//   // Lấy activeResumes từ Redux store sau khi đã load
//   const activeResumes = useAppSelector((state) => state.resumes.resumes)
//   const isLoading = useAppSelector((state) => state.resumes.loading)

//   // Handle upload new CV
//   const handleUploadCV = () => {
//     router.push("/upload")
//   }

//   // Handle toggle favorite
//   const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
//     e.stopPropagation()
//     dispatch(toggleFavorite(id))
//   }

//   // Handle view CV
//   const handleViewCV = (fileUrl: string, e: React.MouseEvent) => {
//     e.stopPropagation()
//     window.open(fileUrl, "_blank")
//   }

//   // Lấy resume được chọn từ danh sách
//   const selectedResume = selectedResumeId ? activeResumes.find((resume) => resume.id === selectedResumeId) : null

//   // Danh sách kỹ năng mẫu
//   const sampleSkills = [
//     "Data Science: 70%",
//     "Figma: 30%",
//     "UI/UX: 30%",
//     "Data Science: 70%",
//     "Figma: 30%",
//     "UI/UX: 30%",
//   ]

//   return (
//     <div className="bg-[#F0F0F0] min-h-screen">
//       <header className="bg-[#F0F0F0] py-4 px-6 flex items-center justify-between border-b border-gray-200">
//         <Link href="/" className="text-2xl font-bold">
//           VietCV
//         </Link>

//         <div className="flex items-center space-x-6">
//           <Link href="/dashboard" className="text-black hover:text-gray-700">
//             dashboard
//           </Link>

//           <DropdownMenu>
//             <DropdownMenuTrigger className="flex items-center text-black hover:text-gray-700 focus:outline-none">
//               resumes manager <ChevronDown className="ml-1 h-4 w-4" />
//             </DropdownMenuTrigger>
//             <DropdownMenuContent>
//               <DropdownMenuItem>
//                 <Link href="/dashboard/resumes" className="w-full">
//                   All Resumes
//                 </Link>
//               </DropdownMenuItem>
//               <DropdownMenuItem>
//                 <Link href="/upload" className="w-full">
//                   Upload Resume
//                 </Link>
//               </DropdownMenuItem>
//               <DropdownMenuItem>
//                 <Link href="/dashboard/bin" className="w-full">
//                   Deleted Resumes
//                 </Link>
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>

//         <button className="bg-black text-white px-3 py-1">MENU=</button>
//       </header>

//       <main className="container mx-auto py-6 px-4">
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
//           {/* Left column - Resume list */}
//           <div className="lg:col-span-3">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-lg font-medium">Your Resumes</h2>
//               <div className="flex space-x-1">
//                 <button className="p-1 hover:bg-gray-200 rounded">
//                   <Trash2 className="h-5 w-5 text-gray-500" />
//                 </button>
//                 <button className="p-1 hover:bg-gray-200 rounded">
//                   <Heart className="h-5 w-5 text-gray-500" />
//                 </button>
//               </div>
//             </div>

//             <div className="space-y-3">
//               {activeResumes.map((resume) => (
//                 <div
//                   key={resume.id}
//                   className={`relative border rounded-lg cursor-pointer transition-colors ${
//                     selectedResumeId === resume.id ? "bg-black text-white" : "bg-white hover:border-gray-300"
//                   }`}
//                   onClick={() => setSelectedResumeId(resume.id)}
//                 >
//                   <button
//                     className="absolute top-2 right-2 p-1 hover:bg-gray-200 hover:text-black rounded"
//                     onClick={(e) => handleViewCV(resume.fileUrl || "", e)}
//                   >
//                     <ExternalLink className="h-4 w-4" />
//                   </button>

//                   <div className="p-3">
//                     <div className="flex items-center">
//                       <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                         <path
//                           d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
//                           stroke="currentColor"
//                           strokeWidth="2"
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                         />
//                         <path
//                           d="M14 2V8H20"
//                           stroke="currentColor"
//                           strokeWidth="2"
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                         />
//                         <path
//                           d="M16 13H8"
//                           stroke="currentColor"
//                           strokeWidth="2"
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                         />
//                         <path
//                           d="M16 17H8"
//                           stroke="currentColor"
//                           strokeWidth="2"
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                         />
//                         <path
//                           d="M10 9H9H8"
//                           stroke="currentColor"
//                           strokeWidth="2"
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                         />
//                       </svg>
//                       <span className="flex-1 truncate">{resume.title}</span>
//                       <button
//                         className="ml-2 p-1 hover:bg-gray-200 hover:text-black rounded"
//                         onClick={(e) => handleToggleFavorite(resume.id, e)}
//                       >
//                         <Heart className={`h-4 w-4 ${resume.isFavorite ? "fill-red-500 text-red-500" : ""}`} />
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Skills tags */}
//             <div className="mt-6 flex flex-wrap gap-2">
//               {sampleSkills.map((skill, index) => (
//                 <span key={index} className="bg-black text-white px-3 py-1 rounded-full text-sm">
//                   {skill}
//                 </span>
//               ))}
//             </div>
//           </div>

//           {/* Middle column - Extracted information */}
//           <div className="lg:col-span-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <ExtractedField title="Degree" />
//               <ExtractedField title="Technical Skills" />
//               <ExtractedField title="Soft Skills" />
//               <ExtractedField title="Experience" />
//             </div>
//           </div>

//           {/* Right column - Suggested jobs */}
//           <div className="lg:col-span-3">
//             <h2 className="text-lg font-medium mb-4">Suggested Jobs</h2>
//             <div className="space-y-4">
//               {[1, 2, 3].map((job) => (
//                 <JobCard key={job} />
//               ))}
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   )
// }

// function ExtractedField({ title }: { title: string }) {
//   return (
//     <div className="bg-white rounded-lg p-4">
//       <h3 className="text-lg font-medium mb-2">{title}</h3>
//       <div className="h-32 bg-gray-100 rounded-lg"></div>
//     </div>
//   )
// }

// function JobCard() {
//   return (
//     <div className="w-full rounded-xl overflow-hidden">
//       {/* Top black section */}
//       <div className="bg-black p-4 text-white relative">
//         <div className="flex items-center mb-3">
//           <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-black font-bold mr-2">
//             G
//           </div>
//           <div>
//             <div className="font-medium">Suntary Pepsio</div>
//             <div className="text-sm text-gray-300">Việt Nam</div>
//           </div>
//         </div>

//         <h3 className="font-bold text-lg mb-3">Sr. UX Designer</h3>

//         <div className="flex flex-wrap gap-2">
//           <span className="inline-flex items-center px-2 py-1 bg-gray-700 text-gray-300 rounded-full text-xs">
//             <svg className="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//               <path
//                 d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               />
//               <circle
//                 cx="12"
//                 cy="10"
//                 r="3"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               />
//             </svg>
//             New York
//           </span>
//           <span className="inline-flex items-center px-2 py-1 bg-gray-700 text-gray-300 rounded-full text-xs">
//             <svg className="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//               <path
//                 d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2v11z"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               />
//             </svg>
//             3 years exp.
//           </span>
//           <span className="inline-flex items-center px-2 py-1 bg-gray-700 text-gray-300 rounded-full text-xs">
//             <svg className="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//               <circle
//                 cx="12"
//                 cy="12"
//                 r="10"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               />
//               <path
//                 d="M12 6v6l4 2"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               />
//             </svg>
//             Fulltime
//           </span>
//         </div>

//         {/* Action buttons */}
//         <div className="absolute top-2 right-2 flex space-x-1">
//           <button className="p-1.5 bg-gray-700 rounded-lg hover:bg-gray-600">
//             <Heart className="h-4 w-4" />
//           </button>
//           <button className="p-1.5 bg-gray-700 rounded-lg hover:bg-gray-600">
//             <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//               <path
//                 d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               />
//             </svg>
//           </button>
//           <button className="p-1.5 bg-gray-700 rounded-lg hover:bg-gray-600">
//             <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//               <path
//                 d="M18.6 18.6L12 12m0 0L5.4 5.4M12 12l6.6-6.6M12 12l-6.6 6.6"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//               />
//             </svg>
//           </button>
//         </div>
//       </div>

//       {/* Bottom white section */}
//       <div className="bg-white p-3 flex justify-between items-center">
//         <div className="flex items-center text-gray-500 text-sm">
//           <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//             <circle
//               cx="12"
//               cy="12"
//               r="10"
//               stroke="currentColor"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             />
//             <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//           </svg>
//           2 days ago
//         </div>
//         <div className="font-semibold">$50K/mo</div>
//       </div>
//     </div>
//   )
// }
