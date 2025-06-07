"use client"

import { Bell } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { useLanguage } from "@/lib/i18n/context"
import Link from "next/link"

export function NotificationDropdown() {
  const { t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [hasUnread, setHasUnread] = useState(true)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
    if (isOpen) {
      setHasUnread(false)
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="relative p-1 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
      >
        <Bell className="h-6 w-6" />
        {hasUnread && (
          <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
          <div className="p-4 border-b dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{t("common.notifications")}</h3>
              <Link
                href="/dashboard/notifications"
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                {t("common.viewAll")}
              </Link>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {[1, 2, 3].map((i) => (
              <Link
                key={i}
                href={`/dashboard/notifications/${i}`}
                className="block p-4 hover:bg-gray-50 dark:hover:bg-gray-700 border-b dark:border-gray-700 last:border-0"
              >
                <div className="flex justify-between">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {t("notifications.newJobMatch")}
                  </p>
                  <span className="text-xs text-gray-500 dark:text-gray-400">2h ago</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {t("notifications.jobMatchDescription")}
                </p>
              </Link>
            ))}

            {[1, 2, 3].length === 0 && (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                {t("notifications.noNotifications")}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
