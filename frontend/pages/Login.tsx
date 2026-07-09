"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { AuthForm } from "../components/AuthForm"

export const Login: React.FC = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true)
    setError("")
    try {
      await login(email, password)
      navigate("/upload")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="space-y-8 w-full max-w-md">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-accent">FedLearn</h1>
          <p className="text-muted">Attack Simulation Platform</p>
        </div>
        <AuthForm title="Sign In" onSubmit={handleLogin} isLoading={isLoading} error={error} />
        <p className="text-center text-sm text-muted">
          Don't have an account?{" "}
          <button onClick={() => navigate("/signup")} className="text-accent hover:text-blue-400 font-medium">
            Sign up
          </button>
        </p>
      </div>
    </div>
  )
}
