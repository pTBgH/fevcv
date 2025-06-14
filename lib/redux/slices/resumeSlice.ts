import { createSlice, createSelector, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import {
  getResumes as getResumesService,
  updateResume as updateResumeService,
  deleteResume as deleteResumeService,
  restoreResume as restoreResumeService,
  toggleFavoriteApi as toggleFavoriteService,
} from "@/lib/cv-service";
import type { WritableDraft } from "immer";
import type { Resume } from "@/lib/types";
import { getSession } from "next-auth/react";


// --- STATE INTERFACE VÀ INITIALSTATE GIỮ NGUYÊN ---
interface ResumeState {
  items: Resume[];
  selectedId: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: ResumeState = {
  items: [],
  selectedId: null,
  loading: false,
  error: null,
};


// === SỬA LẠI TOÀN BỘ ASYNC THUNKS ===

// Helper function để lấy token, tránh lặp code
const getAccessToken = async (rejectWithValue: (value: string) => any) => {
  const session = await getSession();
  if (!session?.accessToken) {
    return rejectWithValue('User not authenticated or session expired.');
  }
  return session.accessToken;
};

export const fetchResumes = createAsyncThunk<Resume[], void, { rejectValue: string }>(
  "resumes/fetchResumes",
  async (_, { rejectWithValue }) => {
    try {
      const accessToken = await getAccessToken(rejectWithValue);
      if (typeof accessToken !== 'string') return accessToken; // Trả về lỗi nếu không có token
      
      const resumes = await getResumesService(accessToken);
      return resumes;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch resumes");
    }
  }
);

export const updateResume = createAsyncThunk<Resume, { id: string; data: Partial<Resume> }, { rejectValue: string }>(
  "resumes/updateResume",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const accessToken = await getAccessToken(rejectWithValue);
      if (typeof accessToken !== 'string') return accessToken;

      const updatedResume = await updateResumeService(id, data, accessToken);
      if (!updatedResume) throw new Error("Update failed, no resume returned.");
      return updatedResume;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : `Failed to update resume ${id}`);
    }
  }
);

export const deleteResume = createAsyncThunk<string, string, { rejectValue: string }>(
  "resumes/deleteResume",
  async (id, { rejectWithValue }) => {
    try {
      const accessToken = await getAccessToken(rejectWithValue);
      if (typeof accessToken !== 'string') return accessToken;

      await deleteResumeService(id, accessToken);
      return id; // Trả về ID để reducer biết cần cập nhật CV nào
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : `Failed to delete resume ${id}`);
    }
  }
);

export const restoreResume = createAsyncThunk<Resume, string, { rejectValue: string }>(
  "resumes/restoreResume",
  async (id, { rejectWithValue }) => {
    try {
      const accessToken = await getAccessToken(rejectWithValue);
      if (typeof accessToken !== 'string') return accessToken;

      const restoredResume = await restoreResumeService(id, accessToken);
      if (!restoredResume) throw new Error("Restore failed, no resume returned.");
      return restoredResume;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : `Failed to restore resume ${id}`);
    }
  }
);

// Thunk mới cho việc toggle favorite, thay thế reducer cũ
export const toggleFavorite = createAsyncThunk<Resume, string, { rejectValue: string }>(
    "resumes/toggleFavorite",
    async (id, { rejectWithValue }) => {
        try {
            const accessToken = await getAccessToken(rejectWithValue);
            if (typeof accessToken !== 'string') return accessToken;

            const updatedResume = await toggleFavoriteService(id, accessToken);
            if (!updatedResume) throw new Error("Toggle favorite failed.");
            return updatedResume;
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : `Failed to toggle favorite for ${id}`);
        }
    }
);


// --- SỬA LẠI SLICE ---
const resumeSlice = createSlice({
  name: "resumes",
  initialState,
  reducers: {
    setSelectedResume: (state, action: PayloadAction<string | null>) => {
      state.selectedId = action.payload;
    },
    addResume: (state, action: PayloadAction<Resume>) => {
      const existingIndex = state.items.findIndex(r => r.id === action.payload.id);
      if (existingIndex === -1) {
        state.items.unshift(action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // *** ĐẶT .addCase LÊN TRÊN .addMatcher ***
      // Fetch
      .addCase(fetchResumes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResumes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchResumes.fulfilled, (state, action: PayloadAction<Resume[]>) => {
        state.loading = false;
        state.items = action.payload;
        if (!state.selectedId && action.payload.length > 0) {
          state.selectedId = action.payload[0].id;
        }
      })      
      // Delete
      .addCase(deleteResume.fulfilled, (state, action: PayloadAction<string>) => {
        const deletedId = action.payload;
        const resume = state.items.find(r => r.id === deletedId);
        if (resume) {
          resume.deletedAt = new Date().toISOString();
        }
      })
      // *** .addMatcher ĐẶT Ở DƯỚI ***
      // Xử lý chung cho Update, Restore, Toggle Favorite
      .addMatcher(
        (action): action is PayloadAction<Resume> => 
          [updateResume.fulfilled.type, restoreResume.fulfilled.type, toggleFavorite.fulfilled.type].includes(action.type),
        (state, action) => {
            const updatedResume = action.payload;
            const index = state.items.findIndex((r: Resume) => r.id === updatedResume.id); // Thêm kiểu cho r
            if (index !== -1) {
                state.items[index] = updatedResume as WritableDraft<Resume>;
            }
        }
      );
  },
});

// --- ACTIONS VÀ SELECTORS (CẬP NHẬT) ---

export const { setSelectedResume, addResume } = resumeSlice.actions;

const selectAllItems = (state: RootState) => state.resumes.items;

export const selectActiveResumes = createSelector(
  [selectAllItems],
  (items) => items.filter((resume: Resume) => !resume.deletedAt) // Thêm kiểu cho resume
);

export const selectDeletedResumes = createSelector(
  [selectAllItems],
  (items) => items.filter((resume: Resume) => !!resume.deletedAt) // Thêm kiểu cho resume
);

export const selectFavoriteResumes = createSelector(
  [selectActiveResumes],
  (activeResumes) => activeResumes.filter((resume: Resume) => resume.isFavorite) // Thêm kiểu cho resume
);

export const selectSelectedResumeId = (state: RootState) => state.resumes.selectedId;
export const selectResumesLoading = (state: RootState) => state.resumes.loading;
export const selectResumesError = (state: RootState) => state.resumes.error;

export const selectSelectedResume = createSelector(
  [selectAllItems, selectSelectedResumeId],
  (items, selectedId) => items.find((r: Resume) => r.id === selectedId) || null // Thêm kiểu cho r
);

export default resumeSlice.reducer;