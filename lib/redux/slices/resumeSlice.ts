import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "../store"
import {
  getActiveResumes as getResumes,
  updateResume as updateResumeService,
  deleteResume as deleteResumeService,
} from "@/lib/cv-service"
import type { WritableDraft } from "immer"
import type { Resume } from "@/lib/types"

// Define the initial state
interface ResumeState {
  resumes: Resume[]
  selectedResumeId: string | null
  favoriteResumes: Record<string, boolean>
  loading: boolean
  error: string | null
}

const initialState: ResumeState = {
  resumes: [],
  selectedResumeId: null,
  favoriteResumes: {},
  loading: false,
  error: null,
}

// Create async thunk for fetching resumes
export const fetchResumes = createAsyncThunk("resumes/fetchResumes", async (_, { rejectWithValue }) => {
  try {
    const resumes = getResumes()
    return resumes
  } catch (error) {
    return rejectWithValue("Failed to fetch resumes")
  }
})

// Create async thunk for updating a resume
export const updateResume = createAsyncThunk(
  "resumes/updateResume",
  async ({ id, data }: { id: string; data: Partial<Resume> }, { rejectWithValue }) => {
    try {
      const updatedResume = updateResumeService(id, data || {})
      return updatedResume
    } catch (error) {
      return rejectWithValue(`Failed to update resume ${id}`)
    }
  },
)

// Create async thunk for deleting a resume
export const deleteResume = createAsyncThunk("resumes/deleteResume", async (id: string, { rejectWithValue }) => {
  try {
    await deleteResumeService(id)
    return id
  } catch (error) {
    return rejectWithValue(`Failed to delete resume ${id}`)
  }
})

// Create async thunk for restoring a resume
export const restoreResume = createAsyncThunk("resumes/restoreResume", async (id: string, { rejectWithValue }) => {
  try {
    // Assuming restoreResumeService is defined elsewhere and handles the actual restore logic
    // const restoredResume = restoreResumeService(id); // Replace with your actual restore function
    // return restoredResume;
    return id // Returning id for now, replace with actual restored resume object
  } catch (error) {
    return rejectWithValue(`Failed to restore resume ${id}`)
  }
})

// Create the slice
const resumeSlice = createSlice({
  name: "resumes",
  initialState,
  reducers: {
    setSelectedResume: (state, action: PayloadAction<string>) => {
      state.selectedResumeId = action.payload
    },
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const id = action.payload
      if (state.favoriteResumes[id]) {
        const { [id]: _, ...rest } = state.favoriteResumes
        state.favoriteResumes = rest
      } else {
        state.favoriteResumes[id] = true
      }
    },
    addResume: (state, action: PayloadAction<Resume>) => {
      state.resumes = [...state.resumes, action.payload]
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchResumes.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchResumes.fulfilled, (state, action) => {
        state.loading = false
        state.resumes = action.payload
        // If no resume is selected, select the first one
        if (!state.selectedResumeId && action.payload.length > 0) {
          state.selectedResumeId = action.payload[0].id
        }
      })
      .addCase(fetchResumes.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(updateResume.fulfilled, (state, action) => {
        const updatedResume = action.payload
        state.resumes = state.resumes.map((resume) =>
          updatedResume && resume.id === updatedResume.id ? updatedResume : resume,
        ) as WritableDraft<Resume>[]
      })
      .addCase(deleteResume.fulfilled, (state, action) => {
        const deletedId = action.payload
        state.resumes = state.resumes.filter((resume) => resume.id !== deletedId)

        // If the deleted resume was selected, select another one
        if (state.selectedResumeId === deletedId) {
          state.selectedResumeId = state.resumes.length > 0 ? state.resumes[0].id : null
        }

        // Remove from favorites if it was favorited
        if (state.favoriteResumes[deletedId]) {
          const { [deletedId]: _, ...rest } = state.favoriteResumes
          state.favoriteResumes = rest
        }
      })
      .addCase(restoreResume.fulfilled, (state, action) => {
        const restoredId = action.payload
        state.resumes = state.resumes.map((resume) =>
          resume.id === restoredId ? { ...resume, deletedAt: null } : resume,
        ) as WritableDraft<Resume>[]
      })
  },
})

// Export actions
export const { setSelectedResume, toggleFavorite, addResume } = resumeSlice.actions

// Export selectors
export const selectAllResumes = (state: RootState) => state.resumes.resumes
export const selectActiveResumes = (state: RootState) => state.resumes.resumes.filter((resume) => !resume.deletedAt)
export const selectDeletedResumes = (state: RootState) => state.resumes.resumes.filter((resume) => resume.deletedAt)
export const selectSelectedResumeId = (state: RootState) => state.resumes.selectedResumeId
export const selectResumeById = (state: RootState, id: string) =>
  state.resumes.resumes.find((resume) => resume.id === id)
export const selectIsFavoriteResume = (state: RootState, id: string) => !!state.resumes.favoriteResumes[id]
export const selectFavoriteResumes = (state: RootState) =>
  state.resumes.resumes.filter((resume) => state.resumes.favoriteResumes[resume.id])
export const selectResumesLoading = (state: RootState) => state.resumes.loading
export const selectResumesError = (state: RootState) => state.resumes.error

export default resumeSlice.reducer
