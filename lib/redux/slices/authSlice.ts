import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"
import Cookies from "js-cookie" // Assuming you use js-cookie

// Define the API URL (ensure it's available)
// const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api"

// MOCK MODE CONFIGURATION
// Set this to true to enable mock mode (offline login)
// Set to false when you want to connect to the real backend
const ENABLE_MOCK_MODE = true // Bạn có thể comment/uncomment dòng này để bật/tắt chế độ giả lập

// Define types for state and payload
interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  error: string | null
  isAuthenticated: boolean
}

interface User {
  id: number
  name: string
  email: string
  // Add other user fields as needed
}

interface LoginResponse {
  status: boolean
  message: string
  token?: string
  user?: User
}

interface RegisterResponse {
  status: boolean
  message: string
}

// --- Axios Instance (Optional but recommended) ---
// Create an instance to easily set base URL and headers
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
})

// Add a request interceptor to include the token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("authToken") // Or get from Redux state
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)
// --- End Axios Instance ---

const initialState: AuthState = {
  user: null,
  token: Cookies.get("authToken") || null, // Initialize from cookie
  isLoading: true, // Start as loading until initialized
  error: null,
  isAuthenticated: !!Cookies.get("authToken"), // Initialize based on token existence
}

// Mock login function for offline mode
const mockLogin = (email: string, password: string): LoginResponse => {
  console.log("Using mock login with:", { email, password })

  // Validate credentials (simple validation for demo)
  if (email && password.length >= 6) {
    // Create a mock user based on the email
    const mockUser: User = {
      id: 1,
      name: email.split("@")[0], // Use part of email as name
      email: email,
    }

    // Generate a random token
    const mockToken = "mock_token_" + Math.random().toString(36).substring(2)

    return {
      status: true,
      message: "Mock login successful",
      token: mockToken,
      user: mockUser,
    }
  } else {
    return {
      status: false,
      message: "Invalid credentials (mock validation)",
    }
  }
}

// Async Thunk for Login
export const loginUser = createAsyncThunk<LoginResponse, { email: string; password: string }, { rejectValue: string }>(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      // Check if mock mode is enabled
      if (ENABLE_MOCK_MODE) {
        try {
          // Try to connect to the backend first
          await axios.get(`${API_URL}/ping`, { timeout: 3000 })
          console.log("Backend connection successful, proceeding with real login")
          // If successful, continue with real login
        } catch (connectionError) {
          // If connection fails, use mock login
          console.log("Backend connection failed, using mock login")
          const mockResponse = mockLogin(credentials.email, credentials.password)

          if (mockResponse.status && mockResponse.token) {
            // Store the mock token in cookies
            Cookies.set("authToken", mockResponse.token, { expires: 7 })
            return mockResponse
          } else {
            return rejectWithValue(mockResponse.message)
          }
        }
      }

      // Real login process
      const response = await axiosInstance.post<LoginResponse>("/login", credentials)
      // Log dữ liệu nhận được NGAY LẬP TỨC
      console.log("AUTH_SLICE: Received response data:", JSON.stringify(response.data, null, 2))
      console.log("AUTH_SLICE: Type of status:", typeof response.data.status)
      console.log("AUTH_SLICE: Type of token:", typeof response.data.token)

      if (response.data.status && response.data.token) {
        Cookies.set("authToken", response.data.token, { expires: 7 }) // Store token
        return response.data // Contains token and potentially user data
      } else {
        // Log lý do điều kiện sai
        console.log(
          "AUTH_SLICE: Condition failed. Status:",
          response.data.status,
          "Token exists:",
          !!response.data.token,
        )
        return rejectWithValue(response.data.message || "Login failed")
      }
    } catch (error: any) {
      console.error("Login error details:", error)

      // If mock mode is enabled and we get a network error, use mock login
      if (ENABLE_MOCK_MODE && (error.message === "Network Error" || error.code === "ECONNABORTED")) {
        console.log("Network error detected, using mock login")
        const mockResponse = mockLogin(credentials.email, credentials.password)

        if (mockResponse.status && mockResponse.token) {
          // Store the mock token in cookies
          Cookies.set("authToken", mockResponse.token, { expires: 7 })
          return mockResponse
        } else {
          return rejectWithValue(mockResponse.message)
        }
      }

      const message = error.response?.data?.message || error.message || "An unknown error occurred"
      return rejectWithValue(message)
    }
  },
)

// Mock register function for offline mode
const mockRegister = (name: string, email: string, password: string): RegisterResponse => {
  console.log("Using mock register with:", { name, email, password })

  // Simple validation
  if (name && email && password.length >= 6) {
    return {
      status: true,
      message: "Mock registration successful",
    }
  } else {
    return {
      status: false,
      message: "Invalid registration data (mock validation)",
    }
  }
}

