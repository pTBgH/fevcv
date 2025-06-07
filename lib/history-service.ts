import historyData from "@/data/user-history.json"

export interface JobHistoryItem {
  id: string
  date: string
  time: string
  action: string
  jobId: string
  jobName: string
  company: string
  link: string
}

export interface ResumeHistoryItem {
  id: string
  date: string
  time: string
  action: string
  resumeId: string
  resume: string
  link: string
}

// Get all job history items
export function getJobHistory(): JobHistoryItem[] {
  return historyData.jobHistory
}

// Get all resume history items
export function getResumeHistory(): ResumeHistoryItem[] {
  return historyData.resumeHistory
}

// Search job history
export function searchJobHistory(query: string): JobHistoryItem[] {
  if (!query) return historyData.jobHistory

  const lowerQuery = query.toLowerCase()
  return historyData.jobHistory.filter(
    (item) =>
      item.jobName.toLowerCase().includes(lowerQuery) ||
      item.company.toLowerCase().includes(lowerQuery) ||
      item.action.toLowerCase().includes(lowerQuery),
  )
}

// Search resume history
export function searchResumeHistory(query: string): ResumeHistoryItem[] {
  if (!query) return historyData.resumeHistory

  const lowerQuery = query.toLowerCase()
  return historyData.resumeHistory.filter(
    (item) => item.resume.toLowerCase().includes(lowerQuery) || item.action.toLowerCase().includes(lowerQuery),
  )
}

// Add a new job history item (in a real app, this would save to the database)
export function addJobHistoryItem(item: Omit<JobHistoryItem, "id">): JobHistoryItem {
  const newItem: JobHistoryItem = {
    id: `jh${Math.floor(Math.random() * 10000)
      .toString()
      .padStart(3, "0")}`,
    ...item,
  }

  // In a real app, we would save this to the database
  // For now, we'll just return the new item
  return newItem
}

// Add a new resume history item (in a real app, this would save to the database)
export function addResumeHistoryItem(item: Omit<ResumeHistoryItem, "id">): ResumeHistoryItem {
  const newItem: ResumeHistoryItem = {
    id: `rh${Math.floor(Math.random() * 10000)
      .toString()
      .padStart(3, "0")}`,
    ...item,
  }

  // In a real app, we would save this to the database
  // For now, we'll just return the new item
  return newItem
}

// Format date for display
export function formatHistoryDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  })
}
