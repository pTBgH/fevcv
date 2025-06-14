"use client"

import Link from "next/link"
import { Menu, ChevronDown } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useLanguage } from "@/lib/i18n/context"
import { LanguageSwitcher } from "@/components/common/language-switcher"
import { NotificationDropdown } from "@/components/notifications/notification-dropdown"
import { useState, useEffect, useRef } from "react"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import ProfileDropdownMenu from "@/components/layout/profile-dropdown-menu"
import { ExpandedMenu } from "./expanded-menu"
import { signOut } from "next-auth/react" // Using Next‑Auth for logout

export function DashboardNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { t } = useLanguage()
  const [menuOpen, setMenuOpen] = useState(false)
  const [resumesDropdownOpen, setResumesDropdownOpen] = useState(false)
  const navBgColor = "bg-white"

  const menuRef = useRef<HTMLDivElement>(null)
  const resumesDropdownRef = useRef<HTMLDivElement>(null)

  // Close resumes dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        resumesDropdownRef.current &&
        !resumesDropdownRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest('[data-dropdown-toggle="resumes-dropdown"]')
      ) {
        setResumesDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  // Logout using Next‑Auth signOut (Keycloak)
  const handleLogout = () => {
    signOut({ callbackUrl: "/" })
  }

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-40 ${navBgColor} border-b border-gray-200 shadow-sm`}>
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0">
              <Link href="/" className="text-2xl font-bold">
                VietCV
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="/dashboard"
                className={`text-gray-700 hover:text-black ${pathname === "/dashboard" ? "font-semibold" : ""}`}
              >
                Dashboard
              </Link>
              <div className="relative" ref={resumesDropdownRef}>
                <button
                  data-dropdown-toggle="resumes-dropdown"
                  onClick={() => setResumesDropdownOpen(!resumesDropdownOpen)}
                  className={`flex items-center text-gray-700 hover:text-black ${pathname.includes("/dashboard/resumes") ? "font-semibold" : ""}`}
                >
                  Resumes Manager
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                {resumesDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <Link href="/dashboard/resumes" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      All Resumes
                    </Link>
                    <Link href="/upload" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Upload Resume
                    </Link>
                    <Link href="/dashboard/bin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Deleted Resumes
                    </Link>
                  </div>
                )}
              </div>
            </div>
            {/* Right side actions */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-3">
                <ThemeToggle />
                <LanguageSwitcher />
                <NotificationDropdown />
                <ProfileDropdownMenu onLogout={handleLogout} />
              </div>
              {/* Mobile Menu Button */}
              <button
                className="inline-flex items-center justify-center p-2 rounded-md text-white bg-black px-3"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <span className="mr-1 font-medium">MENU</span>
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <ExpandedMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
