"use client"

import Link from "next/link"
import { X } from "lucide-react"
import { useLanguage } from "@/lib/i18n/context"
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

interface ExpandedMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function ExpandedMenu({ isOpen, onClose }: ExpandedMenuProps) {
  const { t } = useLanguage()
  const router = useRouter()

  // Use Next‑Auth signOut for logout; no legacy Redux actions
  const handleLogout = () => {
    signOut({ callbackUrl: "/" })
    onClose()
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
          {/* Left Column Example */}
          <div className="md:col-span-4">
            {/* Example Action Buttons or Content can be added here */}
            <div className="mt-auto pt-20">
              <button onClick={handleLogout} className="text-xl italic underline">
                {t("common.logout") || "Log out"}
              </button>
            </div>
          </div>

          {/* Other columns and content as needed */}
        </div>
      </div>
    </div>
  )
}
