"use client"

import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/i18n/context"

interface LoginPromptProps {
  open: boolean
  onClose: () => void
  featureName: string
}

export function LoginPrompt({ open, onClose, featureName }: LoginPromptProps) {
  const router = useRouter()
  const { t } = useLanguage()

  const handleLogin = () => {
    // Get current path to redirect back after login
    const currentPath = window.location.pathname
    router.push(`/auth?redirect=${encodeURIComponent(currentPath)}`)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("auth.loginRequired")}</DialogTitle>
          <DialogDescription>
            {t("auth.loginRequiredDescription").replace("{featureName}", featureName)}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} className="sm:mr-2">
            {t("common.cancel")}
          </Button>
          <Button onClick={handleLogin}>{t("auth.loginNow")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
