"use client"

import { useCallback } from "react"
import { Moon, Sun, Monitor } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks"
import { selectTheme, setTheme } from "@/lib/redux/slices/uiSlice"
import { useLanguage } from "@/lib/i18n/context"

export function ThemeToggle() {
  const theme = useAppSelector(selectTheme)
  const dispatch = useAppDispatch()
  const { t } = useLanguage()

  const handleThemeChange = useCallback(
    (newTheme: "light" | "dark" | "system") => {
      dispatch(setTheme(newTheme))
    },
    [dispatch],
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 px-0">
          {theme === "light" && <Sun className="h-5 w-5 text-gray-700 dark:text-gray-300" />}
          {theme === "dark" && <Moon className="h-5 w-5 text-gray-700 dark:text-gray-300" />}
          {theme === "system" && <Monitor className="h-5 w-5 text-gray-700 dark:text-gray-300" />}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="dark:bg-gray-800 dark:border-gray-700">
        <DropdownMenuItem
          onClick={() => handleThemeChange("light")}
          className={`${theme === "light" ? "bg-gray-100 dark:bg-gray-700" : ""} dark:text-gray-300 dark:hover:bg-gray-700`}
        >
          <Sun className="mr-2 h-4 w-4" />
          <span>{t("theme.light") || "Light"}</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleThemeChange("dark")}
          className={`${theme === "dark" ? "bg-gray-100 dark:bg-gray-700" : ""} dark:text-gray-300 dark:hover:bg-gray-700`}
        >
          <Moon className="mr-2 h-4 w-4" />
          <span>{t("theme.dark") || "Dark"}</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleThemeChange("system")}
          className={`${theme === "system" ? "bg-gray-100 dark:bg-gray-700" : ""} dark:text-gray-300 dark:hover:bg-gray-700`}
        >
          <Monitor className="mr-2 h-4 w-4" />
          <span>{t("theme.system") || "System"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
