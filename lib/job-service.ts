import type { Job } from "./types"

// This would normally be fetched from an API
import jobsData from "../data/jobs.json"
import userJobActionsData from "../data/user-job-actions.json"

// Define the new structure for user job actions
interface UserJobActionsArray {
  favorites: string[]
  archived: string[]
  hidden: string[]
}

// Fix and transform the JSON data
const transformedJobs: Job[] = jobsData.map((job: any) => ({
  id: job.Job_ID,
  title: job.Title,
  link: job.Link,
  type: job.Job_Type,
  city: job.Job_City === "Null" ? null : job.Job_City,
  category: job.Job_Category,
  minSalary: job.Min_Salary === "not available" || job.Min_Salary === "Not available" ? null : Number(job.Min_Salary),
  maxSalary: job.Max_Salary === "not available" || job.Max_Salary === "Not available" ? null : Number(job.Max_Salary),
  endDate: job.Job_Date_end,
  company: {
    name: `Company ${job.Job_ID}`, // Placeholder
    logo: "/placeholder.svg?height=64&width=64",
  },
}))

// Initialize user actions from JSON data
const initialUserActions: UserJobActionsArray = {
  favorites: userJobActionsData.favorites || [],
  archived: userJobActionsData.archived || [],
  hidden: userJobActionsData.hidden || [],
}

// Fix the normalizeJobId function to handle different ID formats
function normalizeJobId(id: number | string): string {
  // Convert to string and remove leading zeros for comparison
  return id.toString().replace(/^0+/, "")
}

// Load user actions from localStorage or initialize from JSON data
export function loadUserActions(): UserJobActionsArray {
  if (typeof window === "undefined") {
    return initialUserActions
  }

  try {
    const actions = localStorage.getItem("userJobActions")
    if (actions) {
      const parsedActions = JSON.parse(actions)
      // Đảm bảo tất cả các thuộc tính đều tồn tại
      return {
        favorites: parsedActions.favorites || [],
        archived: parsedActions.archived || [],
        hidden: parsedActions.hidden || [],
      }
    } else {
      // Initialize localStorage with data from JSON
      localStorage.setItem("userJobActions", JSON.stringify(initialUserActions))
      return initialUserActions
    }
  } catch (error) {
    console.error("Error loading user actions:", error)
    return { favorites: [], archived: [], hidden: [] }
  }
}

// Save user actions to localStorage
export function saveUserActions(actions: UserJobActionsArray): void {
  if (typeof window === "undefined") return

  try {
    console.log("Saving user actions:", actions)
    localStorage.setItem("userJobActions", JSON.stringify(actions))
  } catch (error) {
    console.error("Error saving user actions:", error)
  }
}

// Fix the toggleJobAction function to ensure it correctly updates the actions
export function toggleJobAction(jobId: number | string, actionType: keyof UserJobActionsArray): UserJobActionsArray {
  console.log(`Toggling ${actionType} for job ${jobId}`)
  const actions = loadUserActions()

  // Normalize the job ID for comparison
  const normalizedJobId = normalizeJobId(jobId)

  // Find the ID in the array (after normalizing)
  const index = actions[actionType].findIndex((id) => normalizeJobId(id) === normalizedJobId)

  if (index === -1) {
    // If not in the array, add it with the original format
    // Ensure the ID is padded to 3 digits for consistency
    const formattedId = jobId.toString().padStart(3, "0")
    console.log(`Adding job ${formattedId} to ${actionType}`)
    actions[actionType] = [...actions[actionType], formattedId]
  } else {
    // If in the array, remove it
    console.log(`Removing job from ${actionType} at index ${index}`)
    actions[actionType] = actions[actionType].filter((_, i) => i !== index)
  }

  // Save changes to localStorage
  saveUserActions(actions)

  // Log state after change
  console.log(`After toggle, ${actionType} contains:`, actions[actionType])

  return actions
}

// Get job by ID
export function getJobById(jobId: number | string): Job | undefined {
  const normalizedJobId = normalizeJobId(jobId)
  return transformedJobs.find((job) => normalizeJobId(job.id) === normalizedJobId)
}

// Check if a job has a specific action
export function hasJobAction(jobId: number | string, actionType: keyof UserJobActionsArray): boolean {
  const actions = loadUserActions()
  // Chuẩn hóa ID công việc để so sánh
  const normalizedJobId = normalizeJobId(jobId)

  // Kiểm tra xem mảng có tồn tại không và có chứa ID này không (sau khi chuẩn hóa)
  return Array.isArray(actions[actionType]) && actions[actionType].some((id) => normalizeJobId(id) === normalizedJobId)
}

// Get all jobs
export function getAllJobs(): Job[] {
  return transformedJobs
}

