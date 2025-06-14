// "use client"

// import { useState, useCallback } from "react"

// export type ToastType = "success" | "error" | "info" | "warning"

// export interface ToastAction {
//   label: string
//   onClick: () => void
// }

// export interface Toast {
//   id: string
//   title: string
//   description?: string
//   type: ToastType
//   duration?: number
//   action?: ToastAction
// }

// interface UseToastReturn {
//   toasts: Toast[]
//   addToast: (toast: Omit<Toast, "id">) => void
//   removeToast: (id: string) => void
//   clearToasts: () => void
// }

// export function useToast(maxToasts = 3): UseToastReturn {
//   const [toasts, setToasts] = useState<Toast[]>([])

//   const addToast = useCallback(
//     (toast: Omit<Toast, "id">) => {
//       const id = Math.random().toString(36).substring(2, 9)

//       // Add new toast to the beginning of the array
//       setToasts((prevToasts) => {
//         // Limit to maxToasts
//         const newToasts = [{ id, ...toast }, ...prevToasts].slice(0, maxToasts)
//         return newToasts
//       })

//       // Auto remove after duration
//       const duration = toast.duration || 2000
//       setTimeout(() => {
//         removeToast(id)
//       }, duration)
//     },
//     [maxToasts],
//   )

//   const removeToast = useCallback((id: string) => {
//     setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
//   }, [])

//   const clearToasts = useCallback(() => {
//     setToasts([])
//   }, [])

//   return {
//     toasts,
//     addToast,
//     removeToast,
//     clearToasts,
//   }
// }
