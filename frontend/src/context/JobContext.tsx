"use client"

import React, { createContext, useState, useCallback, type ReactNode } from "react"
import type { JobContextType, Job } from "../types"

export const JobContext = createContext<JobContextType | undefined>(undefined)

export const JobProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<Job[]>([])
  const [currentJob, setCurrentJob] = useState<Job | null>(null)

  // Initialize from localStorage
  React.useEffect(() => {
    const stored = localStorage.getItem("jobs")
    if (stored) {
      setJobs(JSON.parse(stored))
    }
  }, [])

  const addJob = useCallback((job: Job) => {
    setJobs((prev) => {
      const updated = [job, ...prev]
      localStorage.setItem("jobs", JSON.stringify(updated))
      return updated
    })
    setCurrentJob(job)
  }, [])

  const updateJob = useCallback(
    (jobId: string, updates: Partial<Job>) => {
      setJobs((prev) => {
        const updated = prev.map((j) => (j.jobId === jobId ? { ...j, ...updates } : j))
        localStorage.setItem("jobs", JSON.stringify(updated))
        return updated
      })
      if (currentJob?.jobId === jobId) {
        setCurrentJob((prev) => (prev ? { ...prev, ...updates } : null))
      }
    },
    [currentJob],
  )

  const getJobById = useCallback(
    (jobId: string) => {
      return jobs.find((j) => j.jobId === jobId)
    },
    [jobs],
  )

  return (
    <JobContext.Provider
      value={{
        jobs,
        currentJob,
        addJob,
        updateJob,
        setCurrentJob,
        getJobById,
      }}
    >
      {children}
    </JobContext.Provider>
  )
}

export const useJob = () => {
  const context = React.useContext(JobContext)
  if (!context) {
    throw new Error("useJob must be used within JobProvider")
  }
  return context
}
