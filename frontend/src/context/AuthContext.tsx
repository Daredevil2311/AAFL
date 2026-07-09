"use client"

import React, { createContext, useState, useCallback, type ReactNode } from "react"
import type { AuthContextType } from "../types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000"

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null)
  const [token, setToken] = useState<string | null>(null)

  // Initialize from localStorage
  React.useEffect(() => {
    const stored = localStorage.getItem("auth")
    if (stored) {
      const { user, token } = JSON.parse(stored)
      setUser(user)
      setToken(token)
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        username: email,
        password,
      }),
    })

    const data = await response.json()

    if (!response.ok || !data?.access_token) {
      throw new Error(data?.detail ?? "Invalid credentials")
    }

    const authUser = { id: data.user_id ?? email, email }
    setUser(authUser)
    setToken(data.access_token)
    localStorage.setItem("auth", JSON.stringify({ user: authUser, token: data.access_token }))
  }, [])

  const signup = useCallback(async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data?.detail ?? "Failed to sign up")
    }

    await login(email, password)
  }, [login])

  const logout = useCallback(() => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("auth")
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        signup,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
