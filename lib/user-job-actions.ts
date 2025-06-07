// Define the new structure for user job actions
interface UserJobActionsArray {
  favorites: string[]
  archived: string[]
  hidden: string[]
}

import userJobActionsData from "../data/user-job-actions.json"

// Load user actions from JSON files (for server-side)
export function getServerUserActions(): UserJobActionsArray {
  return userJobActionsData as UserJobActionsArray
}

// Get user actions from localStorage (for client-side)
export function getUserJobActions(): UserJobActionsArray {
  if (typeof window === "undefined") {
    return getServerUserActions()
  }

  const localActions = localStorage.getItem("userJobActions")
  if (!localActions) {
    // Initialize with server data if no local data exists
    const serverActions = getServerUserActions()
    localStorage.setItem("userJobActions", JSON.stringify(serverActions))
    return serverActions
  }

  try {
    return JSON.parse(localActions) as UserJobActionsArray
  } catch (error) {
    console.error("Error parsing user job actions:", error)
    return { favorites: [], archived: [], hidden: [] }
  }
}

// Sync server data with client localStorage
export function syncUserActions(): void {
  if (typeof window === "undefined") return

  const localActions = localStorage.getItem("userJobActions")

  // If no local actions exist, initialize with server data
  if (!localActions) {
    localStorage.setItem("userJobActions", JSON.stringify(userJobActionsData))
    return
  }

  // Otherwise, merge server and client data
  try {
    const parsedLocalActions = JSON.parse(localActions) as UserJobActionsArray
    const serverActions = userJobActionsData as UserJobActionsArray

    // Merge actions (combine arrays and remove duplicates)
    const mergedActions: UserJobActionsArray = {
      favorites: [...new Set([...serverActions.favorites, ...parsedLocalActions.favorites])],
      archived: [...new Set([...serverActions.archived, ...parsedLocalActions.archived])],
      hidden: [...new Set([...serverActions.hidden, ...parsedLocalActions.hidden])],
    }

    localStorage.setItem("userJobActions", JSON.stringify(mergedActions))
  } catch (error) {
    console.error("Error syncing user actions:", error)
  }
}