// Get jobs with filters
export function getFilteredJobs(
  searchTerm = "",
  filters: {
    city?: string
    type?: string
    category?: string
    minSalary?: number
    maxSalary?: number
  } = {},
): Job[] {
  const userActions = loadUserActions()

  return transformedJobs.filter((job) => {
    // Chuẩn hóa ID công việc để so sánh
    const normalizedJobId = normalizeJobId(job.id)

    // Filter out hidden jobs
    if (userActions.hidden.some((id) => normalizeJobId(id) === normalizedJobId)) return false

    // Apply search term
    if (searchTerm && !job.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false
    }

    // Apply filters
    if (filters.city && job.city !== filters.city) return false
    if (filters.type && job.type !== filters.type) return false
    if (filters.category && job.category !== filters.category) return false
    if (filters.minSalary && job.minSalary && job.minSalary < filters.minSalary) return false
    if (filters.maxSalary && job.maxSalary && job.maxSalary > filters.maxSalary) return false

    return true
  })
}

// Get favorite jobs
export function getFavoriteJobs(): Job[] {
  const userActions = loadUserActions()
  console.log("Favorite job IDs:", userActions.favorites)

  let favoriteJobs = transformedJobs.filter((job) => {
    const normalizedJobId = normalizeJobId(job.id)
    const isFavorite = userActions.favorites.some((id) => normalizeJobId(id) === normalizedJobId)
    if (isFavorite) {
      console.log(`Job ${job.id} is a favorite`)
    }
    return isFavorite
  })

  console.log("Found favorite jobs:", favoriteJobs.length)

  // If no favorite jobs found, return mock data
  if (favoriteJobs.length === 0) {
    favoriteJobs = Array(6)
      .fill(null)
      .map((_, index) => ({
        id: `mock-fav-${index + 1}`,
        title: "Sr. UX Designer",
        link: "#",
        type: "Full-time",
        city: "Ho Chi Minh City",
        category: "Design",
        minSalary: 50000,
        maxSalary: 60000,
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        company: {
          name: "Suntary Pepsio",
          logo: "/placeholder.svg?height=64&width=64",
        },
      }))
  }

  return favoriteJobs
}

// Get archived jobs
export function getArchivedJobs(): Job[] {
  const userActions = loadUserActions()
  console.log("Archived job IDs:", userActions.archived)

  let archivedJobs = transformedJobs.filter((job) => {
    const normalizedJobId = normalizeJobId(job.id)
    const isArchived = userActions.archived.some((id) => normalizeJobId(id) === normalizedJobId)
    if (isArchived) {
      console.log(`Job ${job.id} is archived`)
    }
    return isArchived
  })

  console.log("Found archived jobs:", archivedJobs.length)

  // If no archived jobs found, return mock data
  if (archivedJobs.length === 0) {
    archivedJobs = Array(6)
      .fill(null)
      .map((_, index) => ({
        id: `mock-arch-${index + 1}`,
        title: "Sr. UX Designer",
        link: "#",
        type: "Full-time",
        city: "Ho Chi Minh City",
        category: "Design",
        minSalary: 50000,
        maxSalary: 60000,
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        company: {
          name: "Suntary Pepsio",
          logo: "/placeholder.svg?height=64&width=64",
        },
      }))
  }

  return archivedJobs
}

// Get hidden jobs
export function getHiddenJobs(): Job[] {
  const userActions = loadUserActions()

  let hiddenJobs = transformedJobs.filter((job) => {
    const normalizedJobId = normalizeJobId(job.id)
    return userActions.hidden.some((id) => normalizeJobId(id) === normalizedJobId)
  })

  // If no hidden jobs found, return mock data
  if (hiddenJobs.length === 0) {
    hiddenJobs = Array(6)
      .fill(null)
      .map((_, index) => ({
        id: `mock-hidden-${index + 1}`,
        title: "Sr. UX Designer",
        link: "#",
        type: "Full-time",
        city: "Ho Chi Minh City",
        category: "Design",
        minSalary: 50000,
        maxSalary: 60000,
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        company: {
          name: "Suntary Pepsio",
          logo: "/placeholder.svg?height=64&width=64",
        },
      }))
  }

  return hiddenJobs
}

// Debug function to log the current state
export function debugUserActions(): void {
  if (typeof window === "undefined") return

  const actions = loadUserActions()
  console.log("Current user actions:", actions)
  console.log(
    "Favorite jobs:",
    getFavoriteJobs().map((job) => job.id),
  )
  console.log(
    "Archived jobs:",
    getArchivedJobs().map((job) => job.id),
  )
  console.log(
    "Hidden jobs:",
    getHiddenJobs().map((job) => job.id),
  )
}

export function isFavoriteJob(jobId: number | string): boolean {
  return hasJobAction(jobId, "favorites")
}

export function isArchivedJob(jobId: number | string): boolean {
  return hasJobAction(jobId, "archived")
}
