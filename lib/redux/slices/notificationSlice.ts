import { createSlice, createAsyncThunk, type PayloadAction, createSelector } from "@reduxjs/toolkit"
import type { RootState } from "../store"
import type { Notification } from "@/lib/notification-service"
import { getAllNotifications, markAsRead as markNotificationAsRead } from "@/lib/notification-service"

// Define the initial state
interface NotificationState {
  notifications: Notification[]
  unreadCount: number
  loading: boolean
  error: string | null
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
}

// Create async thunk for fetching notifications
export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (_, { rejectWithValue }) => {
    try {
      // In a real app, you would fetch from an API
      // For now, we'll use the existing function
      const notifications = getAllNotifications()
      return notifications
    } catch (error) {
      return rejectWithValue("Failed to fetch notifications")
    }
  },
)

// Create async thunk for marking a notification as read
export const markNotificationRead = createAsyncThunk(
  "notifications/markNotificationRead",
  async (id: string, { rejectWithValue }) => {
    try {
      // In a real app, you would call an API
      // For now, we'll use the existing function
      const updatedNotification = markNotificationAsRead(id)
      return { id, updatedNotification }
    } catch (error) {
      return rejectWithValue("Failed to mark notification as read")
    }
  },
)

// Create the slice
const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotifications: (state, action: PayloadAction<Notification[]>) => {
      state.notifications = action.payload
      state.unreadCount = action.payload.filter((notification) => !notification.isRead).length
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find((n) => n.id === action.payload)
      if (notification && !notification.isRead) {
        notification.isRead = true
        state.unreadCount -= 1
      }
    },
    markAllAsRead: (state) => {
      state.notifications = state.notifications.map((notification) => ({
        ...notification,
        isRead: true,
      }))
      state.unreadCount = 0
    },
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications = [action.payload, ...state.notifications]
      if (!action.payload.isRead) {
        state.unreadCount += 1
      }
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find((n) => n.id === action.payload)
      if (notification && !notification.isRead) {
        state.unreadCount -= 1
      }
      state.notifications = state.notifications.filter((n) => n.id !== action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false
        state.notifications = action.payload
        state.unreadCount = action.payload.filter((notification) => !notification.isRead).length
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        const { id, updatedNotification } = action.payload
        if (updatedNotification) {
          const index = state.notifications.findIndex((n) => n.id === id)
          if (index !== -1) {
            const wasUnread = !state.notifications[index].isRead
            // Create a new array with the updated notification
            state.notifications = state.notifications.map((n, i) => (i === index ? updatedNotification : n))
            if (wasUnread) {
              state.unreadCount -= 1
            }
          }
        }
      })
  },
})

// Export actions
export const { setNotifications, markAsRead, markAllAsRead, addNotification, removeNotification } =
  notificationSlice.actions

// Export selectors
export const selectAllNotifications = (state: RootState) => state.notifications.notifications
export const selectUnreadCount = (state: RootState) => state.notifications.unreadCount
export const selectNotificationsLoading = (state: RootState) => state.notifications.loading
export const selectNotificationsError = (state: RootState) => state.notifications.error
export const selectUnreadNotifications = (state: RootState) =>
  state.notifications.notifications.filter((notification) => !notification.isRead)

// Fixed selector that doesn't mutate state
export const selectRecentNotifications = createSelector(
  [(state: RootState) => state.notifications.notifications, (_, count = 5) => count],
  (notifications, count) => {
    // Create a new array, then sort it (to avoid mutating the original)
    return [...notifications]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, count)
  },
)

export default notificationSlice.reducer
