import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "../store"

interface JobActionsState {
  favoriteJobs: number[]
  archivedJobs: number[]
  hiddenJobs: number[]
  dontAskAgain: {
    hide: boolean
    favorite: boolean
    archive: boolean
  }
  temporaryStates: {
    [jobId: number]: {
      hidden?: boolean
      unfavorited?: boolean
      unarchived?: boolean
    }
  }
}

const initialState: JobActionsState = {
  favoriteJobs: [1, 3, 5],
  archivedJobs: [2, 4],
  hiddenJobs: [6],
  dontAskAgain: {
    hide: false,
    favorite: false,
    archive: false,
  },
  temporaryStates: {},
}

export const jobActionsSlice = createSlice({
  name: "jobActions",
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<number>) => {
      const jobId = action.payload
      const index = state.favoriteJobs.indexOf(jobId)
      if (index === -1) {
        state.favoriteJobs.push(jobId)
      } else {
        state.favoriteJobs.splice(index, 1)
      }
    },
    toggleArchived: (state, action: PayloadAction<number>) => {
      const jobId = action.payload
      const index = state.archivedJobs.indexOf(jobId)
      if (index === -1) {
        state.archivedJobs.push(jobId)
      } else {
        state.archivedJobs.splice(index, 1)
      }
    },
    toggleHidden: (state, action: PayloadAction<number>) => {
      const jobId = action.payload
      const index = state.hiddenJobs.indexOf(jobId)
      if (index === -1) {
        state.hiddenJobs.push(jobId)
      } else {
        state.hiddenJobs.splice(index, 1)
      }
    },
    setDontAskAgain: (
      state,
      action: PayloadAction<{ preference: "hide" | "favorite" | "archive"; value: boolean }>,
    ) => {
      const { preference, value } = action.payload
      state.dontAskAgain[preference] = value
    },
    setTemporaryState: (
      state,
      action: PayloadAction<{
        jobId: number
        stateType: "hidden" | "unfavorited" | "unarchived"
        value: boolean
      }>,
    ) => {
      const { jobId, stateType, value } = action.payload
      if (!state.temporaryStates[jobId]) {
        state.temporaryStates[jobId] = {}
      }
      state.temporaryStates[jobId][stateType] = value
    },
    initializeJobActions: (state) => {},
  },
})

// Export actions
export const {
  toggleFavorite,
  toggleArchived,
  toggleHidden,
  setDontAskAgain,
  setTemporaryState,
  initializeJobActions,
} = jobActionsSlice.actions

// Selectors
export const selectIsJobFavorite = (state: RootState, jobId: number) => state.jobActions.favoriteJobs.includes(jobId)
export const selectIsJobArchived = (state: RootState, jobId: number) => state.jobActions.archivedJobs.includes(jobId)
export const selectIsJobHidden = (state: RootState, jobId: number) => state.jobActions.hiddenJobs.includes(jobId)
export const selectDontAskAgainPreferences = (state: RootState) => state.jobActions.dontAskAgain
export const selectJobTemporaryState = (state: RootState, jobId: number) =>
  state.jobActions.temporaryStates[jobId] || null

export default jobActionsSlice.reducer
