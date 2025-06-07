"use client"
import Link from "next/link"
import { X } from "lucide-react"
import { useLanguage } from "@/lib/i18n/context"
import { useAppDispatch } from "@/lib/redux/hooks"
import { logoutUser } from "@/lib/redux/slices/authSlice"
import { useRouter } from "next/navigation"

interface ExpandedMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function ExpandedMenu({ isOpen, onClose }: ExpandedMenuProps) {
  const { t } = useLanguage()
  const dispatch = useAppDispatch()
  const router = useRouter()

  const handleLogout = () => {
    dispatch(logoutUser())
      .unwrap()
      .then(() => {
        router.push("/")
        onClose()
      })
      .catch((error) => console.error("Logout failed:", error))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-yellow-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <Link href="/" className="text-4xl font-bold">
            VietCV
          </Link>
          <button
            onClick={onClose}
            className="bg-black text-white px-3 py-1 flex items-center"
            aria-label={t("common.closeMenu")}
          >
            MENU
            <X className="ml-1 h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Job Card Example - Left Column */}
          <div className="md:col-span-4">
            <div className="w-full rounded-[28px] border-2 border-black overflow-hidden shadow-md relative bg-white mb-6">
              {/* Action buttons overlay */}
              <div className="absolute top-0 right-0 z-20 flex space-x-1 p-1">
                <button className="w-12 h-12 border-2 border-black rounded-[20px] flex items-center justify-center bg-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  </svg>
                </button>
                <button className="w-12 h-12 border-2 border-black rounded-[20px] flex items-center justify-center bg-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                  </svg>
                </button>
                <button className="w-12 h-12 border-2 border-black rounded-[20px] flex items-center justify-center bg-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                    <line x1="2" x2="22" y1="2" y2="22" />
                  </svg>
                </button>
              </div>

              {/* Top black section */}
              <div className="bg-black p-5 text-white">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-white flex items-center justify-center rounded-lg mr-3 overflow-hidden flex-shrink-0">
                    <span className="text-black text-xl font-bold">G</span>
                  </div>
                  <div className="overflow-hidden">
                    <div className="font-semibold text-lg">Suntary Pepsio</div>
                    <div className="text-sm text-gray-400">Việt Nam</div>
                  </div>
                </div>

                <h3 className="font-bold text-2xl mb-4">Sr. UX Designer</h3>

                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-xs">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-1.5"
                    >
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    New York
                  </span>
                  <span className="inline-flex items-center px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-xs">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-1.5"
                    >
                      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                      <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
                    </svg>
                    3 years exp.
                  </span>
                  <span className="inline-flex items-center px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-xs">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-1.5"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    Fulltime
                  </span>
                </div>
              </div>

              {/* Bottom white section */}
              <div className="bg-white p-3 flex justify-between items-center">
                <div className="flex items-center text-gray-500 text-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-1.5"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span>2 days ago</span>
                </div>
                <div className="font-semibold text-lg text-black">$50K/mo</div>
              </div>
            </div>

            <div className="mt-auto pt-20">
              <button onClick={handleLogout} className="text-xl italic underline">
                log out
              </button>
            </div>
          </div>

          {/* Middle Column - Upload & Search, Settings, Contact */}
          <div className="md:col-span-4 space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-2">{t("common.uploadAndSearch")}</h2>
              <ul className="space-y-1">
                <li>
                  <Link href="/upload" className="hover:underline">
                    {t("common.upload")}
                  </Link>
                </li>
                <li>
                  <Link href="/search" className="hover:underline">
                    {t("common.search")}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-2">{t("common.settings")}</h2>
              <ul className="space-y-1">
                <li>
                  <Link href="/dashboard/settings" className="hover:underline">
                    {t("settings.profile")}
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/settings" className="hover:underline">
                    {t("settings.loginInformation")}
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/settings" className="hover:underline">
                    {t("common.notifications")}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-2">{t("common.contact")}</h2>
              <ul className="space-y-1">
                <li>
                  <Link href="/dashboard/help" className="hover:underline">
                    {t("help.faqs")}
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/contact" className="hover:underline">
                    {t("contact.contactForm")}
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column - Dashboard, Contact Info */}
          <div className="md:col-span-4 space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-2">{t("common.dashboard")}</h2>
              <ul className="space-y-1">
                <li>
                  <Link href="/dashboard" className="hover:underline">
                    {t("dashboard.overview")}
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/resumes" className="hover:underline">
                    {t("dashboard.resumesManager")}
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/notifications" className="hover:underline">
                    {t("common.notifications")}
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/favorite-jobs" className="hover:underline">
                    {t("dashboard.favouriteJobs")}
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/archived-jobs" className="hover:underline">
                    {t("dashboard.archivedJobs")}
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/history" className="hover:underline">
                    {t("dashboard.history")}
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/bin" className="hover:underline">
                    {t("dashboard.bin")}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <Link href="mailto:contact@vcv.com" className="text-xl font-medium underline block mb-1">
                contact@vcv.com
              </Link>
              <p className="text-gray-600">DATCOM Lab,...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
