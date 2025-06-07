"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { type Locale, getTranslations, getNestedTranslation } from "./index"

type LanguageContextType = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
}

// Create a default context value
const defaultContextValue: LanguageContextType = {
  locale: "vi",
  setLocale: () => {},
  t: (key) => key,
}

const LanguageContext = createContext<LanguageContextType>(defaultContextValue)

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  // Start with a default value to avoid hydration mismatch
  const [locale, setLocale] = useState<Locale>("vi")
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize locale from localStorage only on client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLocale = localStorage.getItem("locale") as Locale | null
      if (savedLocale && (savedLocale === "vi" || savedLocale === "en")) {
        setLocale(savedLocale)
      }
      setIsInitialized(true)
    }
  }, [])

  // Save locale changes to localStorage
  useEffect(() => {
    if (typeof window !== "undefined" && isInitialized) {
      localStorage.setItem("locale", locale)
      document.documentElement.lang = locale

      // Force re-render of components when language changes
      const event = new Event("languageChange")
      window.dispatchEvent(event)
    }
  }, [locale, isInitialized])

  const t = (key: string): string => {
    const translations = getTranslations(locale)
    return getNestedTranslation(translations, key) || key
  }

  return <LanguageContext.Provider value={{ locale, setLocale, t }}>{children}</LanguageContext.Provider>
}

// Hook to use in components
export const useLanguage = (): LanguageContextType => {
  return useContext(LanguageContext)
}
