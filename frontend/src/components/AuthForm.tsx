"use client"

import type React from "react"
import { useState } from "react"

interface AuthFormProps {
  title: string
  onSubmit: (email: string, password: string) => Promise<void>
  isLoading?: boolean
  error?: string
}

export const AuthForm: React.FC<AuthFormProps> = ({ title, onSubmit, isLoading = false, error }) => {
  const [email, setEmail] = useState("demo@local")
  const [password, setPassword] = useState("password123")
  const [localError, setLocalError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError("")
    try {
      await onSubmit(email, password)
    } catch (err: any) {
      setLocalError(err.message)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
      <h2 className="text-2xl font-bold text-accent">{title}</h2>

      {(error || localError) && (
        <div className="bg-destructive bg-opacity-20 text-destructive p-3 rounded border border-destructive">
          {error || localError}
        </div>
      )}

      <div className="space-y-2">
        <label className="block text-sm font-medium">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          aria-label="Email address"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          aria-label="Password"
          required
        />
      </div>

      <button type="submit" disabled={isLoading} className="btn-primary w-full" aria-label={`${title} button`}>
        {isLoading ? "Loading..." : title}
      </button>

      <p className="text-xs text-muted text-center">Demo credentials: demo@local / password123</p>
    </form>
  )
}
