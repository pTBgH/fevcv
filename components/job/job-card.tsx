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
import { useLanguage } from "@/lib/i18n/context"
// import { useReduxToast } from "@/hooks/use-redux-toast"
import { useSession, signIn } from "next-auth/react"
import { CompanyDisplay } from "./company-display"


interface JobCardProps {
  job: Job
  type?: "all" | "favorite" | "archived" | "hidden"
  onFavorite?: (id: string) => void
  onArchive?: (id: string) => void
  onHide?: (id: string) => void
  onRestore?: (id: string) => void
}

function formatSalary(min?: number, max?: number): string {
  const format = (value: number) => `${(value / 1_000_000).toFixed(0)} tr`;

  if (min && max) {
    return `${format(min)} - ${format(max)}`;
  }
  if (min) {
    return `Từ ${format(min)}`;
  }
  if (max) {
    return `Đến ${format(max)}`;
  }
  return "Thỏa thuận";
}


export function JobCard({ job, type = "all", onFavorite, onArchive, onHide, onRestore }: JobCardProps) {
  const dispatch = useAppDispatch()
  const { t } = useLanguage()
  const { data: session, status } = useSession()  // New hook for Keycloak auth via Next‑Auth
  // const { toast } = useReduxToast()

  // Ensure job has valid company data
  const jobWithCompany = {
    ...job,
    company: {
      name: job.company?.name || `Company ${job.id}`,
      logo: job.company?.logo || "/placeholder.svg?height=64&width=64",
    },
  }

  // Redux selectors
  const isFavorite = useAppSelector((state) => selectIsJobFavorite(state, job.id))
  const isArchived = useAppSelector((state) => selectIsJobArchived(state, job.id))
  const isHidden = useAppSelector((state) => selectIsJobHidden(state, job.id))

  // useJobCard hook manages local state and actions
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
    onFavorite, // Truyền thẳng onFavorite (id: string) => void
    onArchive,  // Truyền thẳng onArchive (id: string) => void
    onHide,     // Truyền thẳng onHide (id: string) => void
    onRestore,  // Truyền thẳng onRestore (id: string) => void
  })

  // Action functions without auth wrapper
  const handleFavoriteAction = useCallback(() => {
    if (isFavorite && type === "favorite") {
      handleUnfavoriteClick()
    } else {
      dispatch(toggleFavorite(job.id))
      if (onFavorite) {
        onFavorite(job.id)
      }
      // toast({
      //   title: isFavorite ? t("toast.removedFromFavorites") : t("toast.addedToFavorites"),
      //   type: "success",
      //   duration: 3000,
      // })
    }
  }, [job.id, isFavorite, dispatch, onFavorite, t, type, handleUnfavoriteClick])

  const handleArchiveAction = useCallback(() => {
    if (isArchived && type === "archived") {
      handleUnarchiveClick()
    } else {
      dispatch(toggleArchived(job.id))
      if (onArchive) {
        onArchive(job.id)
      }
      // toast({
      //   title: isArchived ? t("toast.removedFromArchived") : t("toast.addedToArchived"),
      //   type: "success",
      //   duration: 3000,
      // })
    }
  }, [job.id, isArchived, dispatch, onArchive, t, type, handleUnarchiveClick])

  // Auth wrapper: check Next‑Auth session status; if not authenticated, trigger signIn("keycloak")
  const authWrapper = useCallback((action: () => void) => {
    if (status !== "authenticated") {
      signIn("keycloak")
      return
    }
    action()
  }, [status])

  const handleToggleFavorite = useCallback(() => {
    authWrapper(handleFavoriteAction)
  }, [authWrapper, handleFavoriteAction])

  const handleToggleArchived = useCallback(() => {
    authWrapper(handleArchiveAction)
  }, [authWrapper, handleArchiveAction])

  const handleHideClickWithAuth = useCallback(() => {
    authWrapper(() => {
      handleHideClick()
      // toast({
      //   title: t("toast.jobHidden"),
      //   type: "success",
      //   duration: 3000,
      // })
    })
  }, [authWrapper, handleHideClick, t])

  const handleRestoreClickWithAuth = useCallback(() => {
    authWrapper(() => {
      handleRestoreClick()
      // toast({
      //   title: t("toast.jobRestored"),
      //   type: "success",
      //   duration: 3000,
      // })
    })
  }, [authWrapper, handleRestoreClick, t])

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
        className="w-full rounded-xl overflow-hidden relative bg-[#F0F0F0] transition-all"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <JobCardDetails
          company={jobWithCompany.company}
          category={jobWithCompany.category ?? ""}
          title={jobWithCompany.title}
          city={jobWithCompany.city ?? ""}
          jobType={jobWithCompany.type ?? ""}
          salaryDisplay={formatSalary(jobWithCompany.minSalary, jobWithCompany.maxSalary)}
          daysLeft={jobWithCompany.daysLeft || 10}
        />
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

      <JobCardDialog
        dialogType="hide"
        isOpen={dialogs.hide}
        dontAskAgainToday={dontAskAgain.dontAskAgainHide}
        onDontAskAgainTodayChange={(checked) => {
          dispatch(
            setDontAskAgain({
              preference: "hide",
              value: checked,
            })
          )
        }}
        onCancel={cancelHide}
        onConfirm={confirmHide}
        dialogRef={dialogRefs.hide}
      />

      <JobCardDialog
        dialogType="favorite"
        isOpen={dialogs.favorite}
        dontAskAgainToday={dontAskAgain.dontAskAgainFavorite}
        onDontAskAgainTodayChange={(checked) => {
          dispatch(
            setDontAskAgain({
              preference: "favorite",
              value: checked,
            })
          )
        }}
        onCancel={cancelUnfavorite}
        onConfirm={performUnfavorite}
        dialogRef={dialogRefs.favorite}
      />

      <JobCardDialog
        dialogType="archive"
        isOpen={dialogs.archive}
        dontAskAgainToday={dontAskAgain.dontAskAgainArchive}
        onDontAskAgainTodayChange={(checked) => {
          dispatch(
            setDontAskAgain({
              preference: "archive",
              value: checked,
            })
          )
        }}
        onCancel={cancelUnarchive}
        onConfirm={performUnarchive}
        dialogRef={dialogRefs.archive}
      />
    </>
  )
}
