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
import { useLanguage } from "@/lib/i18n/context"

// === SỬA BƯỚC 1: Cập nhật interface ===
interface UseJobCardProps {
  job: Job
  type?: "all" | "favorite" | "archived" | "hidden"
  onFavorite?: (id: string) => void
  onArchive?: (id: string) => void
  onHide?: (id: string) => void
  onRestore?: (id: string) => void
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

// === SỬA BƯỚC 2: Sửa toàn bộ logic bên trong hook ===
// Đổi tên export để khớp với lỗi bạn gặp phải.
export const useJobCard = ({ job, type = "all", onFavorite, onArchive, onHide, onRestore }: UseJobCardProps) => {
  const dispatch = useAppDispatch()
  const { t } = useLanguage()

  const dontAskAgainPreferences = useAppSelector(selectDontAskAgainPreferences)

  const [state, setState] = useState<JobCardState>({
    isHovered: false,
    dialogs: { hide: false, favorite: false, archive: false },
    dontAskAgain: {
      dontAskAgainHide: dontAskAgainPreferences.hide,
      dontAskAgainFavorite: dontAskAgainPreferences.favorite,
      dontAskAgainArchive: dontAskAgainPreferences.archive,
    },
    temporaryStates: null,
  })

  const dialogRefs = {
    hide: React.createRef<HTMLDivElement>(),
    favorite: React.createRef<HTMLDivElement>(),
    archive: React.createRef<HTMLDivElement>(),
  }

  const timeoutRefs = {
    hidden: useRef<NodeJS.Timeout | null>(null),
    unfavorited: useRef<NodeJS.Timeout | null>(null),
    unarchived: useRef<NodeJS.Timeout | null>(null),
  }

  useEffect(() => {
    return () => {
      Object.values(timeoutRefs).forEach(ref => {
        if (ref.current) clearTimeout(ref.current);
      });
    }
  }, []) // Thêm dependency rỗng để chỉ chạy 1 lần

  const setHovered = useCallback((isHovered: boolean) => {
    setState((prev) => ({ ...prev, isHovered }))
  }, [])

  // --- Sửa các hàm xử lý ---

  const handleHideClick = useCallback(() => {
    if (dontAskAgainPreferences.hide) {
      setState((prev) => ({ ...prev, temporaryStates: { ...prev.temporaryStates, hidden: true } }))
      timeoutRefs.hidden.current = setTimeout(() => {
        dispatch(toggleHidden(job.id))
        if (onHide) onHide(job.id); // Bỏ kiểm tra typeof
      }, 3000)
    } else {
      setState((prev) => ({ ...prev, dialogs: { ...prev.dialogs, hide: true } }))
    }
  }, [dontAskAgainPreferences.hide, dispatch, job.id, onHide])

  const handleRestoreClick = useCallback(() => {
    dispatch(toggleHidden(job.id))
    if (onRestore) onRestore(job.id); // Bỏ kiểm tra typeof
    // toast...
  }, [dispatch, job.id, onRestore])

  const handleTemporaryRestore = useCallback(() => {
    if (timeoutRefs.hidden.current) {
      clearTimeout(timeoutRefs.hidden.current)
      timeoutRefs.hidden.current = null
    }
    setState((prev) => ({ ...prev, temporaryStates: null }))
    // toast...
  }, [])

  const handleUnfavoriteClick = useCallback(() => {
    if (dontAskAgainPreferences.favorite) {
      setState((prev) => ({ ...prev, temporaryStates: { ...prev.temporaryStates, unfavorited: true } }))
      timeoutRefs.unfavorited.current = setTimeout(() => {
        dispatch(toggleFavorite(job.id))
        if (onFavorite) onFavorite(job.id); // Bỏ kiểm tra typeof
        // toast...
      }, 3000)
    } else {
      setState((prev) => ({ ...prev, dialogs: { ...prev.dialogs, favorite: true } }))
    }
  }, [dontAskAgainPreferences.favorite, dispatch, job.id, onFavorite])

  const handleUndoUnfavorite = useCallback(() => {
    if (timeoutRefs.unfavorited.current) {
      clearTimeout(timeoutRefs.unfavorited.current)
      timeoutRefs.unfavorited.current = null
    }
    setState((prev) => ({ ...prev, temporaryStates: null }))
    // toast...
  }, [])

  const handleUnarchiveClick = useCallback(() => {
    if (dontAskAgainPreferences.archive) {
      setState((prev) => ({ ...prev, temporaryStates: { ...prev.temporaryStates, unarchived: true } }))
      timeoutRefs.unarchived.current = setTimeout(() => {
        dispatch(toggleArchived(job.id))
        if (onArchive) onArchive(job.id); // Bỏ kiểm tra typeof
        // toast...
      }, 3000)
    } else {
      setState((prev) => ({ ...prev, dialogs: { ...prev.dialogs, archive: true } }))
    }
  }, [dontAskAgainPreferences.archive, dispatch, job.id, onArchive])

  const handleUndoUnarchive = useCallback(() => {
    if (timeoutRefs.unarchived.current) {
      clearTimeout(timeoutRefs.unarchived.current)
      timeoutRefs.unarchived.current = null
    }
    setState((prev) => ({ ...prev, temporaryStates: null }))
    // toast...
  }, [])

  const confirmHide = useCallback(() => {
    setState((prev) => ({ ...prev, dialogs: { ...prev.dialogs, hide: false }, temporaryStates: { ...prev.temporaryStates, hidden: true } }))
    timeoutRefs.hidden.current = setTimeout(() => {
      dispatch(toggleHidden(job.id))
      if (onHide) onHide(job.id); // Bỏ kiểm tra typeof
    }, 3000)
  }, [dispatch, job.id, onHide])

  const cancelHide = useCallback(() => {
    setState((prev) => ({ ...prev, dialogs: { ...prev.dialogs, hide: false } }))
  }, [])

  const performUnfavorite = useCallback(() => {
    setState((prev) => ({ ...prev, dialogs: { ...prev.dialogs, favorite: false }, temporaryStates: { ...prev.temporaryStates, unfavorited: true } }))
    timeoutRefs.unfavorited.current = setTimeout(() => {
      dispatch(toggleFavorite(job.id))
      if (onFavorite) onFavorite(job.id); // Bỏ kiểm tra typeof
    }, 3000)
  }, [dispatch, job.id, onFavorite])

  const cancelUnfavorite = useCallback(() => {
    setState((prev) => ({ ...prev, dialogs: { ...prev.dialogs, favorite: false } }))
  }, [])

  const performUnarchive = useCallback(() => {
    setState((prev) => ({ ...prev, dialogs: { ...prev.dialogs, archive: false }, temporaryStates: { ...prev.temporaryStates, unarchived: true } }))
    timeoutRefs.unarchived.current = setTimeout(() => {
      dispatch(toggleArchived(job.id))
      if (onArchive) onArchive(job.id); // Bỏ kiểm tra typeof
    }, 3000)
  }, [dispatch, job.id, onArchive])

  const cancelUnarchive = useCallback(() => {
    setState((prev) => ({ ...prev, dialogs: { ...prev.dialogs, archive: false } }))
  }, [])

  return {
    state,
    dialogRefs,
    setHovered,
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
  }
}