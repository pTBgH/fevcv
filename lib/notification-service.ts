import notificationsData from "@/data/notifications.json"
import { formatDistanceToNow, parseISO } from "date-fns"

export interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  isRead: boolean
  createdAt: string
  link: string
  relatedEntityId: string | null
  relatedEntityType: string | null
  timeAgo?: string // Added for UI display
}

// Get all notifications
export function getAllNotifications(): Notification[] {
  const notifications = notificationsData.notifications as Notification[]

  // Add timeAgo property to each notification
  return notifications.map((notification) => ({
    ...notification,
    timeAgo: formatDistanceToNow(parseISO(notification.createdAt), { addSuffix: true }),
  }))
}

// Get unread notifications
export function getUnreadNotifications(): Notification[] {
  return getAllNotifications().filter((notification) => !notification.isRead)
}

// Get recent notifications (last 5)
export function getRecentNotifications(count = 5): Notification[] {
  return getAllNotifications()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, count)
}

// Mark notification as read
export function markAsRead(id: string): Notification | undefined {
  // In a real app, this would update the database
  // For now, we'll just return the notification with isRead set to true
  const notification = getAllNotifications().find((n) => n.id === id)

  if (notification) {
    return {
      ...notification,
      isRead: true,
    }
  }

  return undefined
}

// Mark all notifications as read
export function markAllAsRead(): void {
  // In a real app, this would update the database
  console.log("All notifications marked as read")
}

// Filter notifications by type
export function filterNotificationsByType(type: string): Notification[] {
  if (type === "all") {
    return getAllNotifications()
  }

  return getAllNotifications().filter((notification) => notification.type === type)
}

// Search notifications
export function searchNotifications(query: string): Notification[] {
  const lowerCaseQuery = query.toLowerCase()

  return getAllNotifications().filter(
    (notification) =>
      notification.title.toLowerCase().includes(lowerCaseQuery) ||
      notification.message.toLowerCase().includes(lowerCaseQuery),
  )
}

// Check if a link is valid
export function isValidLink(link: string): boolean {
  // Check if the link is a valid URL or a valid internal path
  try {
    // Check if it's a valid URL
    new URL(link)
    return true
  } catch (e) {
    // If it's not a valid URL, check if it's a valid internal path
    return link.startsWith("/") && !link.includes(" ")
  }
}
