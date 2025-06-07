"use client"

import { useSelector } from "react-redux"
import { selectJobsPerPage, selectJobsPerRow, selectDefaultDisplayMode } from "@/lib/redux/slices/configSlice"
import { useDispatch } from "react-redux"
import { updateConfig } from "@/lib/redux/slices/configSlice"
import { useEffect, useState } from "react"

export function useAppConfig() {
  const dispatch = useDispatch()
  const jobsPerPage = useSelector(selectJobsPerPage)
  const jobsPerRow = useSelector(selectJobsPerRow)
  const defaultDisplayMode = useSelector(selectDefaultDisplayMode)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load config from JSON file on first render
  useEffect(() => {
    if (!isLoaded) {
      // In a real app, this would be an API call to fetch config from the server
      // For now, we'll import the JSON directly
      import("@/data/app-config.json")
        .then((config) => {
          dispatch(updateConfig(config.default))
          setIsLoaded(true)
        })
        .catch((error) => {
          console.error("Failed to load app configuration:", error)
          setIsLoaded(true) // Mark as loaded even on error to prevent infinite retries
        })
    }
  }, [dispatch, isLoaded])

  return {
    jobsPerPage,
    jobsPerRow,
    defaultDisplayMode,
    isLoaded,
  }
}
