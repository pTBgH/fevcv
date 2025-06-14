// import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
// import type { RootState } from "../store"

// export type ToastType = "success" | "error" | "info" | "warning"

// export interface ToastAction {
//   label: string
//   onClick: () => void
// }

// export interface UndoAction {
//   actionType: string
//   entityType: string
//   entityName: string
//   undoFunction: () => void
// }

// export interface Toast {
//   id: string
//   title: string
//   description?: string
//   type: ToastType
//   duration?: number
//   action?: ToastAction
//   undoAction?: UndoAction
//   entityContext?: {
//     type: string
//     name: string
//   }
// }

// interface ToastState {
//   toasts: Toast[]
//   undoHistory: Record<string, boolean> // Track which actions have been undone
//   lastToastId: string | null // Store the last toast ID here
// }

// const initialState: ToastState = {
//   toasts: [],
//   undoHistory: {},
//   lastToastId: null,
// }

// const MAX_TOASTS = 3

// export const toastSlice = createSlice({
//   name: "toast",
//   initialState,
//   reducers: {
//     addToast: (state, action: PayloadAction<Omit<Toast, "id">>) => {
//       const id = Math.random().toString(36).substring(2, 9)
//       const newToast = { id, ...action.payload }

//       // Add new toast to the beginning of the array
//       state.toasts = [newToast, ...state.toasts].slice(0, MAX_TOASTS) // Limit to MAX_TOASTS

//       // Store the ID in the state instead of returning it
//       state.lastToastId = id
//     },
//     removeToast: (state, action: PayloadAction<string>) => {
//       state.toasts = state.toasts.filter((toast) => toast.id !== action.payload)
//     },
//     clearToasts: (state) => {
//       state.toasts = []
//     },
//     markActionUndone: (state, action: PayloadAction<string>) => {
//       // Mark an action as undone to prevent duplicate notifications
//       state.undoHistory[action.payload] = true
//     },
//     // Remove the checkActionUndone reducer as it's not needed
//   },
// })

// export const { addToast, removeToast, clearToasts, markActionUndone } = toastSlice.actions

// // Selectors
// export const selectToasts = (state: RootState) => state.toast.toasts
// export const selectLastToastId = (state: RootState) => state.toast.lastToastId
// export const selectUndoHistory = (state: RootState) => state.toast.undoHistory

// export default toastSlice.reducer
