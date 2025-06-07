import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "../store"

// Define the configuration state interface
interface ConfigState {
  jobsPerPage: number
  jobsPerRow: {
    mobile: number
    tablet: number
    desktop: number
  }
  defaultDisplayMode: {
    columns: number
    rows: number
  }
}

// Define the initial state
const initialState: ConfigState = {
  jobsPerPage: 12,
  jobsPerRow: {
    mobile: 1,
    tablet: 2,
    desktop: 3,
  },
  defaultDisplayMode: {
    columns: 3,
    rows: 3,
  },
}

// Create the slice
export const configSlice = createSlice({
  name: "config",
  initialState,
  reducers: {
    setJobsPerPage: (state, action: PayloadAction<number>) => {
      state.jobsPerPage = action.payload
    },
    setJobsPerRow: (state, action: PayloadAction<{ mobile?: number; tablet?: number; desktop?: number }>) => {
      state.jobsPerRow = { ...state.jobsPerRow, ...action.payload }
    },
    setDefaultDisplayMode: (state, action: PayloadAction<{ columns?: number; rows?: number }>) => {
      state.defaultDisplayMode = { ...state.defaultDisplayMode, ...action.payload }
    },
    updateConfig: (state, action: PayloadAction<Partial<ConfigState>>) => {
      return { ...state, ...action.payload }
    },
  },
})

// Export actions
export const { setJobsPerPage, setJobsPerRow, setDefaultDisplayMode, updateConfig } = configSlice.actions

// Export selectors
export const selectJobsPerPage = (state: RootState) => state.config.jobsPerPage
export const selectJobsPerRow = (state: RootState) => state.config.jobsPerRow
export const selectDefaultDisplayMode = (state: RootState) => state.config.defaultDisplayMode

export default configSlice.reducer
