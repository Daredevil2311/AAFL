"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useJob } from "../context/JobContext"
import { ProgressBar } from "../components/ProgressBar"
import { LogConsole } from "../components/LogConsole"
import { mockSimulator } from "../services/mockSimulator"
import type { ProgressMessage, SimulateRequest } from "../types"

export const ProgressView: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>()
  const navigate = useNavigate()
  const { currentJob, updateJob, getJobById } = useJob()

  const [logs, setLogs] = useState<string[]>([])
  const [stage, setStage] = useState("preprocessing")
  const [isCancelled, setIsCancelled] = useState(false)

  const job = jobId ? getJobById(jobId) : null

  useEffect(() => {
    if (!job) {
      navigate("/upload")
      return
    }

    if (job.status === "completed") {
      navigate(`/results/${jobId}`)
      return
    }

    // Start simulation if not already running
    let isSubscribed = true

    const runSimulation = async () => {
      try {
        const request: SimulateRequest = {
          modelFiles: [{ name: "model.pkl" }],
          attackFiles: [{ name: "attack.py" }],
          attackType: job.attackType as any,
          intensityPercent: job.percent || 50,
          numClients: job.numClients,
          userId: job.userId,
        }

        await mockSimulator
          .simulate(request, (msg: ProgressMessage) => {
            if (!isSubscribed) return

            setStage(msg.stage)
            setLogs((prev) => [...prev.slice(-199), `${new Date(msg.timestamp).toLocaleTimeString()} - ${msg.message}`])
            updateJob(jobId!, { percent: msg.percent })
          })
          .then((result) => {
            if (isSubscribed) {
              updateJob(jobId!, { status: "completed", result })
              navigate(`/results/${jobId}`)
            }
          })
      } catch (err: any) {
        if (isSubscribed && err.message !== "Job cancelled") {
          console.error("Simulation error:", err)
        }
      }
    }

    runSimulation()

    return () => {
      isSubscribed = false
    }
  }, [job, jobId, navigate, updateJob])

  const handleCancel = () => {
    if (jobId) {
      mockSimulator.cancel(jobId)
      updateJob(jobId, { status: "cancelled" })
      setIsCancelled(true)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-accent">Simulation In Progress</h1>
          <p className="text-muted mt-2">
            Job ID: <span className="font-mono text-sm">{jobId}</span>
          </p>
        </div>

        {job && (
          <div className="card space-y-4">
            <ProgressBar percent={job.percent} stage={stage} />
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted">Attack Type</p>
                <p className="font-semibold text-accent">{job.attackType}</p>
              </div>
              <div>
                <p className="text-muted">Intensity</p>
                <p className="font-semibold text-accent">{job.intensityPercent}%</p>
              </div>
              <div>
                <p className="text-muted">Clients</p>
                <p className="font-semibold text-accent">{job.numClients}</p>
              </div>
              <div>
                <p className="text-muted">Started</p>
                <p className="font-semibold text-accent">{new Date(job.createdAt).toLocaleTimeString()}</p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <h2 className="text-xl font-bold">Live Logs</h2>
          <LogConsole logs={logs} />
        </div>

        <div className="flex gap-4">
          {!isCancelled ? (
            <button onClick={handleCancel} className="btn-danger" aria-label="Cancel simulation">
              Cancel Simulation
            </button>
          ) : (
            <div className="bg-destructive bg-opacity-20 text-destructive p-4 rounded-lg flex-1">
              <p className="font-medium">Simulation cancelled</p>
              <p className="text-sm mt-1">You can start a new simulation or review previous results</p>
            </div>
          )}

          {isCancelled && (
            <button onClick={() => navigate("/upload")} className="btn-primary" aria-label="Return to upload page">
              Return to Upload
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
