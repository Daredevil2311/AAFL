import React from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { AuthForm } from "../components/AuthForm"

export const Login: React.FC = () => {
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password)
      navigate("/upload")
    } catch (error) {
      console.error("Login failed:", error)
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
          <h2 className="text-2xl font-bold text-foreground mb-6">Login</h2>
          <AuthForm title="Login" onSubmit={handleLogin} />
          
          <div className="mt-6 text-center">
            <p className="text-sm text-muted">
              Don't have an account?{" "}
              <Link to="/signup" className="text-accent hover:underline font-semibold">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
