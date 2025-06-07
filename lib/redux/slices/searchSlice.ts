import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "../store"
import { getFilteredJobs } from "@/lib/job-service"
import type { Job } from "@/lib/types"

// Define the initial state
interface SearchState {
  searchTerm: string
  filters: {
    city?: string
    type?: string
    category?: string
    minSalary?: number
    maxSalary?: number
  }
  results: Job[]
  pagination: {
    currentPage: number
    totalPages: number
    itemsPerPage: number
  }
  loading: boolean
  error: string | null
}

const initialState: SearchState = {
  searchTerm: "",
  filters: {},
  results: [],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 12, // Changed from 6 to 12 for consistency
  },
  loading: false,
  error: null,
}

// Create async thunk for searching jobs
export const searchJobs = createAsyncThunk(
  "search/searchJobs",
  async (
    {
      searchTerm,
      filters,
    }: {
      searchTerm: string
      filters: {
        city?: string
        type?: string
        category?: string
        minSalary?: number
        maxSalary?: number
      }
    },
    { rejectWithValue },
  ) => {
    try {
      const results = getFilteredJobs(searchTerm, filters)
      return { results, searchTerm, filters }
    } catch (error) {
      return rejectWithValue("Failed to search jobs")
    }
  },
)

// Create the slice
const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload
    },
    setFilters: (
      state,
      action: PayloadAction<{
        city?: string
        type?: string
        category?: string
        minSalary?: number
        maxSalary?: number
      }>,
    ) => {
      state.filters = action.payload
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = action.payload
    },
    setItemsPerPage: (state, action: PayloadAction<number>) => {
      state.pagination.itemsPerPage = action.payload
      // Recalculate total pages
      state.pagination.totalPages = Math.ceil(state.results.length / action.payload)
    },
    clearSearch: (state) => {
      state.searchTerm = ""
      state.filters = {}
      state.results = []
      state.pagination.currentPage = 1
      state.pagination.totalPages = 1
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchJobs.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(searchJobs.fulfilled, (state, action) => {
        state.loading = false
        state.results = action.payload.results
        state.searchTerm = action.payload.searchTerm
        state.filters = action.payload.filters
        state.pagination.currentPage = 1
        state.pagination.totalPages = Math.ceil(action.payload.results.length / state.pagination.itemsPerPage)
      })
      .addCase(searchJobs.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

// Export actions
export const { setSearchTerm, setFilters, setPage, setItemsPerPage, clearSearch } = searchSlice.actions

// Export selectors
export const selectSearchTerm = (state: RootState) => state.search.searchTerm
export const selectFilters = (state: RootState) => state.search.filters
export const selectSearchResults = (state: RootState) => state.search.results
export const selectPagination = (state: RootState) => state.search.pagination
export const selectSearchLoading = (state: RootState) => state.search.loading
export const selectSearchError = (state: RootState) => state.search.error
export const selectPaginatedResults = (state: RootState) => {
  const { currentPage, itemsPerPage } = state.search.pagination
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  return state.search.results.slice(startIndex, endIndex)
}

export default searchSlice.reducer
