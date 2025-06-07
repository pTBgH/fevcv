"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useLanguage } from "@/lib/i18n/context"

export function NotificationSettings() {
  const { t } = useLanguage()

  return (
    <Card>
      <CardContent className="p-6 space-y-8">
        <div>
          <h2 className="text-lg font-semibold mb-2">{t("settings.basicInformation")}</h2>
          <p className="text-sm text-gray-500">{t("settings.notificationPreferences")}</p>
        </div>

        <div className="space-y-6">
          <h3 className="text-sm font-medium">{t("settings.notifications")}</h3>
          <p className="text-sm text-gray-500">{t("settings.customizeNotifications")}</p>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Checkbox id="applications" />
              <div>
                <Label htmlFor="applications" className="font-medium">
                  {t("settings.applications")}
                </Label>
                <p className="text-sm text-gray-500">{t("settings.applicationsHelp")}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox id="jobs" />
              <div>
                <Label htmlFor="jobs" className="font-medium">
                  {t("settings.jobsNotifications")}
                </Label>
                <p className="text-sm text-gray-500">{t("settings.jobsNotificationsHelp")}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox id="recommendations" />
              <div>
                <Label htmlFor="recommendations" className="font-medium">
                  {t("settings.recommendations")}
                </Label>
                <p className="text-sm text-gray-500">{t("settings.recommendationsHelp")}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button>{t("settings.updateEmail")}</Button>
        </div>
      </CardContent>
    </Card>
  )
}
