"use client"

import { usePathname } from "next/navigation"
import { LayoutDashboard, FileText, Heart, Archive, History, Trash2, User, Menu } from "lucide-react"
import { useLanguage } from "@/lib/i18n/context"
import { useState } from "react"
import Link from "next/link"
import { ExpandedMenu } from "./expanded-menu"

export function MobileNav() {
  const pathname = usePathname()
  const langContext = useLanguage()
  const t = langContext?.t || ((key: string) => key)
  const [showMore, setShowMore] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const mainItems = [
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
      icon: Trash2,
      label: t("dashboard.bin"),
      href: "/dashboard/bin",
    },
  ]

  const moreItems = [
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
      icon: User,
      label: t("dashboard.profile"),
      href: "/dashboard/bio",
    },
  ]

  return (
    <>
      {/* Expanded Menu */}
      <ExpandedMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50">
        <div className="flex justify-around items-center h-16">
          {mainItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full ${
                pathname === item.href ? "text-blue-600" : "text-gray-500"
              }`}
            >
              <item.icon size={20} />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          ))}
          <button
            onClick={() => setMenuOpen(true)}
            className="flex flex-col items-center justify-center w-full h-full text-gray-500"
          >
            <Menu size={20} />
            <span className="text-xs mt-1">{t("common.more")}</span>
          </button>
        </div>
      </nav>

      {/* More menu overlay */}
      {showMore && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setShowMore(false)}>
          <div className="absolute bottom-16 left-0 right-0 bg-white rounded-t-xl p-4 shadow-lg">
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4"></div>
            <div className="grid grid-cols-4 gap-4">
              {moreItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex flex-col items-center p-3 rounded-lg"
                  onClick={() => setShowMore(false)}
                >
                  <div
                    className={`p-3 rounded-full mb-2 ${
                      pathname === item.href ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <item.icon size={20} />
                  </div>
                  <span className="text-xs text-center">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Spacer for content to not be hidden behind the bottom nav */}
      <div className="md:hidden h-16"></div>
    </>
  )
}
