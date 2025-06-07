"use client"

import type React from "react"

import { Heart, Trash2, LogOut, Settings, Bell, Bookmark, History, User, ChevronDown } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/i18n/context"
import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useAppDispatch } from "@/lib/redux/hooks"
import { logoutUser } from "@/lib/redux/slices/authSlice"

type MenuItemType = "default" | "red" | "yellow"

function DropdownItem({
  href,
  label,
  icon: Icon,
  onClick,
  type = "default",
}: {
  href?: string
  label: string
  icon: React.ElementType
  onClick?: () => void
  type?: MenuItemType
}) {
  const base = cn(
    "group flex items-center px-4 py-2 text-sm w-full transition-colors duration-150",
    "hover:bg-blue-100 dark:hover:bg-blue-700/40",
    "text-gray-700 dark:text-gray-200",
  )

  const iconColor = cn(
    "mr-3 h-5 w-5 text-gray-400 dark:text-gray-300",
    type === "red"
      ? "group-hover:text-red-500 dark:group-hover:text-red-400"
      : type === "yellow"
        ? "group-hover:text-yellow-500 dark:group-hover:text-yellow-400"
        : "group-hover:text-gray-500 dark:group-hover:text-gray-200",
  )

  const content = (
    <>
      <Icon className={iconColor} />
      {label}
    </>
  )

  if (onClick) {
    return (
      <button onClick={onClick} className={base}>
        {content}
      </button>
    )
  }
  if (href) {
    return (
      <Link href={href} className={base}>
        {content}
      </Link>
    )
  }

  return null
}

// Thêm export named để tương thích với các import hiện tại
export function ProfileDropdownMenu({
  isOpen,
  onClose,
  onLogout,
}: { isOpen: boolean; onClose: () => void; onLogout: () => void }) {
  const { t } = useLanguage()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [onClose])

  if (!isOpen) return null

  return (
    <div
      className={cn(
        "absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-200 dark:divide-gray-700",
        "rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5",
        "overflow-hidden",
      )}
      ref={dropdownRef}
    >
      <div className="px-4 py-3">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">John Doe</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">john.doe@example.com</p>
      </div>

      <div className="py-1">
        <DropdownItem href="/dashboard/settings" label={t("common.settings")} icon={Settings} />
        <DropdownItem href="/dashboard/notifications" label={t("common.notifications")} icon={Bell} />
      </div>

      <div className="py-1">
        <DropdownItem href="/dashboard/favorite-jobs" label={t("common.favoriteJobs")} icon={Heart} type="red" />
        <DropdownItem href="/dashboard/archived-jobs" label={t("common.archivedJobs")} icon={Bookmark} type="yellow" />
        <DropdownItem href="/dashboard/bin" label={t("common.bin")} icon={Trash2} />
      </div>

      <div className="py-1">
        <DropdownItem href="/dashboard/history" label={t("common.history")} icon={History} />
      </div>

      <div className="py-1">
        <DropdownItem label={t("auth.logout")} icon={LogOut} onClick={onLogout} type="red" />
      </div>
    </div>
  )
}

// Giữ lại default export cho các import hiện tại
export default function StandaloneProfileDropdownMenu() {
  const { t } = useLanguage()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [isOpen, setIsOpen] = useState(false)
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

  const handleLogout = () => {
    dispatch(logoutUser())
      .unwrap()
      .then(() => {
        router.push("/")
      })
      .catch((error) => console.error("Logout failed:", error))
  }

  const trigger = (
    <button
      onClick={() => setIsOpen(!isOpen)}
      className={cn(
        "inline-flex w-full justify-center items-center gap-x-1.5 rounded-md",
        "bg-white dark:bg-gray-800 px-3 py-2 text-sm font-semibold",
        "text-gray-900 dark:text-gray-200 shadow-sm ring-1 ring-inset",
        "ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50",
        "transition-all duration-200",
      )}
    >
      <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
        <User className="h-5 w-5 text-gray-500 dark:text-gray-300" />
      </div>
      <ChevronDown
        className={cn("h-5 w-5 text-gray-400 dark:text-gray-300 transition-transform", isOpen ? "rotate-180" : "")}
        aria-hidden="true"
      />
    </button>
  )

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {trigger}

      {isOpen && (
        <div
          className={cn(
            "absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-200 dark:divide-gray-700",
            "rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5",
            "overflow-hidden",
          )}
        >
          <div className="px-4 py-3">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">John Doe</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">john.doe@example.com</p>
          </div>

          <div className="py-1">
            <DropdownItem href="/dashboard/settings" label={t("common.settings")} icon={Settings} />
            <DropdownItem href="/dashboard/notifications" label={t("common.notifications")} icon={Bell} />
          </div>

          <div className="py-1">
            <DropdownItem href="/dashboard/favorite-jobs" label={t("common.favoriteJobs")} icon={Heart} type="red" />
            <DropdownItem
              href="/dashboard/archived-jobs"
              label={t("common.archivedJobs")}
              icon={Bookmark}
              type="yellow"
            />
            <DropdownItem href="/dashboard/bin" label={t("common.bin")} icon={Trash2} />
          </div>

          <div className="py-1">
            <DropdownItem href="/dashboard/history" label={t("common.history")} icon={History} />
          </div>

          <div className="py-1">
            <DropdownItem label={t("auth.logout")} icon={LogOut} onClick={handleLogout} type="red" />
          </div>
        </div>
      )}
    </div>
  )
}
