"use client"

import React, { useState, useRef, useCallback, useEffect } from "react"
import type { Job } from "@/lib/types"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import {
  toggleHidden,
  toggleFavorite,
  toggleArchived,
  selectDontAskAgainPreferences,
} from "@/lib/redux/slices/jobActionsSlice"
import { useReduxToast } from "@/hooks/use-redux-toast"
import { useLanguage } from "@/lib/i18n/context"

interface UseJobCardProps {
  job: Job
  type?: "all" | "favorite" | "archived" | "hidden"
  onFavorite?: (id: number) => void
  onArchive?: (id: number) => void
  onHide?: (id: number) => void
  onRestore?: (id: number) => void
}

interface JobCardState {
  isHovered: boolean
  dialogs: {
    hide: boolean
    favorite: boolean
    archive: boolean
  }
  dontAskAgain: {
    dontAskAgainHide: boolean
    dontAskAgainFavorite: boolean
    dontAskAgainArchive: boolean
  }
  temporaryStates: {
    hidden?: boolean
    unfavorited?: boolean
    unarchived?: boolean
  } | null
}

export function useJobCard({ job, type = "all", onFavorite, onArchive, onHide, onRestore }: UseJobCardProps) {
  const dispatch = useAppDispatch()
  const { t } = useLanguage()
  const { toast } = useReduxToast()

  // Get don't ask again preferences from Redux
  const dontAskAgainPreferences = useAppSelector(selectDontAskAgainPreferences)

  // Initialize state
  const [state, setState] = useState<JobCardState>({
    isHovered: false,
    dialogs: {
      hide: false,
      favorite: false,
      archive: false,
    },
    dontAskAgain: {
      dontAskAgainHide: dontAskAgainPreferences.hide,
      dontAskAgainFavorite: dontAskAgainPreferences.favorite,
      dontAskAgainArchive: dontAskAgainPreferences.archive,
    },
    temporaryStates: null,
  })

  // Create refs for dialogs
  const dialogRefs = {
    hide: React.createRef<HTMLDivElement>(),
    favorite: React.createRef<HTMLDivElement>(),
    archive: React.createRef<HTMLDivElement>(),
  }

  // Create refs for timeouts
  const timeoutRefs = {
    hidden: useRef<NodeJS.Timeout | null>(null),
    unfavorited: useRef<NodeJS.Timeout | null>(null),
    unarchived: useRef<NodeJS.Timeout | null>(null),
  }

  // Clear timeouts on unmount
  useEffect(() => {
    return () => {
      if (timeoutRefs.hidden.current) clearTimeout(timeoutRefs.hidden.current)
      if (timeoutRefs.unfavorited.current) clearTimeout(timeoutRefs.unfavorited.current)
      if (timeoutRefs.unarchived.current) clearTimeout(timeoutRefs.unarchived.current)
    }
  }, [])

  // Set hovered state
  const setHovered = useCallback((isHovered: boolean) => {
    setState((prev) => ({ ...prev, isHovered }))
  }, [])

  // Handle hide click
  const handleHideClick = useCallback(() => {
    if (dontAskAgainPreferences.hide) {
      // If don't ask again is enabled, set temporary state immediately
      setState((prev) => ({
        ...prev,
        temporaryStates: { ...prev.temporaryStates, hidden: true },
      }))

      // Set timeout to permanently hide after 3 seconds
      timeoutRefs.hidden.current = setTimeout(() => {
        dispatch(toggleHidden(job.id))
        if (onHide && typeof job.id === "number") {
          onHide(job.id)
        }

        // Show toast notification
        toast({
          title: t("toast.jobHidden"),
          type: "success",
          duration: 3000,
        })
      }, 3000)
    } else {
      // Otherwise, show confirmation dialog
      setState((prev) => ({
        ...prev,
        dialogs: { ...prev.dialogs, hide: true },
      }))
    }
  }, [dontAskAgainPreferences.hide, dispatch, job.id, onHide, t, toast])

  // Handle restore click
  const handleRestoreClick = useCallback(() => {
    dispatch(toggleHidden(job.id))
    if (onRestore && typeof job.id === "number") {
      onRestore(job.id)
    }

    // Show toast notification
    toast({
      title: t("toast.jobRestored"),
      type: "success",
      duration: 3000,
    })
  }, [dispatch, job.id, onRestore, t, toast])

  // Handle temporary restore
  const handleTemporaryRestore = useCallback(() => {
    // Clear the timeout to prevent permanent hiding
    if (timeoutRefs.hidden.current) {
      clearTimeout(timeoutRefs.hidden.current)
      timeoutRefs.hidden.current = null
    }

    setState((prev) => ({
      ...prev,
      temporaryStates: null,
    }))

    // Show toast notification
    toast({
      title: t("toast.actionCancelled"),
      type: "info",
      duration: 3000,
    })
  }, [t, toast])

  // Handle unfavorite click
  const handleUnfavoriteClick = useCallback(() => {
    if (dontAskAgainPreferences.favorite) {
      // If don't ask again is enabled, unfavorite immediately
      setState((prev) => ({
        ...prev,
        temporaryStates: { ...prev.temporaryStates, unfavorited: true },
      }))

      // Set timeout to permanently unfavorite after 3 seconds
      timeoutRefs.unfavorited.current = setTimeout(() => {
        dispatch(toggleFavorite(job.id))
        if (onFavorite && typeof job.id === "number") {
          onFavorite(job.id)
        }

        // Show toast notification
        toast({
          title: t("toast.removedFromFavorites"),
          type: "success",
          duration: 3000,
        })
      }, 3000)
    } else {
      // Otherwise, show confirmation dialog
      setState((prev) => ({
        ...prev,
        dialogs: { ...prev.dialogs, favorite: true },
      }))
    }
  }, [dontAskAgainPreferences.favorite, dispatch, job.id, onFavorite, t, toast])

  // Handle undo unfavorite
  const handleUndoUnfavorite = useCallback(() => {
    // Clear the timeout to prevent permanent unfavoriting
    if (timeoutRefs.unfavorited.current) {
      clearTimeout(timeoutRefs.unfavorited.current)
      timeoutRefs.unfavorited.current = null
    }

    setState((prev) => ({
      ...prev,
      temporaryStates: null,
    }))

    // Show toast notification
    toast({
      title: t("toast.jobStillInFavorites"),
      type: "info",
      duration: 3000,
    })
  }, [t, toast])

  // Handle unarchive click
  const handleUnarchiveClick = useCallback(() => {
    if (dontAskAgainPreferences.archive) {
      // If don't ask again is enabled, unarchive immediately
      setState((prev) => ({
        ...prev,
        temporaryStates: { ...prev.temporaryStates, unarchived: true },
      }))

      // Set timeout to permanently unarchive after 3 seconds
      timeoutRefs.unarchived.current = setTimeout(() => {
        dispatch(toggleArchived(job.id))
        if (onArchive && typeof job.id === "number") {
          onArchive(job.id)
        }

        // Show toast notification
        toast({
          title: t("toast.removedFromArchived"),
          type: "success",
          duration: 3000,
        })
      }, 3000)
    } else {
      // Otherwise, show confirmation dialog
      setState((prev) => ({
        ...prev,
        dialogs: { ...prev.dialogs, archive: true },
      }))
    }
  }, [dontAskAgainPreferences.archive, dispatch, job.id, onArchive, t, toast])

  // Handle undo unarchive
  const handleUndoUnarchive = useCallback(() => {
    // Clear the timeout to prevent permanent unarchiving
    if (timeoutRefs.unarchived.current) {
      clearTimeout(timeoutRefs.unarchived.current)
      timeoutRefs.unarchived.current = null
    }

    setState((prev) => ({
      ...prev,
      temporaryStates: null,
    }))

    // Show toast notification
    toast({
      title: t("toast.jobStillInArchived"),
      type: "info",
      duration: 3000,
    })
  }, [t, toast])

  // Confirm hide
  const confirmHide = useCallback(() => {
    setState((prev) => ({
      ...prev,
      dialogs: { ...prev.dialogs, hide: false },
      temporaryStates: { ...prev.temporaryStates, hidden: true },
    }))

    // Set timeout to permanently hide after 3 seconds
    timeoutRefs.hidden.current = setTimeout(() => {
      dispatch(toggleHidden(job.id))
      if (onHide && typeof job.id === "number") {
        onHide(job.id)
      }

      // Show toast notification
      toast({
        title: t("toast.jobHidden"),
        type: "success",
        duration: 3000,
      })
    }, 3000)
  }, [dispatch, job.id, onHide, t, toast])

  // Cancel hide
  const cancelHide = useCallback(() => {
    setState((prev) => ({
      ...prev,
      dialogs: { ...prev.dialogs, hide: false },
    }))
  }, [])

  // Perform unfavorite
  const performUnfavorite = useCallback(() => {
    setState((prev) => ({
      ...prev,
      dialogs: { ...prev.dialogs, favorite: false },
      temporaryStates: { ...prev.temporaryStates, unfavorited: true },
    }))

    // Set timeout to permanently unfavorite after 3 seconds
    timeoutRefs.unfavorited.current = setTimeout(() => {
      dispatch(toggleFavorite(job.id))
      if (onFavorite && typeof job.id === "number") {
        onFavorite(job.id)
      }

      // Show toast notification
      toast({
        title: t("toast.removedFromFavorites"),
        type: "success",
        duration: 3000,
      })
    }, 3000)
  }, [dispatch, job.id, onFavorite, t, toast])

  // Cancel unfavorite
  const cancelUnfavorite = useCallback(() => {
    setState((prev) => ({
      ...prev,
      dialogs: { ...prev.dialogs, favorite: false },
    }))
  }, [])

  // Perform unarchive
  const performUnarchive = useCallback(() => {
    setState((prev) => ({
      ...prev,
      dialogs: { ...prev.dialogs, archive: false },
      temporaryStates: { ...prev.temporaryStates, unarchived: true },
    }))

    // Set timeout to permanently unarchive after 3 seconds
    timeoutRefs.unarchived.current = setTimeout(() => {
      dispatch(toggleArchived(job.id))
      if (onArchive && typeof job.id === "number") {
        onArchive(job.id)
      }

      // Show toast notification
      toast({
        title: t("toast.removedFromArchived"),
        type: "success",
        duration: 3000,
      })
    }, 3000)
  }, [dispatch, job.id, onArchive, t, toast])

  // Cancel unarchive
  const cancelUnarchive = useCallback(() => {
    setState((prev) => ({
      ...prev,
      dialogs: { ...prev.dialogs, archive: false },
    }))
  }, [])

  return {
    state,
    dialogRefs,
    handleHideClick,
    handleRestoreClick,
    handleTemporaryRestore,
    handleUnfavoriteClick,
    handleUndoUnfavorite,
    handleUnarchiveClick,
    handleUndoUnarchive,
    confirmHide,
    cancelHide,
    performUnfavorite,
    cancelUnfavorite,
    performUnarchive,
    cancelUnarchive,
    setHovered,
  }
}
