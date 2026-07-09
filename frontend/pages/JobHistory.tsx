"use client"

import type React from "react"
import { useNavigate } from "react-router-dom"
import { useJob } from "../context/JobContext"

export const JobHistory: React.FC = () => {
  const navigate = useNavigate()
  const { jobs } = useJob()

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-accent">Job History</h1>
            <p className="text-muted mt-2">Previous simulations and results</p>
          </div>
          <button onClick={() => navigate("/upload")} className="btn-primary">
            New Simulation
          </button>
        </div>

        {jobs.length === 0 ? (
          <div className="card text-center space-y-4 py-12">
            <p className="text-lg text-muted">No jobs yet</p>
            <p className="text-sm text-muted">Create a new simulation to get started</p>
            <button onClick={() => navigate("/upload")} className="btn-primary inline-block">
              Start Simulation
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => (
              <div
                key={job.jobId}
                className="card cursor-pointer hover:bg-opacity-80 transition"
                onClick={() => (job.result ? navigate(`/results/${job.jobId}`) : null)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-accent">{job.attackType}</h3>
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded ${
                          job.status === "completed"
                            ? "bg-success bg-opacity-20 text-success"
                            : job.status === "running"
                              ? "bg-primary bg-opacity-20 text-primary"
                              : "bg-destructive bg-opacity-20 text-destructive"
                        }`}
                      >
                        {job.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted">
                      Intensity: {job.intensityPercent}% • Clients: {job.numClients} •{" "}
                      {new Date(job.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-accent">{job.percent}%</p>
                    {job.result && (
                      <p
                        className={`text-xs font-medium ${
                          job.result.verdict?.label === "Safe"
                            ? "text-success"
                            : job.result.verdict?.label === "Warning"
                              ? "text-warning"
                              : "text-destructive"
                        }`}
                      >
                        {job.result.verdict?.label}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
