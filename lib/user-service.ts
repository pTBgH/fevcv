// lib/user-service.ts

import { getAllJobs } from "./job-service"

// Function to get favorite jobs (mock implementation)
export function getFavoriteJobs() {
  // This is a placeholder implementation.  In a real application,
  // this function would fetch the user's favorite jobs from a database
  // or other persistent storage.
  console.warn("getFavoriteJobs() in lib/user-service.ts is a mock implementation.")
  return getAllJobs().slice(0, 3) // Return the first 3 jobs as mock favorites
}
