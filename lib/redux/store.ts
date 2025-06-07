import { configureStore } from "@reduxjs/toolkit"
import jobActionsReducer from "./slices/jobActionsSlice"
import resumeReducer from "./slices/resumeSlice"
import uiReducer from "./slices/uiSlice"
import searchReducer from "./slices/searchSlice"
import notificationReducer from "./slices/notificationSlice"
import authReducer from "./slices/authSlice"
import toastReducer from "./slices/toastSlice"
import configReducer from "./slices/configSlice"

export const store = configureStore({
  reducer: {
    jobActions: jobActionsReducer,
    resumes: resumeReducer,
    ui: uiReducer,
    search: searchReducer,
    notifications: notificationReducer,
    auth: authReducer,
    toast: toastReducer,
    config: configReducer,
  },
  // Enable Redux DevTools
  devTools: process.env.NODE_ENV !== "production",
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
