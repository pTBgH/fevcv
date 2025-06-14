"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LanguageSwitcher } from "@/components/common/language-switcher"
import { useLanguage } from "@/lib/i18n/context"
import ProfileDropdownMenu from "./profile-dropdown-menu"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import { ExpandedMenu } from "./expanded-menu"
import { useSession, signIn, signOut } from "next-auth/react"

interface ProfileDropdownMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export function MainNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [expandedMenuOpen, setExpandedMenuOpen] = useState(false)

  const router = useRouter()
  const pathname = usePathname()
  const { t } = useLanguage()

  // Using Next‑Auth session for auth state instead of Redux
  const { data: session, status } = useSession()

  const handleDashboardClick = () => {
    router.push("/dashboard")
  }

  const handleLogin = () => {
    // Trigger Next‑Auth login flow (Keycloak)
    signIn("keycloak")
  }

  const handleLogout = () => {
    signOut({ callbackUrl: "/" })
    setProfileMenuOpen(false)
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev)
  }

  const toggleExpandedMenu = () => {
    setExpandedMenuOpen((prev) => !prev)
  }

  return (
    <div className="relative">
      <header className="sticky top-0 z-50 w-full border-b bg-white dark:bg-gray-900 dark:border-gray-800">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          {/* Left side: Logo & Desktop Navigation */}
          <div className="flex items-center gap-4">
            <Link href="/" className="text-blue-600 dark:text-blue-400 text-xl font-bold">
              VietCV
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                {t("common.home")}
              </Link>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                <Search className="h-4 w-4" />
                <Link href="/search">{t("common.searchJobs")}</Link>
              </div>
            </nav>
          </div>

          {/* Right side: Desktop & Mobile Actions */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-4">
              <ThemeToggle />
              <LanguageSwitcher />
              <Button variant="ghost" onClick={() => router.push("/upload")}>
                {t("common.uploadResume")}
              </Button>
              {status === "authenticated" ? (
                <>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                    onClick={handleDashboardClick}
                  >
                    {t("common.dashboard")}
                  </Button>
                  <div className="relative">
                    <button
                      onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                      className="flex items-center focus:outline-none"
                    >
                      <Image
                        src="/placeholder.svg?height=32&width=32"
                        alt="Profile"
                        width={32}
                        height={32}
                        className="rounded-full border-2 border-transparent hover:border-blue-500 transition-all"
                      />
                    </button>
                    <ProfileDropdownMenu
                      onLogout={handleLogout}
                    />
                  </div>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                    onClick={handleLogin}
                  >
                    {t("common.login")}
                  </Button>
                  <Link href="/auth">
                    <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">
                      {t("common.signup")}
                    </Button>
                  </Link>
                </>
              )}
              <Button
                variant="outline"
                className="border-2 border-black px-3 py-1 flex items-center"
                onClick={toggleExpandedMenu}
              >
                MENU
              </Button>
            </div>

            {/* Mobile Actions */}
            <div className="flex md:hidden items-center gap-4">
              <ThemeToggle />
              <Link href="/search">
                <Search className="h-6 w-6 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white" />
              </Link>
              <LanguageSwitcher />
              <button onClick={toggleExpandedMenu} className="border-2 border-black px-3 py-1 flex items-center">
                MENU
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu - only show when not authenticated */}
      {status !== "authenticated" && mobileMenuOpen && (
        <div className="md:hidden absolute top-16 right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 border dark:border-gray-700 z-[9999]">
          <div className="flex flex-col">
            <Link
              href="/upload"
              className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("common.uploadResume")}
            </Link>
            <button
              className="text-left block w-full px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => {
                handleLogin()
                setMobileMenuOpen(false)
              }}
            >
              {t("common.login")}
            </button>
            <Link
              href="/auth"
              className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("common.signup")}
            </Link>
          </div>
        </div>
      )}

      {/* Expanded Menu */}
      <ExpandedMenu isOpen={expandedMenuOpen} onClose={() => setExpandedMenuOpen(false)} />
    </div>
  )
}
