"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MyProfile } from "@/components/settings/my-profile"
import { LoginDetails } from "@/components/settings/login-details"
import { NotificationSettings } from "@/components/settings/notification-settings"
import { useLanguage } from "@/lib/i18n/context"

export default function SettingsPage() {
  const { t } = useLanguage()

  return (
    <div className="max-w-3xl mx-auto">
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">{t("settings.myProfile")}</TabsTrigger>
          <TabsTrigger value="login">{t("settings.loginDetails")}</TabsTrigger>
          <TabsTrigger value="notifications">{t("settings.notifications")}</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <MyProfile />
        </TabsContent>

        <TabsContent value="login">
          <LoginDetails />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationSettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}
