// "use client"

// import type React from "react"
// import { createContext, useContext } from "react"
// import { ToastContainer } from "@/components/common/toast"
// import { useReduxToast } from "@/hooks/use-redux-toast"
// import type { ToastType } from "@/lib/redux/slices/toastSlice"

// interface ToastContextType {
//   toast: (props: {
//     title: string
//     description?: string
//     type?: ToastType
//     duration?: number
//   }) => void
//   dismiss: (id: string) => void
// }

// const ToastContext = createContext<ToastContextType | undefined>(undefined)

// export function ToastProvider({ children }: { children: React.ReactNode }) {
//   const { toasts, toast, dismiss } = useReduxToast()

//   return (
//     <ToastContext.Provider value={{ toast, dismiss }}>
//       {children}
//       <ToastContainer toasts={toasts} onClose={dismiss} />
//     </ToastContext.Provider>
//   )
// }

// export function useToastContext() {
//   const context = useContext(ToastContext)
//   if (context === undefined) {
//     throw new Error("useToastContext must be used within a ToastProvider")
//   }
//   return context
// }
