"use client"

import type React from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider, useAuth } from "./context/AuthContext"
import { JobProvider } from "./context/JobContext"
import { Login } from "./pages/Login"
import { Signup } from "./pages/Signup"
import { UploadAndConfigure } from "./pages/UploadAndConfigure"
import { ProgressView } from "./pages/ProgressView"
import { ResultsDashboard } from "./pages/ResultsDashboard"
import { JobHistory } from "./pages/JobHistory"

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />
}

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/upload"
        element={
          <ProtectedRoute>
            <UploadAndConfigure />
          </ProtectedRoute>
        }
      />
      <Route
        path="/progress/:jobId"
        element={
          <ProtectedRoute>
            <ProgressView />
          </ProtectedRoute>
        }
      />
      <Route
        path="/results/:jobId"
        element={
          <ProtectedRoute>
            <ResultsDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <JobHistory />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <JobProvider>
          <AppRoutes />
        </JobProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
