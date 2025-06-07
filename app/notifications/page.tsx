"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { getAllNotifications, markAsRead, markAllAsRead } from "@/lib/notification-service"
import type { Notification } from "@/lib/notification-service"
import { NotificationItem } from "@/components/notifications/notification-item"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, BellOff, Bell, ChevronDown, ChevronUp, Home, FileText, Heart } from "lucide-react"
import { useLanguage } from "@/lib/i18n/context"
import { Pagination } from "@/components/common/pagination"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([])
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const { t } = useLanguage()
  const [showMobileDashboard, setShowMobileDashboard] = useState(false)
  const router = useRouter()

  const itemsPerPage = 10

  useEffect(() => {
    // Load all notifications
    const allNotifications = getAllNotifications()
    setNotifications(allNotifications)
    setFilteredNotifications(allNotifications)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    // Apply filters when tab or search query changes
    let filtered = notifications

    // Filter by type
    if (activeTab === "unread") {
      filtered = filtered.filter((notification) => !notification.isRead)
    } else if (activeTab === "read") {
      filtered = filtered.filter((notification) => notification.isRead)
    }

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (notification) =>
          notification.title.toLowerCase().includes(query) || notification.message.toLowerCase().includes(query),
      )
    }

    setFilteredNotifications(filtered)
    setCurrentPage(1) // Reset to first page when filters change
  }, [activeTab, searchQuery, notifications])

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Search is already applied via useEffect
  }

  const handleMarkAsRead = (id: string) => {
    // Mark notification as read
    markAsRead(id)

    // Update local state
    setNotifications(
      notifications.map((notification) => (notification.id === id ? { ...notification, isRead: true } : notification)),
    )
  }

  const handleMarkAllAsRead = () => {
    // Mark all notifications as read
    markAllAsRead()

    // Update local state
    setNotifications(notifications.map((notification) => ({ ...notification, isRead: true })))
  }

  const handleDelete = (id: string) => {
    // In a real app, this would call an API to delete the notification
    // For now, we'll just remove it from the local state
    setNotifications(notifications.filter((notification) => notification.id !== id))
  }

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    if (!notification.isRead) {
      markAsRead(notification.id)

      // Update local state
      const updatedNotifications = notifications.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n))
      setNotifications(updatedNotifications)
    }

    // Navigate to notification detail page
    router.push(`/dashboard/notifications/${notification.id}`)
  }

  // Calculate pagination
  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage)
  const paginatedNotifications = filteredNotifications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  // Count unread notifications
  const unreadCount = notifications.filter((n) => !n.isRead).length

  // Mobile dashboard component
  const MobileDashboard = () => (
    <div className="md:hidden mb-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold dark:text-white">{t("common.dashboard")}</h2>
        <button
          onClick={() => setShowMobileDashboard(!showMobileDashboard)}
          className="text-gray-500 dark:text-indigo-300"
        >
          {showMobileDashboard ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      {showMobileDashboard && (
        <div className="space-y-3">
          <Card className="dark:bg-gradient-to-r dark:from-indigo-900 dark:to-purple-900 dark:border-indigo-700">
            <CardContent className="p-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-blue-500 dark:text-indigo-300" />
                  <span className="text-sm font-medium dark:text-white">{t("notifications.notifications")}</span>
                </div>
                <div className="bg-blue-100 text-blue-800 dark:bg-indigo-500 dark:text-white text-xs font-medium px-2 py-0.5 rounded-full">
                  {unreadCount}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-3 gap-2">
            <Link
              href="/dashboard"
              className="flex flex-col items-center justify-center p-3 bg-gray-50 dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-700 rounded-lg dark:border dark:border-slate-600 transition-transform hover:scale-[1.03]"
            >
              <Home className="h-5 w-5 text-gray-600 dark:text-indigo-300 mb-1" />
              <span className="text-xs text-center dark:text-indigo-100">{t("common.dashboard")}</span>
            </Link>
            <Link
              href="/dashboard/resumes"
              className="flex flex-col items-center justify-center p-3 bg-gray-50 dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-700 rounded-lg dark:border dark:border-slate-600 transition-transform hover:scale-[1.03]"
            >
              <FileText className="h-5 w-5 text-gray-600 dark:text-indigo-300 mb-1" />
              <span className="text-xs text-center dark:text-indigo-100">{t("dashboard.resumes")}</span>
            </Link>
            <Link
              href="/dashboard/favorite-jobs"
              className="flex flex-col items-center justify-center p-3 bg-gray-50 dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-700 rounded-lg dark:border dark:border-slate-600 transition-transform hover:scale-[1.03]"
            >
              <Heart className="h-5 w-5 text-gray-600 dark:text-indigo-300 mb-1" />
              <span className="text-xs text-center dark:text-indigo-100">{t("dashboard.favoriteJobs")}</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Mobile Dashboard */}
      <MobileDashboard />

      <>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold dark:text-white dark:drop-shadow-sm">{t("notifications.notifications")}</h1>

          <Button
            variant="outline"
            onClick={handleMarkAllAsRead}
            disabled={!notifications.some((n) => !n.isRead)}
            className="dark:border-indigo-500/50 dark:text-indigo-200 dark:hover:bg-indigo-600/20 dark:hover:border-indigo-400 transition-colors duration-300"
          >
            {t("notifications.markAllAsRead")}
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
          <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange} className="dark:text-indigo-100">
            <TabsList className="dark:bg-slate-800 dark:border dark:border-indigo-500/30">
              <TabsTrigger
                value="all"
                className="dark:data-[state=active]:bg-indigo-600 dark:data-[state=active]:text-white transition-colors duration-300"
              >
                {t("notifications.all")}
              </TabsTrigger>
              <TabsTrigger
                value="unread"
                className="dark:data-[state=active]:bg-indigo-600 dark:data-[state=active]:text-white transition-colors duration-300"
              >
                {t("notifications.unread")}
              </TabsTrigger>
              <TabsTrigger
                value="read"
                className="dark:data-[state=active]:bg-indigo-600 dark:data-[state=active]:text-white transition-colors duration-300"
              >
                {t("notifications.read")}
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <form onSubmit={handleSearch} className="relative w-full lg:w-72">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-indigo-300"
              size={16}
            />
            <Input
              placeholder={t("notifications.search")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 dark:bg-slate-800 dark:text-white dark:border-indigo-500/50 dark:focus:border-indigo-400"
            />
          </form>
        </div>

        <div className="bg-white dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-700 rounded-lg border dark:border-slate-600 shadow-sm dark:shadow-lg dark:shadow-indigo-900/20 overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-4 text-gray-500 dark:text-indigo-200">{t("common.loading")}</p>
            </div>
          ) : paginatedNotifications.length > 0 ? (
            <div>
              {paginatedNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  showActions={true}
                  onMarkAsRead={() => handleMarkAsRead(notification.id)}
                  onDelete={() => handleDelete(notification.id)}
                  onClick={() => handleNotificationClick(notification)}
                />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <BellOff className="h-12 w-12 text-gray-300 dark:text-indigo-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                {t("notifications.noNotificationsFound")}
              </h3>
              <p className="text-gray-500 dark:text-indigo-200">
                {searchQuery
                  ? t("notifications.noNotificationsMatchingSearch")
                  : t("notifications.noNotificationsInThisCategory")}
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredNotifications.length > itemsPerPage && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            className="mt-6"
          />
        )}
      </>
    </div>
  )
}
