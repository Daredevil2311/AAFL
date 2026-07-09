import React from "react"
import { useNavigate } from "react-router-dom"
import { useJob } from "../context/JobContext"

export const JobHistory: React.FC = () => {
  const navigate = useNavigate()
  const { jobs } = useJob()

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">Job History</h1>
          <p className="text-muted">View all your past attack simulations</p>
        </div>

        {jobs.length === 0 ? (
          <div className="bg-card rounded-lg shadow-lg p-12 text-center">
            <p className="text-muted text-lg">No jobs yet. Start your first simulation!</p>
            <button
              onClick={() => navigate("/upload")}
              className="mt-6 px-6 py-3 bg-accent text-white rounded-lg font-semibold hover:bg-accent/90"
            >
              Start New Simulation
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div
                key={job.jobId}
                className="bg-card rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => {
                  if (job.status === "completed") {
                    navigate(`/results/${job.jobId}`)
                  } else {
                    navigate(`/progress/${job.jobId}`)
                  }
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      {job.attackType}
                    </h3>
                    <p className="text-sm text-muted">Job ID: {job.jobId}</p>
                    <p className="text-sm text-muted">
                      Created: {new Date(job.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm text-muted">Progress</p>
                      <p className="text-2xl font-bold text-accent">{job.percent}%</p>
                    </div>

                    <div className={`px-4 py-2 rounded-full font-semibold ${
                      job.status === "completed" ? "bg-green-500/20 text-green-500" :
                      job.status === "running" ? "bg-yellow-500/20 text-yellow-500" :
                      "bg-gray-500/20 text-gray-500"
                    }`}>
                      {job.status}
                    </div>
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
