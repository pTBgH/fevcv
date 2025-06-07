"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, FileText, Heart, Archive, History, Settings, HelpCircle, Menu, X } from "lucide-react"
import { useLanguage } from "@/lib/i18n/context"

export function UserDashboardNav() {
  const pathname = usePathname()
  const { t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    {
      icon: LayoutDashboard,
      label: t("common.dashboard"),
      href: "/dashboard",
    },
    {
      icon: FileText,
      label: t("dashboard.resumes"),
      href: "/dashboard/resumes",
    },
    {
      icon: Heart,
      label: t("dashboard.favoriteJobs"),
      href: "/dashboard/favorite-jobs",
    },
    {
      icon: Archive,
      label: t("dashboard.archivedJobs"),
      href: "/dashboard/archived-jobs",
    },
    {
      icon: History,
      label: t("dashboard.history"),
      href: "/dashboard/history",
    },
    {
      icon: Settings,
      label: t("common.settings"),
      href: "/dashboard/settings",
    },
    {
      icon: HelpCircle,
      label: t("common.help"),
      href: "/dashboard/help",
    },
  ]

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 right-4 z-50 p-2 bg-white rounded-md shadow-md"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsOpen(false)}></div>
      )}

      {/* Navigation */}
      <nav
        className={`fixed md:sticky top-0 h-screen bg-white border-r w-64 transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">VietCV</h2>
        </div>

        <div className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 p-2 rounded-md transition ${
                    pathname === item.href ? "bg-indigo-50 text-indigo-600" : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  )
}
