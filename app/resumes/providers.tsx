"use client"

import type React from "react"

import { Provider } from "react-redux"
import { store } from "@/lib/redux/store"
import { LanguageProvider } from "@/lib/i18n/context"
// import { ReduxToastContainer } from "@/components/common/redux-toast"
import { ThemeProvider } from "@/components/theme/theme-provider"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <LanguageProvider>
        <ThemeProvider>
            {/* <ToastProvider> */}
              {children}
              {/* <ReduxToastContainer /> */}
            {/* </ToastProvider> */}
        </ThemeProvider>
      </LanguageProvider>
    </Provider>
  )
}
