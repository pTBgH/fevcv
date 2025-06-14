// file: lib/redux/slices/suggestionSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Job } from '@/lib/types';
import type { RootState } from '../store'; // Đảm bảo đường dẫn đúng

interface SuggestionState {
  jobs: Job[];
  loading: boolean;
  error: string | null;
}

const initialState: SuggestionState = {
  jobs: [],
  loading: false,
  error: null,
};

const suggestionSlice = createSlice({
  name: 'suggestions',
  initialState,
  reducers: {
    setSuggestedJobs(state, action: PayloadAction<Job[]>) {
      state.jobs = action.payload;
      state.loading = false;
      state.error = null;
    },
    clearSuggestions(state) {
      state.jobs = [];
    },
    setSuggestionsLoading(state) {
        state.loading = true;
    },
    setSuggestionsError(state, action: PayloadAction<string>) {
        state.loading = false;
        state.error = action.payload;
    }
  },
});

export const { setSuggestedJobs, clearSuggestions, setSuggestionsLoading, setSuggestionsError } = suggestionSlice.actions;

// Selectors
export const selectSuggestedJobs = (state: RootState) => state.suggestions.jobs;
export const selectSuggestionsLoading = (state: RootState) => state.suggestions.loading;

export default suggestionSlice.reducer;