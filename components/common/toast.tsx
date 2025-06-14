// "use client"

// import { useState, useEffect } from "react"
// import { X } from "lucide-react"
// import { cn } from "@/lib/utils"
// import type { Toast as ToastType } from "@/hooks/use-toast"

// interface ToastProps {
//   toast: ToastType
//   onClose: () => void
// }

// export function Toast({ toast, onClose }: ToastProps) {
//   const [isVisible, setIsVisible] = useState(false)

//   useEffect(() => {
//     // Trigger entrance animation
//     const enterTimeout = setTimeout(() => {
//       setIsVisible(true)
//     }, 10)

//     return () => clearTimeout(enterTimeout)
//   }, [])

//   const handleClose = () => {
//     setIsVisible(false)
//     // Wait for exit animation to complete
//     setTimeout(() => {
//       onClose()
//     }, 300)
//   }

//   const getTypeStyles = () => {
//     switch (toast.type) {
//       case "success":
//         return "bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300"
//       case "error":
//         return "bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300"
//       case "warning":
//         return "bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-300"
//       default:
//         return "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300"
//     }
//   }

//   return (
//     <div
//       className={cn(
//         "transform transition-all duration-300 ease-in-out",
//         "max-w-sm w-full shadow-lg rounded-lg pointer-events-auto border",
//         getTypeStyles(),
//         isVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
//       )}
//     >
//       <div className="p-4">
//         <div className="flex items-start">
//           <div className="flex-1">
//             <p className="text-sm font-medium">{toast.title}</p>
//             {toast.description && <p className="mt-1 text-sm opacity-90">{toast.description}</p>}
//             {toast.action && (
//               <button
//                 onClick={(e) => {
//                   e.preventDefault()
//                   e.stopPropagation()
//                   toast.action?.onClick()
//                 }}
//                 className="mt-2 text-sm font-medium underline"
//               >
//                 {toast.action.label}
//               </button>
//             )}
//           </div>
//           <button
//             onClick={handleClose}
//             className="ml-4 flex-shrink-0 text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400"
//           >
//             <X className="h-4 w-4" />
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

// export function ToastContainer({ toasts, onClose }: { toasts: ToastType[]; onClose: (id: string) => void }) {
//   if (toasts.length === 0) return null

//   return (
//     <div className="fixed bottom-0 right-0 z-50 p-4 space-y-2 max-h-screen overflow-hidden pointer-events-none">
//       <div className="flex flex-col items-end space-y-2 pointer-events-auto">
//         {toasts.map((toast) => (
//           <Toast key={toast.id} toast={toast} onClose={() => onClose(toast.id)} />
//         ))}
//       </div>
//     </div>
//   )
// }
