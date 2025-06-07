"use client"

import type React from "react"

import { MoreVertical, Eye, Pencil, Copy, Trash, RotateCcw } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/lib/i18n/context"

export type CVMenuContext = "resumes" | "favorites" | "bin"

interface CVCardDropMenuProps {
  context: CVMenuContext
  fileUrl?: string
  onViewClick?: (e: React.MouseEvent) => void
  onRenameClick?: (e: React.MouseEvent) => void
  onDuplicateClick?: (e: React.MouseEvent) => void
  onRestoreClick?: (e: React.MouseEvent) => void
  onDeleteClick?: (e: React.MouseEvent) => void
  customMenuItems?: Array<{
    label: string
    onClick: (e: React.MouseEvent) => void
    className?: string
  }>
}

export function CVCardDropMenu({
  context,
  fileUrl,
  onViewClick,
  onRenameClick,
  onDuplicateClick,
  onRestoreClick,
  onDeleteClick,
  customMenuItems = [],
}: CVCardDropMenuProps) {
  const { t } = useLanguage()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="text-gray-400 dark:text-indigo-300 hover:text-gray-600 dark:hover:text-indigo-200 transition-colors">
          <MoreVertical className="h-5 w-5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="dark:bg-slate-800 dark:border-slate-600 dark:shadow-lg dark:shadow-purple-900/20"
      >
        {/* View option */}
        {fileUrl && (
          <DropdownMenuItem
            onClick={onViewClick}
            className="dark:text-indigo-200 dark:hover:text-white dark:focus:bg-indigo-900/30 transition-colors"
          >
            <Eye className="h-4 w-4 mr-2" />
            {t("common.view")}
          </DropdownMenuItem>
        )}

        {/* Custom menu items */}
        {customMenuItems.map((item, index) => (
          <DropdownMenuItem
            key={index}
            onClick={item.onClick}
            className={
              item.className ||
              "dark:text-indigo-200 dark:hover:text-white dark:focus:bg-indigo-900/30 transition-colors"
            }
          >
            {item.label}
          </DropdownMenuItem>
        ))}

        {/* Context-specific options */}
        {context !== "bin" && (
          <>
            {/* Rename option */}
            {onRenameClick && (
              <DropdownMenuItem
                onClick={onRenameClick}
                className="dark:text-indigo-200 dark:hover:text-white dark:focus:bg-indigo-900/30 transition-colors"
              >
                <Pencil className="h-4 w-4 mr-2" />
                {t("common.rename")}
              </DropdownMenuItem>
            )}

            {/* Duplicate option */}
            {onDuplicateClick && (
              <DropdownMenuItem
                onClick={onDuplicateClick}
                className="dark:text-indigo-200 dark:hover:text-white dark:focus:bg-indigo-900/30 transition-colors"
              >
                <Copy className="h-4 w-4 mr-2" />
                {t("common.duplicate")}
              </DropdownMenuItem>
            )}

            {/* Delete option */}
            {onDeleteClick && (
              <DropdownMenuItem
                onClick={onDeleteClick}
                className="text-red-600 dark:text-red-400 dark:hover:text-red-300 dark:focus:bg-red-900/30 transition-colors"
              >
                <Trash className="h-4 w-4 mr-2" />
                {t("common.delete")}
              </DropdownMenuItem>
            )}
          </>
        )}

        {/* Bin context options */}
        {context === "bin" && (
          <>
            {/* Restore option */}
            {onRestoreClick && (
              <DropdownMenuItem
                onClick={onRestoreClick}
                className="text-green-600 dark:text-emerald-400 dark:hover:text-emerald-300 dark:focus:bg-emerald-900/30 transition-colors"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                {t("dashboard.restore")}
              </DropdownMenuItem>
            )}

            {/* Permanent delete option */}
            {onDeleteClick && (
              <DropdownMenuItem
                onClick={onDeleteClick}
                className="text-red-600 dark:text-red-400 dark:hover:text-red-300 dark:focus:bg-red-900/30 transition-colors"
              >
                <Trash className="h-4 w-4 mr-2" />
                {t("resume.permanentlyDelete")}
              </DropdownMenuItem>
            )}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
