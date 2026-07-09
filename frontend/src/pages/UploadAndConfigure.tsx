import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useJob } from "../context/JobContext"
import { AttackControls } from "../components/AttackControls"
import { FileUploader } from "../components/FileUploader"
import axios from "axios"

export const UploadAndConfigure: React.FC = () => {
  const navigate = useNavigate()
  const { addJob } = useJob()
  const [attackType, setAttackType] = useState<string>("label-flip")
  const [maliciousClientCount, setMaliciousClientCount] = useState(2)
  const [intensityIndex, setIntensityIndex] = useState(50)
  const [attackerClients, setAttackerClients] = useState<number[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    try {
      // Call mock backend
      const response = await axios.post("http://localhost:8000/api/mock/jobs", {
        attackType,
        attackerClients,
        maliciousClientCount,
        intensityIndex,
        demo: true
      })

      const jobId = response.data.jobId

      // Add to context
      addJob({
        jobId,
        userId: "demo-user",
        attackType,
        intensityPercent: intensityIndex,
        numClients: 10,
        status: "running",
        percent: 0,
        createdAt: new Date().toISOString()
      })

      // Navigate to progress page
      navigate(`/progress/${jobId}`)
    } catch (error) {
      console.error("Error starting simulation:", error)
      alert("Failed to start simulation. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Configure Attack Simulation
          </h1>
          <p className="text-muted">Set up your federated learning attack test</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* File Upload Section */}
          <div className="bg-card rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-foreground mb-4">Upload Files</h2>
            <FileUploader />
          </div>

          {/* Attack Configuration */}
          <div className="bg-card rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-foreground mb-4">Attack Configuration</h2>
            
            <div className="space-y-6">
              {/* Attack Type */}
              <div>
                <label className="block text-sm font-medium mb-2">Attack Type</label>
                <select
                  value={attackType}
                  onChange={(e) => setAttackType(e.target.value)}
                  className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-accent"
                >
                  <option value="label-flip">Label Flip Attack</option>
                  <option value="scaling">Scaling Attack</option>
                  <option value="sybil">Sybil Attack</option>
                  <option value="freeride">Free-Ride Attack</option>
                  <option value="backdoor">Backdoor Attack</option>
                </select>
              </div>

              {/* Malicious Client Count */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Malicious Clients: {maliciousClientCount}
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={maliciousClientCount}
                  onChange={(e) => setMaliciousClientCount(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Intensity */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Attack Intensity: {intensityIndex}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={intensityIndex}
                  onChange={(e) => setIntensityIndex(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Client Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Select Attacker Clients (optional)
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((clientId) => (
                    <button
                      key={clientId}
                      type="button"
                      onClick={() => {
                        setAttackerClients(prev =>
                          prev.includes(clientId)
                            ? prev.filter(id => id !== clientId)
                            : [...prev, clientId]
                        )
                      }}
                      className={`p-2 rounded text-sm font-medium transition-colors ${
                        attackerClients.includes(clientId)
                          ? "bg-red-500 text-white"
                          : "bg-background border border-border hover:bg-accent/10"
                      }`}
                    >
                      {clientId}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-12 py-4 bg-accent text-white rounded-lg font-bold text-lg hover:bg-accent/90 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Starting Simulation..." : "Start Attack Simulation"}
          </button>
        </div>
      </div>
    </div>
  )
}
