"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useJob } from "../context/JobContext"
import { FileUploader } from "../components/FileUploader"
import { AttackControls } from "../components/AttackControls"
import { ClientsSelector } from "../components/ClientsSelector"
import { mockSimulator } from "../services/mockSimulator"
import type { SimulateRequest, ProgressMessage, Job } from "../types"
import { v4 as uuid } from "uuid"

export const UploadAndConfigure: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addJob } = useJob()

  const [modelFiles, setModelFiles] = useState<File[]>([])
  const [attackFiles, setAttackFiles] = useState<File[]>([])
  const [attackType, setAttackType] = useState("Label Flip")
  const [numClients, setNumClients] = useState(5)
  const [intensityPercent, setIntensityPercent] = useState(50)
  const [selectedClients, setSelectedClients] = useState(Array.from({ length: 5 }, (_, i) => i + 1))
  const [useDemo, setUseDemo] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSimulate = async () => {
    setError("")
    setIsLoading(true)

    try {
      if (!useDemo && (modelFiles.length === 0 || attackFiles.length === 0)) {
        throw new Error("Please upload files or select demo mode")
      }

      if (!attackType) {
        throw new Error("Please select an attack type")
      }

      const jobId = uuid()
      const request: SimulateRequest = {
        modelFiles: useDemo ? [{ name: "demo_model.pkl" }] : modelFiles.map((f) => ({ name: f.name })),
        attackFiles: useDemo ? [{ name: "demo_attack.py" }] : attackFiles.map((f) => ({ name: f.name })),
        attackType: attackType as any,
        intensityPercent,
        numClients,
        clients: selectedClients,
        userId: user?.id,
      }

      // Create job
      const job: Job = {
        jobId,
        userId: user?.id || "unknown",
        attackType,
        intensityPercent,
        numClients,
        status: "running",
        percent: 0,
        createdAt: new Date().toISOString(),
      }

      addJob(job)
      navigate(`/progress/${jobId}`)

      // Start simulation
      const logs: string[] = []
      await mockSimulator
        .simulate(request, (msg: ProgressMessage) => {
          logs.push(`[${msg.stage}] ${msg.message}`)
        })
        .then((result) => {
          // Will be handled by progress page fetching
        })
    } catch (err: any) {
      setError(err.message)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-accent">Upload & Configure</h1>
          <p className="text-muted">Set up your federated learning attack simulation</p>
        </div>

        {error && (
          <div className="bg-destructive bg-opacity-20 border border-destructive text-destructive p-4 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {!useDemo && (
              <>
                <div className="card space-y-4">
                  <h2 className="text-xl font-bold">Model & Attack Files</h2>
                  <FileUploader label="Upload FL Model(s)" onFilesSelected={setModelFiles} accept=".pkl,.pt,.pth,.h5" />
                  <FileUploader label="Upload Attack Script(s)" onFilesSelected={setAttackFiles} accept=".py,.txt" />
                </div>
              </>
            )}

            {useDemo && (
              <div className="card bg-success bg-opacity-20 border border-success p-4 rounded-lg">
                <p className="text-success font-medium">✓ Demo files selected</p>
                <p className="text-sm text-muted mt-1">Using pre-configured demo model and attack script</p>
              </div>
            )}
          </div>

          <div className="card space-y-6 h-fit sticky top-6">
            <div>
              <h2 className="text-xl font-bold mb-4">Configuration</h2>
              <AttackControls
                attackType={attackType}
                onAttackTypeChange={setAttackType}
                intensityPercent={intensityPercent}
                onIntensityChange={setIntensityPercent}
                numClients={numClients}
                onNumClientsChange={(n) => {
                  setNumClients(n)
                  setSelectedClients(Array.from({ length: n }, (_, i) => i + 1))
                }}
                useDemo={useDemo}
                onUseDemoChange={setUseDemo}
              />
            </div>

            {numClients > 1 && (
              <div>
                <div className="divider mb-4" />
                <ClientsSelector
                  numClients={numClients}
                  selectedClients={selectedClients}
                  onClientsChange={setSelectedClients}
                />
              </div>
            )}

            <div className="divider" />

            <button
              onClick={handleSimulate}
              disabled={isLoading || !attackType}
              className={`btn-primary w-full ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              aria-label="Start simulation"
            >
              {isLoading ? "Starting..." : "Start Simulation"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
