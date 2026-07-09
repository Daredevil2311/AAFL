import React from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { AuthForm } from "../components/AuthForm"

export const Signup: React.FC = () => {
  const navigate = useNavigate()
  const { signup } = useAuth()

  const handleSignup = async (email: string, password: string) => {
    try {
      await signup(email, password)
      navigate("/upload")
    } catch (error) {
      console.error("Signup failed:", error)
      throw error
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            🛡️ FedLearn Attack Simulator
          </h1>
          <p className="text-muted">Secure your federated learning models</p>
        </div>
        
        <div className="bg-card rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Sign Up</h2>
          <AuthForm title="Sign Up" onSubmit={handleSignup} />
          
          <div className="mt-6 text-center">
            <p className="text-sm text-muted">
              Already have an account?{" "}
              <Link to="/login" className="text-accent hover:underline font-semibold">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
