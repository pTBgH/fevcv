"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  FileText,
  Heart,
  Archive,
  History,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Bell,
} from "lucide-react"
import { useLanguage } from "@/lib/i18n/context"
import { myAppHook } from "@/context/AppProvider"

export function Sidebar() {
  const [expanded, setExpanded] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const { t, locale } = useLanguage()
  const pathname = usePathname()
  const router = useRouter()
  const { logout } = myAppHook()

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)

    // Listen for toggle events from the dashboard nav
    const handleToggleSidebar = (event: any) => {
      if (isMobile) {
        setIsOpen(event.detail.isOpen)
      }
    }

    window.addEventListener("toggleSidebar", handleToggleSidebar)

    // Listen for language changes
    const handleLanguageChange = () => {
      // Force re-render when language changes
      setExpanded(expanded)
    }

    window.addEventListener("languageChange", handleLanguageChange)

    return () => {
      window.removeEventListener("resize", checkMobile)
      window.removeEventListener("toggleSidebar", handleToggleSidebar)
      window.removeEventListener("languageChange", handleLanguageChange)
    }
  }, [isMobile, expanded])

  const toggleSidebar = () => {
    if (isMobile) {
      setIsOpen(!isOpen)
    } else {
      setExpanded(!expanded)
    }
  }

  const handleLogout = () => {
    if (typeof logout === "function") {
      logout()
    } else {
      console.error("logout is not a function")
    }
    router.push("/")
  }

  // Modified sidebar class to include the toggle button inside
  const sidebarClass = isMobile
    ? `fixed top-16 inset-y-auto left-0 z-40 w-64 bg-gradient-to-b from-slate-900 to-slate-800 transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out h-[calc(100vh-4rem)] shadow-xl shadow-purple-900/20`
    : `bg-gradient-to-b from-slate-900 to-slate-800 border-r dark:border-slate-700 flex flex-col py-4 relative ${expanded ? "w-64" : "w-16"} transition-all duration-300 shadow-xl shadow-purple-900/20`

  const overlayClass =
    isMobile && isOpen ? "fixed inset-0 bg-black bg-opacity-50 z-30 top-16 backdrop-blur-sm" : "hidden"

  return (
    <>
      <div className={overlayClass} onClick={() => setIsOpen(false)}></div>
      <aside className={`${sidebarClass} flex flex-col justify-between`}>
        {/* Collapse button attached to the sidebar */}
        {!isMobile && (
          <button
            onClick={toggleSidebar}
            className="absolute -right-3 top-1/2 bg-indigo-600 dark:bg-indigo-500 border border-indigo-400 p-1 rounded-full shadow-md hover:bg-indigo-500 dark:hover:bg-indigo-400 z-10 transition-colors text-white"
            aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            {expanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        )}

        <SidebarTop expanded={expanded} pathname={pathname} />
        <SidebarBottom expanded={expanded} logoutHandler={handleLogout} />
      </aside>
    </>
  )
}

function SidebarTop({
  expanded,
  pathname,
}: {
  expanded: boolean
  pathname: string
}) {
  const { t } = useLanguage()

  return (
    <nav className="flex-1 space-y-2 px-2">
      <SidebarItem
        icon={LayoutDashboard}
        href="/dashboard"
        label={t("common.dashboard")}
        expanded={expanded}
        isActive={pathname === "/dashboard"}
      />
      <SidebarItem
        icon={FileText}
        href="/dashboard/resumes"
        label={t("dashboard.resumes")}
        expanded={expanded}
        isActive={pathname === "/dashboard/resumes"}
      />
      <SidebarItem
        icon={Heart}
        href="/dashboard/favorite-jobs"
        label={t("dashboard.favoriteJobs")}
        expanded={expanded}
        isActive={pathname === "/dashboard/favorite-jobs"}
      />
      <SidebarItem
        icon={Archive}
        href="/dashboard/archived-jobs"
        label={t("dashboard.archivedJobs")}
        expanded={expanded}
        isActive={pathname === "/dashboard/archived-jobs"}
      />
      <SidebarItem
        icon={History}
        href="/dashboard/history"
        label={t("dashboard.history")}
        expanded={expanded}
        isActive={pathname === "/dashboard/history"}
      />
      <SidebarItem
        icon={Trash2}
        href="/dashboard/bin"
        label={t("dashboard.bin")}
        expanded={expanded}
        isActive={pathname === "/dashboard/bin"}
      />
      <SidebarItem
        icon={Bell}
        href="/dashboard/notifications"
        label={t("notifications.notifications")}
        expanded={expanded}
        isActive={pathname === "/dashboard/notifications"}
      />
    </nav>
  )
}

interface SidebarBottomProps {
  expanded: boolean
  logoutHandler: () => void
}

function SidebarBottom({ expanded, logoutHandler }: SidebarBottomProps) {
  const { t } = useLanguage()

  return (
    <nav className="space-y-2 px-2 pb-4">
      <SidebarItem icon={Settings} href="/dashboard/settings" label={t("common.settings")} expanded={expanded} />
      <SidebarItem icon={HelpCircle} href="/dashboard/help" label={t("common.help")} expanded={expanded} />
      <button
        onClick={logoutHandler}
        className="flex items-center gap-3 w-full p-2 rounded-md transition text-gray-300 hover:bg-red-500/20 hover:text-red-300 focus:outline-none"
      >
        <LogOut className="w-5 h-5 text-gray-300 group-hover:text-red-300" />
        {expanded && <span className="text-gray-300 group-hover:text-red-300 text-sm">{t("common.logout")}</span>}
      </button>
    </nav>
  )
}

function SidebarItem({
  icon: Icon,
  href,
  label,
  expanded,
  isActive = false,
}: {
  icon: any
  href: string
  label: string
  expanded: boolean
  isActive?: boolean
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 p-2 rounded-md transition-all duration-300 group ${
        isActive
          ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-600/30"
          : "text-gray-300 hover:bg-indigo-600/20 hover:text-indigo-300"
      }`}
    >
      <Icon
        className={`w-5 h-5 ${
          isActive ? "text-white" : "text-gray-300 group-hover:text-indigo-300"
        } transition-colors duration-300`}
      />
      {expanded && (
        <span
          className={
            isActive
              ? "text-white text-sm font-medium"
              : "text-gray-300 group-hover:text-indigo-300 text-sm transition-colors duration-300"
          }
        >
          {label}
        </span>
      )}
    </Link>
  )
}
