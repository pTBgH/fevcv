import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "../store"

interface UiState {
  navBgColor: string
  theme: "light" | "dark" | "system"
  isMobile: boolean
  orientation: "portrait" | "landscape"
  loginPromptOpen: boolean
  currentFeature: string
  navType: "main" | "dashboard"
}

const initialState: UiState = {
  navBgColor: "bg-white",
  theme: "light",
  isMobile: false,
  orientation: "portrait",
  loginPromptOpen: false,
  currentFeature: "",
  navType: "main",
}

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setNavBgColor: (state, action: PayloadAction<string>) => {
      state.navBgColor = action.payload
    },
    setTheme: (state, action: PayloadAction<"light" | "dark" | "system">) => {
      state.theme = action.payload
    },
    setMobileState: (state, action: PayloadAction<boolean>) => {
      state.isMobile = action.payload
    },
    setOrientation: (state, action: PayloadAction<"portrait" | "landscape">) => {
      state.orientation = action.payload
    },
    showLoginPrompt: (state, action: PayloadAction<string>) => {
      state.loginPromptOpen = true
      state.currentFeature = action.payload
    },
    hideLoginPrompt: (state) => {
      state.loginPromptOpen = false
      state.currentFeature = ""
    },
    setNavType: (state, action: PayloadAction<"main" | "dashboard">) => {
      state.navType = action.payload
    },
  },
})

export const { setNavBgColor, setTheme, setMobileState, setOrientation, showLoginPrompt, hideLoginPrompt, setNavType } =
  uiSlice.actions

export const selectNavBgColor = (state: RootState) => state.ui.navBgColor
export const selectTheme = (state: RootState) => state.ui.theme
export const selectMobileState = (state: RootState) => state.ui.isMobile
export const selectOrientation = (state: RootState) => state.ui.orientation
export const selectLoginPromptOpen = (state: RootState) => state.ui.loginPromptOpen
export const selectCurrentFeature = (state: RootState) => state.ui.currentFeature
export const selectNavType = (state: RootState) => state.ui.navType

export default uiSlice.reducer
