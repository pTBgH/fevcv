"use client"

import { useCallback } from "react"
import { useJobCard } from "@/hooks/useJobCard"
import { JobCardDetails } from "@/components/job/job-card-details"
import { JobCardActions } from "@/components/job/job-card-actions"
import { JobCardDialog } from "@/components/job/job-card-dialog"
import { JobCardTemporaryState } from "@/components/job/job-card-temporary-state"
import type { Job } from "@/lib/types"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import {
  toggleFavorite,
  toggleArchived,
  selectIsJobFavorite,
  selectIsJobArchived,
  selectIsJobHidden,
  setDontAskAgain,
} from "@/lib/redux/slices/jobActionsSlice"
import { useAuthCheck } from "@/hooks/use-auth-check"
import { useLanguage } from "@/lib/i18n/context"
import { useReduxToast } from "@/hooks/use-redux-toast"
import { LoginPrompt } from "@/components/auth/login-prompt"

interface JobCardProps {
  job: Job
  type?: "all" | "favorite" | "archived" | "hidden"
  onFavorite?: (id: number) => void
  onArchive?: (id: number) => void
  onHide?: (id: number) => void
  onRestore?: (id: number) => void
}

export function JobCard({ job, type = "all", onFavorite, onArchive, onHide, onRestore }: JobCardProps) {
  const dispatch = useAppDispatch()
  const { t } = useLanguage()
  const { checkAuth, loginPromptOpen, closeLoginPrompt, currentFeature } = useAuthCheck()
  const { toast } = useReduxToast()

  // Ensure job has valid company data
  const jobWithCompany = {
    ...job,
    company: {
      name: job.company?.name || `Company ${job.id}`,
      logo: job.company?.logo || "/placeholder.svg?height=64&width=64",
    },
  }

  // Sử dụng Redux selectors
  const isFavorite = useAppSelector((state) => selectIsJobFavorite(state, Number(job.id)))
  const isArchived = useAppSelector((state) => selectIsJobArchived(state, Number(job.id)))
  const isHidden = useAppSelector((state) => selectIsJobHidden(state, Number(job.id)))

  // Sử dụng useJobCard hook để quản lý trạng thái và hành động
  const {
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
  } = useJobCard({
    job: jobWithCompany,
    type,
    onFavorite,
    onArchive,
    onHide,
    onRestore,
  })

  // Create action functions that will be executed only when needed
  const handleFavoriteAction = useCallback(() => {
    console.log(`Direct toggle favorite for job ${job.id}, current state: ${isFavorite}`)

    if (isFavorite && type === "favorite") {
      handleUnfavoriteClick()
    } else {
      dispatch(toggleFavorite(Number(job.id)))
      if (onFavorite) {
        onFavorite(Number(job.id))
      }
      toast({
        title: isFavorite ? t("toast.removedFromFavorites") : t("toast.addedToFavorites"),
        type: "success",
        duration: 3000,
      })
    }
  }, [job.id, isFavorite, dispatch, onFavorite, t, type, handleUnfavoriteClick, toast])

  const handleArchiveAction = useCallback(() => {
    console.log(`Direct toggle archived for job ${job.id}, current state: ${isArchived}`)

    if (isArchived && type === "archived") {
      handleUnarchiveClick()
    } else {
      dispatch(toggleArchived(Number(job.id)))
      if (onArchive) {
        onArchive(Number(job.id))
      }
      toast({
        title: isArchived ? t("toast.removedFromArchived") : t("toast.addedToArchived"),
        type: "success",
        duration: 3000,
      })
    }
  }, [job.id, isArchived, dispatch, onArchive, t, type, handleUnarchiveClick, toast])

  // Create event handlers that use checkAuth to wrap the actions
  const handleToggleFavorite = useCallback(() => {
    const authCheckedAction = checkAuth(handleFavoriteAction, t("job.saveJob"))
    authCheckedAction()
  }, [checkAuth, handleFavoriteAction, t])

  const handleToggleArchived = useCallback(() => {
    const authCheckedAction = checkAuth(handleArchiveAction, t("dashboard.archivedJobs").toLowerCase())
    authCheckedAction()
  }, [checkAuth, handleArchiveAction, t])

  // Update the handleHideClick function
  const handleHideClickWithAuth = useCallback(() => {
    const authCheckedAction = checkAuth(() => {
      handleHideClick()

      // Show toast notification
      toast({
        title: t("toast.jobHidden"),
        type: "success",
        duration: 3000,
      })
    }, t("common.hide").toLowerCase())

    authCheckedAction()
  }, [checkAuth, handleHideClick, t, toast])

  // Update the handleRestoreClick function
  const handleRestoreClickWithAuth = useCallback(() => {
    const authCheckedAction = checkAuth(() => {
      handleRestoreClick()

      // Show toast notification
      toast({
        title: t("toast.jobRestored"),
        type: "success",
        duration: 3000,
      })
    }, t("dashboard.restore").toLowerCase())

    authCheckedAction()
  }, [checkAuth, handleRestoreClick, t, toast])

  // Destructure state for readability
  const { isHovered, dialogs, dontAskAgain, temporaryStates } = state

  if (!job) {
    return (
      <div className="bg-white dark:bg-gray-800/90 rounded-lg border border-gray-100 dark:border-indigo-900/30 shadow-sm dark:shadow-indigo-900/20 p-5 h-[180px] flex items-center justify-center">
        <p className="text-gray-400 dark:text-indigo-300">
          {t("job.jobDetails")} {t("common.error")}
        </p>
      </div>
    )
  }

  // If temporarily hidden, unfavorited, or unarchived, show appropriate message
  if (temporaryStates?.hidden) {
    return <JobCardTemporaryState type="hidden" onRestore={handleTemporaryRestore} />
  }

  if (temporaryStates?.unfavorited) {
    return <JobCardTemporaryState type="unfavorited" onRestore={handleTemporaryRestore} />
  }

  if (temporaryStates?.unarchived) {
    return <JobCardTemporaryState type="unarchived" onRestore={handleTemporaryRestore} />
  }

  return (
    <>
      <div
        className="w-full rounded-xl shadow-md overflow-hidden relative bg-[#F0F0F0] transition-all"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Job Details */}
        <JobCardDetails
          company={jobWithCompany.company}
          category={jobWithCompany.category ?? ""} // Provide default empty string
          title={jobWithCompany.title}
          city={jobWithCompany.city ?? ""} // Provide default empty string
          jobType={jobWithCompany.type ?? ""} // Provide default empty string
          salaryDisplay={`${jobWithCompany.minSalary || 0}-${jobWithCompany.maxSalary || 0}k`}
          daysLeft={jobWithCompany.daysLeft || 10}
        />

        {/* Action Buttons */}
        <JobCardActions
          isFavorite={isFavorite}
          isArchived={isArchived}
          isHovered={isHovered}
          isInBin={type === "hidden"}
          handleToggleFavorite={handleToggleFavorite}
          handleToggleArchived={handleToggleArchived}
          handleHideClick={handleHideClickWithAuth}
          handleRestoreClick={handleRestoreClickWithAuth}
        />
      </div>

      {/* Confirmation Dialog for Hide */}
      <JobCardDialog
        dialogType="hide"
        isOpen={dialogs.hide}
        dontAskAgainToday={dontAskAgain.dontAskAgainHide}
        onDontAskAgainTodayChange={(checked) => {
          dispatch(
            setDontAskAgain({
              preference: "hide",
              value: checked,
            }),
          )
        }}
        onCancel={cancelHide}
        onConfirm={confirmHide}
        dialogRef={dialogRefs.hide}
      />

      {/* Unfavorite Confirmation Dialog */}
      <JobCardDialog
        dialogType="favorite"
        isOpen={dialogs.favorite}
        dontAskAgainToday={dontAskAgain.dontAskAgainFavorite}
        onDontAskAgainTodayChange={(checked) => {
          dispatch(
            setDontAskAgain({
              preference: "favorite",
              value: checked,
            }),
          )
        }}
        onCancel={cancelUnfavorite}
        onConfirm={performUnfavorite}
        dialogRef={dialogRefs.favorite}
      />

      {/* Unarchive Confirmation Dialog */}
      <JobCardDialog
        dialogType="archive"
        isOpen={dialogs.archive}
        dontAskAgainToday={dontAskAgain.dontAskAgainArchive}
        onDontAskAgainTodayChange={(checked) => {
          dispatch(
            setDontAskAgain({
              preference: "archive",
              value: checked,
            }),
          )
        }}
        onCancel={cancelUnarchive}
        onConfirm={performUnarchive}
        dialogRef={dialogRefs.archive}
      />

      {/* Login Prompt */}
      <LoginPrompt open={loginPromptOpen} onClose={closeLoginPrompt} featureName={currentFeature} />
    </>
  )
}
