"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Info, CheckCircle, AlertTriangle, AlertCircle, MoreVertical, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import type { Notification } from "@/lib/notification-service"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/lib/i18n/context"

interface NotificationItemProps {
  notification: Notification
  onClick?: () => void
  showActions?: boolean
  onMarkAsRead?: () => void
  onDelete?: () => void
}

export function NotificationItem({
  notification,
  onClick,
  showActions = false,
  onMarkAsRead,
  onDelete,
}: NotificationItemProps) {
  const [isHovered, setIsHovered] = useState(false)
  const { t } = useLanguage()
  const router = useRouter()

  const getIcon = () => {
    switch (notification.type) {
      case "info":
        return <Info className="h-5 w-5 text-blue-500 dark:text-blue-400" />
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
      default:
        return <Info className="h-5 w-5 text-blue-500 dark:text-blue-400" />
    }
  }

  const handleNavigateToLink = (e: React.MouseEvent) => {
    e.stopPropagation()

    // Mark as read first
    if (onMarkAsRead && !notification.isRead) {
      onMarkAsRead()
    }

    // Then navigate
    if (notification.link && notification.link !== "#") {
      if (notification.link.startsWith("/")) {
        router.push(notification.link)
      } else if (notification.link.startsWith("http")) {
        window.open(notification.link, "_blank")
      }
    }
  }

  // Format the date for display
  const formattedDate = format(new Date(notification.createdAt), "dd/MM/yyyy HH:mm")

  return (
    <div
      className={cn(
        "flex items-start p-2 sm:p-3 hover:bg-gray-50 dark:hover:bg-slate-600/50 transition-all duration-300 border-b last:border-b-0 dark:border-slate-600 cursor-pointer",
        !notification.isRead && "bg-blue-50 dark:bg-indigo-900/40 hover:bg-blue-50 dark:hover:bg-indigo-800/50",
      )}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex-shrink-0 mt-0.5 mr-3">{getIcon()}</div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between">
          <p className={cn("text-xs sm:text-sm font-medium dark:text-white", !notification.isRead && "font-semibold")}>
            {notification.title}
          </p>

          {showActions && isHovered && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="text-gray-400 hover:text-gray-600 dark:text-indigo-300 dark:hover:text-indigo-100 transition-colors duration-300"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="dark:bg-slate-800 dark:border-indigo-500/50 dark:shadow-lg dark:shadow-indigo-900/20"
              >
                {!notification.isRead && onMarkAsRead && (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      onMarkAsRead()
                    }}
                    className="dark:text-indigo-200 dark:focus:bg-indigo-600/30 dark:focus:text-white transition-colors duration-300"
                  >
                    {t("notifications.markAsRead")}
                  </DropdownMenuItem>
                )}
                {notification.link && notification.link !== "#" && (
                  <DropdownMenuItem
                    onClick={handleNavigateToLink}
                    className="dark:text-indigo-200 dark:focus:bg-indigo-600/30 dark:focus:text-white transition-colors duration-300"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    {t("notifications.viewDetails")}
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem
                    className="text-red-600 dark:text-red-400 dark:focus:bg-red-600/30 dark:focus:text-white transition-colors duration-300"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete()
                    }}
                  >
                    {t("notifications.delete")}
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <p className="text-xs sm:text-sm text-gray-600 dark:text-indigo-200 line-clamp-2">{notification.message}</p>

        <div className="flex justify-between items-center mt-1">
          <p className="text-[0.65rem] sm:text-xs text-gray-500 dark:text-indigo-300">{formattedDate}</p>
          <p className="text-[0.65rem] sm:text-xs text-gray-400 dark:text-indigo-400 italic">{notification.timeAgo}</p>
        </div>
      </div>

      {!notification.isRead && (
        <div className="w-2 h-2 bg-blue-500 dark:bg-indigo-400 rounded-full flex-shrink-0 mt-2" />
      )}
    </div>
  )
}
