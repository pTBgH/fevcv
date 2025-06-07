"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"
import { useLanguage } from "@/lib/i18n/context"

export function LoginDetails() {
  const { t } = useLanguage()

  return (
    <Card>
      <CardContent className="p-6 space-y-8">
        <div>
          <h2 className="text-lg font-semibold mb-2">{t("settings.basicInformation")}</h2>
          <p className="text-sm text-gray-500">{t("settings.loginDetails")}</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label>{t("settings.updateEmail")}</Label>
              <p className="text-sm text-gray-500 mb-2">{t("settings.updateEmailHelp")}</p>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm">jakegyll@email.com</span>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span className="text-xs text-green-500">{t("settings.emailVerified")}</span>
              </div>
              <div className="space-y-4">
                <Input placeholder={t("settings.enterNewEmail")} />
                <Button>{t("settings.updateEmail")}</Button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label>{t("settings.newPassword")}</Label>
                <p className="text-sm text-gray-500 mb-2">{t("settings.managePassword")}</p>
              </div>
              <div className="space-y-4">
                <div>
                  <Input type="password" placeholder={t("settings.enterOldPassword")} />
                  <p className="text-xs text-gray-500 mt-1">{t("settings.minimumCharacters")}</p>
                </div>
                <div>
                  <Input type="password" placeholder={t("settings.enterNewPassword")} />
                  <p className="text-xs text-gray-500 mt-1">{t("settings.minimumCharacters")}</p>
                </div>
                <div>
                  <Input type="password" placeholder={t("settings.confirmNewPassword")} />
                  <p className="text-xs text-gray-500 mt-1">{t("settings.minimumCharacters")}</p>
                </div>
                <Button>{t("settings.changePassword")}</Button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button variant="destructive">{t("settings.closeAccount")}</Button>
        </div>
      </CardContent>
    </Card>
  )
}
