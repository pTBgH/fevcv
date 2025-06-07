import { vi } from "./vi"
import { en } from "./en"

export type Locale = "vi" | "en"

export type TranslationKeys = keyof typeof vi | keyof typeof en

// Function to get translations based on locale
export const getTranslations = (locale: Locale) => {
  return locale === "vi" ? vi : en
}

// Function to get a nested translation value (e.g., 'home.heroTitle')
export const getNestedTranslation = (obj: any, path: string) => {
  const keys = path.split(".")
  return keys.reduce((acc, key) => {
    if (acc === undefined || acc === null) return undefined
    return acc[key]
  }, obj)
}

// Add useTranslation export to fix the error
export const useTranslation = () => {
  // This is a placeholder. The actual implementation should use the context
  // This function should be imported from context.tsx instead
  throw new Error("Import useTranslation from lib/i18n/context instead")
}
