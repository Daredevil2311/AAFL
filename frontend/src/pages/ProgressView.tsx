import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ProgressBar } from "../components/ProgressBar"
import { useJob } from "../context/JobContext"
import axios from "axios"

export const ProgressView: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>()
  const navigate = useNavigate()
  const { updateJob, getJobById } = useJob()
  
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<"queued" | "running" | "completed" | "failed">("queued")
  const [message, setMessage] = useState("Initializing...")
  const [attackType, setAttackType] = useState("")
  const [startTime] = useState(Date.now())

  // Simulate smooth progress over 5 minutes (300 seconds)
  useEffect(() => {
    if (!jobId) return

    const TOTAL_DURATION = 300000 // 5 minutes in milliseconds
    const UPDATE_INTERVAL = 100 // Update every 100ms for smooth animation
    
    let animationFrame: number
    let lastUpdate = Date.now()

    const animate = () => {
      const now = Date.now()
      const elapsed = now - startTime
      const newProgress = Math.min((elapsed / TOTAL_DURATION) * 100, 100)
      
      setProgress(Math.floor(newProgress))

      // Update status messages based on progress
      if (newProgress < 20) {
        setMessage("Loading model and datasets...")
        setStatus("running")
      } else if (newProgress < 40) {
        setMessage("Executing attack simulation...")
        setStatus("running")
      } else if (newProgress < 60) {
        setMessage("Running federated learning rounds...")
        setStatus("running")
      } else if (newProgress < 80) {
        setMessage("Detecting attack patterns...")
        setStatus("running")
      } else if (newProgress < 100) {
        setMessage("Finalizing results...")
        setStatus("running")
      } else {
        setMessage("Attack simulation completed")
        setStatus("completed")
      }

      if (newProgress < 100) {
        animationFrame = requestAnimationFrame(animate)
      } else {
        // Poll backend for actual results after 5 minutes
        pollForResults()
      }
    }

    // Start animation
    animationFrame = requestAnimationFrame(animate)

    // Also poll backend periodically for real status
    const pollInterval = setInterval(() => {
      pollBackendStatus()
    }, 10000) // Poll every 10 seconds

    return () => {
      cancelAnimationFrame(animationFrame)
      clearInterval(pollInterval)
    }
  }, [jobId, startTime])

  const pollBackendStatus = async () => {
    if (!jobId) return
    
    try {
      const response = await axios.get(`http://localhost:8000/api/mock/jobs/${jobId}`)
      const data = response.data
      
      if (data.attackType) {
        setAttackType(data.attackType)
      }
      
      // Only update if backend says completed
      if (data.status === "completed" && data.result) {
        setStatus("completed")
        setProgress(100)
        updateJob(jobId, {
          status: "completed",
          percent: 100,
          result: data.result
        })
      }
    } catch (error) {
      console.error("Error polling job status:", error)
    }
  }

  const pollForResults = async () => {
    if (!jobId) return
    
    try {
      const response = await axios.get(`http://localhost:8000/api/mock/jobs/${jobId}`)
      const data = response.data
      
      if (data.status === "completed" && data.result) {
        updateJob(jobId, {
          status: "completed",
          percent: 100,
          result: data.result
        })
      }
    } catch (error) {
      console.error("Error fetching results:", error)
    }
  }

  const handleViewResults = () => {
    if (status === "completed" && jobId) {
      navigate(`/results/${jobId}`)
    }
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-card rounded-lg shadow-lg p-8 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Attack Simulation Progress</h1>
            {attackType && (
              <p className="text-lg text-muted">
                Running: <span className="text-accent font-semibold">{attackType}</span>
              </p>
            )}
            <p className="text-sm text-muted">Job ID: {jobId}</p>
          </div>

          <div className="space-y-4">
            <ProgressBar percent={progress} stage={message} />
            
            <div className="flex items-center justify-center space-x-3 mt-6">
              <div className={`w-3 h-3 rounded-full ${
                status === "running" ? "bg-yellow-500 animate-pulse" : 
                status === "completed" ? "bg-green-500" : 
                status === "failed" ? "bg-red-500" : "bg-gray-500"
              }`} />
              <span className="text-sm font-medium capitalize">
                Status: <span className={`${
                  status === "completed" ? "text-green-500" : 
                  status === "running" ? "text-yellow-500" : 
                  status === "failed" ? "text-red-500" : "text-gray-500"
                }`}>{status}</span>
              </span>
            </div>
          </div>

          {status === "completed" && (
            <div className="mt-8 text-center">
              <button
                onClick={handleViewResults}
                className="px-8 py-3 bg-accent text-white rounded-lg font-semibold hover:bg-accent/90 transition-all transform hover:scale-105 shadow-lg"
              >
                View Results
              </button>
            </div>
          )}

          {status === "running" && (
            <div className="mt-6 text-center text-sm text-muted">
              <p>⏱️ Estimated time remaining: {Math.max(0, Math.ceil((100 - progress) * 3))} seconds</p>
              <p className="mt-2">Please wait while we process your attack simulation...</p>
            </div>
          )}

          {status === "failed" && (
            <div className="mt-6 p-4 bg-red-500/10 border border-red-500 rounded-lg">
              <p className="text-red-500 text-center font-semibold">
                ❌ Simulation failed. Please try again.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
