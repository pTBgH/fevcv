// Đảm bảo trang Auth sử dụng Redux cho trạng thái xác thực
"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/lib/i18n/context"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { loginUser, registerUser, clearError } from "@/lib/redux/slices/authSlice"
import { useAuth } from "@/hooks/use-auth"

export default function AuthPage() {
  const { t } = useLanguage()
  const [isLogin, setIsLogin] = useState(true)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirmation, setPasswordConfirmation] = useState("")
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const searchParams = useSearchParams()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { isAuthenticated, isLoading, error } = useAppSelector((state) => state.auth)
  const { requireNoAuth } = useAuth()

  // Redirect if already authenticated
  useEffect(() => {
    requireNoAuth()
  }, [requireNoAuth])

  // Clear errors when switching between login and register
  useEffect(() => {
    dispatch(clearError())
    setFormErrors({})
  }, [isLogin, dispatch])

  // Handle redirect after successful authentication
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      const redirect = searchParams.get("redirect") || "/dashboard"
      router.push(redirect)
    }
  }, [isAuthenticated, isLoading, router, searchParams])

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!email) errors.email = t("auth.emailRequired")
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = t("auth.invalidEmail")

    if (!password) errors.password = t("auth.passwordRequired")
    else if (password.length < 6) errors.password = t("auth.passwordTooShort")

    if (!isLogin) {
      if (!name) errors.name = t("auth.nameRequired")

      if (password !== passwordConfirmation) {
        errors.passwordConfirmation = t("auth.passwordsDoNotMatch")
      }
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    if (isLogin) {
      dispatch(loginUser({ email, password }))
    } else {
      dispatch(
        registerUser({
          name,
          email,
          password,
          password_confirmation: passwordConfirmation,
        }),
      )
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            {isLogin ? t("auth.signIn") : t("auth.createAccount")}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
            {isLogin ? t("auth.noAccount") : t("auth.alreadyHaveAccount")}{" "}
            <button className="font-medium text-blue-600 hover:text-blue-500" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? t("auth.signUp") : t("auth.signIn")}
            </button>
          </p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  {t("auth.name")}
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={formErrors.name ? "border-red-300" : ""}
                />
                {formErrors.name && <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                {t("auth.email")}
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={formErrors.email ? "border-red-300" : ""}
              />
              {formErrors.email && <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                {t("auth.password")}
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={formErrors.password ? "border-red-300" : ""}
              />
              {formErrors.password && <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>}
            </div>

            {!isLogin && (
              <div>
                <label
                  htmlFor="passwordConfirmation"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  {t("auth.confirmPassword")}
                </label>
                <Input
                  id="passwordConfirmation"
                  name="passwordConfirmation"
                  type="password"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  className={formErrors.passwordConfirmation ? "border-red-300" : ""}
                />
                {formErrors.passwordConfirmation && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.passwordConfirmation}</p>
                )}
              </div>
            )}
          </div>

          <div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {t("common.loading")}
                </span>
              ) : isLogin ? (
                t("auth.signIn")
              ) : (
                t("auth.signUp")
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