// Async Thunk for Register
export const registerUser = createAsyncThunk<
  RegisterResponse,
  { name: string; email: string; password: string; password_confirmation: string },
  { rejectValue: string }
>("auth/register", async (userData, { rejectWithValue }) => {
  try {
    // Check if mock mode is enabled
    if (ENABLE_MOCK_MODE) {
      try {
        // Try to connect to the backend first
        await axios.get(`${API_URL}/ping`, { timeout: 3000 })
        console.log("Backend connection successful, proceeding with real registration")
        // If successful, continue with real registration
      } catch (connectionError) {
        // If connection fails, use mock registration
        console.log("Backend connection failed, using mock registration")
        const mockResponse = mockRegister(userData.name, userData.email, userData.password)

        if (mockResponse.status) {
          return mockResponse
        } else {
          return rejectWithValue(mockResponse.message)
        }
      }
    }

    // Real registration process
    const response = await axiosInstance.post<RegisterResponse>("/register", userData)
    if (response.data.status) {
      return response.data
    } else {
      return rejectWithValue(response.data.message || "Registration failed")
    }
  } catch (error: any) {
    // If mock mode is enabled and we get a network error, use mock registration
    if (ENABLE_MOCK_MODE && (error.message === "Network Error" || error.code === "ECONNABORTED")) {
      console.log("Network error detected, using mock registration")
      const mockResponse = mockRegister(userData.name, userData.email, userData.password)

      if (mockResponse.status) {
        return mockResponse
      } else {
        return rejectWithValue(mockResponse.message)
      }
    }

    // Handle validation errors (Laravel typically returns 422)
    if (error.response && error.response.status === 422) {
      const errors = Object.values(error.response.data.errors).flat().join(" ")
      return rejectWithValue(errors || "Validation failed")
    }
    const message = error.response?.data?.message || error.message || "An unknown error occurred"
    return rejectWithValue(message)
  }
})

// Mock logout function for offline mode
const mockLogout = (): void => {
  console.log("Using mock logout")
  Cookies.remove("authToken")
}

// Async Thunk for Logout
export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      // Check if mock mode is enabled
      if (ENABLE_MOCK_MODE) {
        try {
          // Try to connect to the backend first
          await axios.get(`${API_URL}/ping`, { timeout: 3000 })
          console.log("Backend connection successful, proceeding with real logout")
          // If successful, continue with real logout
        } catch (connectionError) {
          // If connection fails, use mock logout
          console.log("Backend connection failed, using mock logout")
          mockLogout()
          return
        }
      }

      // Real logout process
      await axiosInstance.get("/logout") // Use GET as defined in backend routes
      Cookies.remove("authToken") // Remove token
    } catch (error: any) {
      // If mock mode is enabled and we get a network error, use mock logout
      if (ENABLE_MOCK_MODE && (error.message === "Network Error" || error.code === "ECONNABORTED")) {
        console.log("Network error detected, using mock logout")
        mockLogout()
        return
      }

      const message = error.response?.data?.message || error.message || "Logout failed"
      return rejectWithValue(message)
    }
  },
)

// Auth Slice Definition
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    initializeAuth: (state) => {
      // Add this reducer
      const token = Cookies.get("authToken")
      if (token) {
        state.token = token
        state.isAuthenticated = true
        // Optionally: Dispatch another thunk here to fetch user profile based on token
      } else {
        state.token = null
        state.isAuthenticated = false
      }
      state.isLoading = false // Mark initialization as complete
      state.error = null
    },
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload
      state.isAuthenticated = !!action.payload
      if (action.payload) {
        Cookies.set("authToken", action.payload, { expires: 7 })
      } else {
        Cookies.remove("authToken")
      }
    },
    loadUserFromToken: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.isAuthenticated = true
      state.isLoading = false
      state.error = null
    },
    clearError: (state) => {
      // Add this reducer
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.token = action.payload.token! // Assert token exists on success
        state.user = action.payload.user || null // Store user if returned
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload || "Login failed"
        state.isAuthenticated = false
        state.token = null
        state.user = null
      })
      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false
        // Optionally show success message, maybe trigger login or redirect
        state.error = null
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload || "Registration failed"
      })
      // Logout cases
      .addCase(logoutUser.pending, (state) => {
        // Optional: Show loading state during logout
        // state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false
        state.token = null
        state.user = null
        state.isAuthenticated = false
        state.error = null

        // Xóa token từ cookie
        Cookies.remove("authToken")

        // Xóa header Authorization
        if (axiosInstance.defaults.headers.common["Authorization"]) {
          delete axiosInstance.defaults.headers.common["Authorization"]
        }
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false
        // Decide how to handle logout errors, maybe just log them
        console.error("Logout failed:", action.payload)
        // Force logout state even if API fails
        state.token = null
        state.user = null
        state.isAuthenticated = false
      })
  },
})

export const { initializeAuth, setToken, loadUserFromToken, clearError } = authSlice.actions
export default authSlice.reducer
