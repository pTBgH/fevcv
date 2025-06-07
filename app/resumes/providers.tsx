"use client"

import type React from "react"

import { AppProvider } from "@/context/AppProvider"
import { Provider } from "react-redux"
import { store } from "@/lib/redux/store"
import { useEffect } from "react"
import { initializeAuth } from "@/lib/redux/slices/authSlice"
import { LanguageProvider } from "@/lib/i18n/context"
import { ToastProvider } from "@/components/common/toast-provider"
import { ReduxToastContainer } from "@/components/common/redux-toast"
import { ThemeProvider } from "@/components/theme/theme-provider"

export function Providers({ children }: { children: React.ReactNode }) {
  // Initialize auth state from cookies when the app loads
  useEffect(() => {
    store.dispatch(initializeAuth())
  }, [])

  return (
    <Provider store={store}>
      <LanguageProvider>
        <ThemeProvider>
          <AppProvider>
            <ToastProvider>
              {children}
              <ReduxToastContainer />
            </ToastProvider>
          </AppProvider>
        </ThemeProvider>
      </LanguageProvider>
    </Provider>
  )
}
