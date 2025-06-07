"use client"

import { useEffect } from "react"
import { initAppConfig } from "@/lib/config-service"
import { useAppDispatch } from "@/lib/redux/hooks"
import { initializeJobActions } from "@/lib/redux/slices/jobActionsSlice"
import { fetchNotifications } from "@/lib/redux/slices/notificationSlice"
import { setMobileState, setOrientation } from "@/lib/redux/slices/uiSlice"
import { fetchResumes } from "@/lib/redux/slices/resumeSlice"
import { initializeAuth } from "@/lib/redux/slices/authSlice"

export function ReduxInitializer() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    // Initialize app configuration
    initAppConfig()

    // Initialize auth state
    dispatch(initializeAuth())

    // Initialize job actions
    dispatch(initializeJobActions())

    // Initialize notifications
    dispatch(fetchNotifications())

    // Fetch resumes
    dispatch(fetchResumes())

    // Check if we're on the client side before accessing window
    if (typeof window !== "undefined") {
      // Set mobile and orientation state
      const handleResize = () => {
        dispatch(setMobileState(window.innerWidth < 768))
        dispatch(setOrientation(window.matchMedia("(orientation: portrait)").matches))
      }

      // Initial call
      handleResize()

      // Add event listener
      window.addEventListener("resize", handleResize)

      // Cleanup
      return () => window.removeEventListener("resize", handleResize)
    }
  }, [dispatch])

  return null
}
