// "use client"

// import { useCallback } from "react"
// import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
// import {
//   addToast,
//   removeToast,
//   clearToasts,
//   markActionUndone,
//   selectToasts,
//   selectLastToastId,
//   type ToastType,
//   type ToastAction,
//   type UndoAction,
// } from "@/lib/redux/slices/toastSlice"
// import { useLanguage } from "@/lib/i18n/context"

// interface UseReduxToastReturn {
//   toasts: ReturnType<typeof selectToasts>
//   toast: (props: {
//     title: string
//     description?: string
//     type?: ToastType
//     duration?: number
//     action?: ToastAction
//     undoAction?: UndoAction
//     entityContext?: {
//       type: string
//       name: string
//     }
//   }) => void
//   actionToast: (props: {
//     actionType: string
//     entityType: string
//     entityName: string
//     undoFunction: () => void
//     type?: ToastType
//     duration?: number
//   }) => void
//   dismiss: (id: string) => void
//   clearAll: () => void
//   markUndone: (actionId: string) => void
// }

// export function useReduxToast(): UseReduxToastReturn {
//   const dispatch = useAppDispatch()
//   const toasts = useAppSelector(selectToasts)
//   const lastToastId = useAppSelector(selectLastToastId)
//   const { t } = useLanguage()

//   const toast = useCallback(
//     ({
//       title,
//       description,
//       type = "info",
//       duration = 5000, // Default to 5 seconds
//       action,
//       undoAction,
//       entityContext,
//     }: {
//       title: string
//       description?: string
//       type?: ToastType
//       duration?: number
//       action?: ToastAction
//       undoAction?: UndoAction
//       entityContext?: {
//         type: string
//         name: string
//       }
//     }) => {
//       dispatch(
//         addToast({
//           title,
//           description,
//           type,
//           duration,
//           action,
//           undoAction,
//           entityContext,
//         }),
//       )

//       // Get the ID from the state after dispatch
//       const id = lastToastId

//       // Auto remove after duration if we have an ID
//       if (id && duration !== Number.POSITIVE_INFINITY && duration > 0) {
//         setTimeout(() => {
//           dispatch(removeToast(id))
//         }, duration)
//       }
//     },
//     [dispatch, lastToastId],
//   )

//   // New helper function for action-based toasts with undo
//   const actionToast = useCallback(
//     ({
//       actionType,
//       entityType,
//       entityName,
//       undoFunction,
//       type = "success",
//       duration = 5000,
//     }: {
//       actionType: string
//       entityType: string
//       entityName: string
//       undoFunction: () => void
//       type?: ToastType
//       duration?: number
//     }) => {
//       // Generate a unique action ID for tracking undo status
//       const actionId = `${actionType}-${entityType}-${entityName}-${Date.now()}`

//       // Create title based on action and entity
//       // Fix the template string issue by directly replacing the entity type
//       const actionKey = `toast.${actionType}`
//       const entityTranslation = t(`entity.${entityType}`)
//       const title = t(actionKey).replace("{{entity}}", entityTranslation)

//       // Create entity context
//       const entityContext = {
//         type: entityType,
//         name: entityName,
//       }

//       toast({
//         title,
//         type,
//         duration,
//         undoAction: {
//           actionType,
//           entityType,
//           entityName,
//           undoFunction,
//         },
//         entityContext,
//         action: {
//           label: t("common.undo"),
//           onClick: () => {
//             undoFunction()
//             dispatch(markActionUndone(actionId))
//           },
//         },
//       })
//     },
//     [dispatch, toast, t],
//   )

//   const dismiss = useCallback(
//     (id: string) => {
//       dispatch(removeToast(id))
//     },
//     [dispatch],
//   )

//   const clearAll = useCallback(() => {
//     dispatch(clearToasts())
//   }, [dispatch])

//   const markUndone = useCallback(
//     (actionId: string) => {
//       dispatch(markActionUndone(actionId))
//     },
//     [dispatch],
//   )

//   return {
//     toasts,
//     toast,
//     actionToast,
//     dismiss,
//     clearAll,
//     markUndone,
//   }
// }
