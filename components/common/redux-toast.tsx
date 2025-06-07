"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { X, Undo, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks"
import { selectToasts, removeToast } from "@/lib/redux/slices/toastSlice"
import type { Toast } from "@/lib/redux/slices/toastSlice"
import { useLanguage } from "@/lib/i18n/context"

interface ToastProps {
  toast: Toast
  onClose: () => void
}

function ToastItem({ toast, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [progress, setProgress] = useState(100)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const duration = toast.duration || 5000
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const { t } = useLanguage()

  useEffect(() => {
    // Trigger entrance animation
    const enterTimeout = setTimeout(() => {
      setIsVisible(true)
    }, 10)

    // Set up progress bar
    if (duration !== Number.POSITIVE_INFINITY && duration > 0) {
      const startTime = Date.now()
      const endTime = startTime + duration

      progressIntervalRef.current = setInterval(() => {
        const now = Date.now()
        const remaining = Math.max(0, endTime - now)
        const progressValue = (remaining / duration) * 100

        setProgress(progressValue)

        if (progressValue <= 0) {
          if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current)
          }
          handleClose()
        }
      }, 10)

      // Backup timer to ensure toast is removed
      timerRef.current = setTimeout(() => {
        handleClose()
      }, duration + 300) // Add a small buffer
    }

    return () => {
      clearTimeout(enterTimeout)
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [duration])

  const handleClose = () => {
    setIsVisible(false)
    // Wait for exit animation to complete
    setTimeout(() => {
      onClose()
    }, 300)
  }

  const handleUndoClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (toast.undoAction?.undoFunction) {
      toast.undoAction.undoFunction()
    }

    if (toast.action?.onClick) {
      toast.action.onClick()
    }

    handleClose()
  }

  const getTypeStyles = () => {
    switch (toast.type) {
      case "success":
        return {
          container: "bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700",
          text: "text-green-800 dark:text-green-300",
          progress: "bg-green-500 dark:bg-green-400",
          icon: <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400" />,
        }
      case "error":
        return {
          container: "bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700",
          text: "text-red-800 dark:text-red-300",
          progress: "bg-red-500 dark:bg-red-400",
          icon: <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400" />,
        }
      case "warning":
        return {
          container: "bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-700",
          text: "text-yellow-800 dark:text-yellow-300",
          progress: "bg-yellow-500 dark:bg-yellow-400",
          icon: <AlertTriangle className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />,
        }
      default:
        return {
          container: "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700",
          text: "text-blue-800 dark:text-blue-300",
          progress: "bg-blue-500 dark:bg-blue-400",
          icon: <Info className="h-5 w-5 text-blue-500 dark:text-blue-400" />,
        }
    }
  }

  const styles = getTypeStyles()

  // Determine if we should show entity context
  const hasEntityContext = toast.entityContext?.name && toast.entityContext?.type

  return (
    <div
      className={cn(
        "transform transition-all duration-300 ease-in-out",
        "max-w-sm w-full shadow-lg rounded-lg pointer-events-auto border",
        styles.container,
        isVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
      )}
    >
      <div className="relative overflow-hidden rounded-lg">
        {/* Progress bar */}
        {duration !== Number.POSITIVE_INFINITY && (
          <div
            className={cn("h-1 absolute bottom-0 left-0 transition-all", styles.progress)}
            style={{ width: `${progress}%` }}
          />
        )}

        <div className="p-4">
          <div className="flex items-start">
            {/* Icon */}
            <div className="flex-shrink-0 mr-3 pt-0.5">{styles.icon}</div>

            <div className={cn("flex-1", styles.text)}>
              <p className="text-sm font-medium">{toast.title}</p>

              {/* Entity context */}
              {hasEntityContext && <p className="mt-1 text-sm font-medium">{toast.entityContext?.name}</p>}

              {/* Regular description */}
              {toast.description && !hasEntityContext && <p className="mt-1 text-sm opacity-90">{toast.description}</p>}

              {/* Undo button */}
              {(toast.action || toast.undoAction) && (
                <button
                  onClick={handleUndoClick}
                  className={cn(
                    "mt-2 text-sm font-medium flex items-center",
                    "px-2 py-1 rounded-md transition-colors",
                    "hover:bg-black/5 dark:hover:bg-white/10",
                    styles.text,
                  )}
                >
                  <Undo className="h-3 w-3 mr-1" />
                  {toast.action?.label || t("common.undo")}
                </button>
              )}
            </div>
            <button
              onClick={handleClose}
              className="ml-4 flex-shrink-0 text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ReduxToastContainer() {
  const toasts = useAppSelector(selectToasts)
  const dispatch = useAppDispatch()

  const handleClose = (id: string) => {
    dispatch(removeToast(id))
  }

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-0 right-0 z-50 p-4 space-y-2 max-h-screen overflow-hidden pointer-events-none">
      <div className="flex flex-col items-end space-y-3 pointer-events-auto">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={() => handleClose(toast.id)} />
        ))}
      </div>
    </div>
  )
}
