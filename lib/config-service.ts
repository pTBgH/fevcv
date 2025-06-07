import appConfig from "@/data/app-config.json"
import { updateConfig } from "@/lib/redux/slices/configSlice"
import { store } from "@/lib/redux/store"

// In a real app, this would be an API call to fetch config from the server
export async function loadAppConfig() {
  try {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    // Update Redux store with config
    store.dispatch(updateConfig(appConfig))

    return appConfig
  } catch (error) {
    console.error("Failed to load app configuration:", error)
    throw error
  }
}

// In a real app, this would be an API call to save config to the server
export async function saveAppConfig(config: any) {
  try {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    // Update Redux store with new config
    store.dispatch(updateConfig(config))

    return { success: true }
  } catch (error) {
    console.error("Failed to save app configuration:", error)
    throw error
  }
}

// Initialize the app config when the app starts
export function initAppConfig() {
  loadAppConfig().catch((error) => {
    console.error("Failed to initialize app configuration:", error)
  })
}
