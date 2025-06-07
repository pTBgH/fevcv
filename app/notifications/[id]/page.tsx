"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getAllNotifications, markAsRead, type Notification } from "@/lib/notification-service"
import { useLanguage } from "@/lib/i18n/context"
import { format } from "date-fns"

export default function NotificationDetailPage({ params }: { params: { id: string } }) {
  const [notification, setNotification] = useState<Notification | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { t } = useLanguage()
  const router = useRouter()

  useEffect(() => {
    // Load notification by ID
    const notificationId = params.id
    const allNotifications = getAllNotifications()
    const foundNotification = allNotifications.find((n) => n.id === notificationId)

    if (foundNotification) {
      setNotification(foundNotification)

      // Mark as read if not already read
      if (!foundNotification.isRead) {
        markAsRead(notificationId)
      }
    } else {
      setError("Notification not found")
    }

    setLoading(false)
  }, [params.id])

  const handleNavigateToLink = () => {
    if (notification?.link && notification.link !== "#") {
      if (notification.link.startsWith("/")) {
        router.push(notification.link)
      } else if (notification.link.startsWith("http")) {
        window.open(notification.link, "_blank")
      }
    }
  }

  const handleBack = () => {
    router.push("/dashboard/notifications")
  }

  const getNotificationTypeLabel = (type: string) => {
    switch (type) {
      case "info":
        return t("notifications.info")
      case "success":
        return t("notifications.success")
      case "warning":
        return t("notifications.warning")
      case "error":
        return t("notifications.error")
      default:
        return type
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-6 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>{t("notifications.loading")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse h-40 bg-gray-100 rounded-md"></div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !notification) {
    return (
      <div className="container mx-auto py-6 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>{t("notifications.error")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertTitle>{t("common.error")}</AlertTitle>
              <AlertDescription>{error || t("notifications.notificationNotFound")}</AlertDescription>
            </Alert>
            <Button onClick={handleBack} className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t("common.back")}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const formattedDate = format(new Date(notification.createdAt), "dd/MM/yyyy HH:mm")

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <Card>
        <CardHeader>
          <div className="flex items-center mb-4">
            <Button variant="ghost" size="sm" onClick={handleBack} className="mr-2">
              <ArrowLeft className="h-4 w-4 mr-1" />
              {t("common.back")}
            </Button>
          </div>
          <CardTitle>{t("notifications.notificationDetail")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert
            className={`border-l-4 ${
              notification.type === "info"
                ? "border-l-blue-500"
                : notification.type === "success"
                  ? "border-l-green-500"
                  : notification.type === "warning"
                    ? "border-l-yellow-500"
                    : "border-l-red-500"
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <AlertTitle className="text-lg font-semibold">{notification.title}</AlertTitle>
                <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                  <span>{formattedDate}</span>
                  <span>•</span>
                  <Badge variant="outline">{getNotificationTypeLabel(notification.type)}</Badge>
                </div>
              </div>
            </div>
            <AlertDescription className="mt-4 text-base whitespace-pre-line">{notification.message}</AlertDescription>

            {notification.link && notification.link !== "#" && (
              <Button variant="outline" size="sm" className="mt-4" onClick={handleNavigateToLink}>
                <ExternalLink className="h-4 w-4 mr-2" />
                {t("notifications.goToLink")}
              </Button>
            )}
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}
