"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { AuthForm } from "../components/AuthForm"

export const Signup: React.FC = () => {
  const navigate = useNavigate()
  const { signup } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSignup = async (email: string, password: string) => {
    setIsLoading(true)
    setError("")
    try {
      await signup(email, password)
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
          <p className="text-muted">Create Your Account</p>
        </div>
        <AuthForm title="Create Account" onSubmit={handleSignup} isLoading={isLoading} error={error} />
        <p className="text-center text-sm text-muted">
          Already have an account?{" "}
          <button onClick={() => navigate("/login")} className="text-accent hover:text-blue-400 font-medium">
            Sign in
          </button>
        </p>
      </div>
    </div>
  )
}
