"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { LogOut, Upload, Zap, Users, Shield, AlertTriangle, ArrowUp, GitBranch } from "lucide-react"
import { ThemeSwitcher } from "@/components/theme-provider"

const ATTACK_TYPES = [
  { id: "label-flip", name: "Label Flip", description: "Flip training data labels", icon: AlertTriangle },
  { id: "backdoor", name: "Backdoor", description: "Insert backdoor triggers", icon: Shield },
  { id: "sybil", name: "Sybil", description: "Create fake identities", icon: GitBranch },
  { id: "freeride", name: "Freeride", description: "Free-riding attack", icon: ArrowUp },
  { id: "scaling", name: "Scaling", description: "Scaling based attack", icon: AlertTriangle },
]

const CLIENT_NAMES = ["Client 1", "Client 2", "Client 3", "Client 4", "Client 5"]
const INTENSITY_VALUES = [0, 20, 90, 100]

export default function UploadPage() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [modelFile, setModelFile] = useState<File | null>(null)
  const [selectedAttack, setSelectedAttack] = useState<string | null>(null)
  const [maliciousCount, setMaliciousCount] = useState<number>(1)
  const [selectedClients, setSelectedClients] = useState<string[]>([])
  const [intensityIndex, setIntensityIndex] = useState<number>(0)
  const [isDemo, setIsDemo] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    if (!token) {
      router.push("/login")
    }
  }, [router])

  const toggleAttack = (id: string) => {
    if (selectedAttack === id) {
      setSelectedAttack(null)
      setSelectedClients([])
    } else {
      setSelectedAttack(id)
      setSelectedClients([])
      setMaliciousCount(1)
      setIntensityIndex(0)
    }
  }

  const toggleClient = (client: string) => {
    if (selectedClients.includes(client)) {
      setSelectedClients(selectedClients.filter((c) => c !== client))
    } else {
      if (selectedClients.length < maliciousCount) {
        setSelectedClients([...selectedClients, client])
      }
    }
  }

  const handleLogout = () => {
    if (typeof window !== "undefined") localStorage.removeItem("token")
    router.push("/login")
  }

  const handleStartSimulation = async () => {
    setIsLoading(true)
    const payload = {
      attackType: selectedAttack,
      attackerClients: selectedClients.map((c) => CLIENT_NAMES.indexOf(c) + 1),
      maliciousClientCount: maliciousCount,
      intensityIndex,
      intensityValue: INTENSITY_VALUES[intensityIndex],
      modelFileName: modelFile?.name || null,
      demo: isDemo,
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.detail || "Job creation failed")

      localStorage.setItem("currentJobId", json.jobId)
      localStorage.setItem("currentAttackType", selectedAttack || "")
      router.push("/progress")
    } catch (err: any) {
      alert("Failed to start simulation: " + (err?.message || err))
      setIsLoading(false)
    }
  }

  if (!isClient) return null

  const attackSelected = !!selectedAttack

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-2">
              FedLearn Attack Simulator
            </h1>
            <p className="text-muted-foreground text-lg">Configure and run federated learning attack simulations</p>
          </div>
          <div className="flex items-center gap-3">
            <ThemeSwitcher />
            <Button
              onClick={handleLogout}
              variant="outline"
              className="gap-2 bg-transparent text-foreground border-border hover:bg-primary/10"
            >
              <LogOut className="w-4 h-4" /> Logout
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT SECTION */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border border-border/60 bg-card/50 backdrop-blur-sm hover:border-primary/40 transition-all duration-300 shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Upload className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-foreground">Upload Model</CardTitle>
                    <CardDescription>Upload your ML model file for simulation</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-border/50 rounded-xl p-8 text-center hover:border-primary/60 hover:bg-primary/5 transition-all cursor-pointer">
                  <input
                    type="file"
                    id="model"
                    className="hidden"
                    onChange={(e) => setModelFile(e.target.files?.[0] || null)}
                  />
                  <label htmlFor="model" className="cursor-pointer block">
                    <Upload className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-foreground font-medium">Drop file here or click to browse</p>
                    <p className="text-xs text-muted-foreground mt-1">Supported: .json, .txt, .xml</p>
                  </label>
                  {modelFile && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-xs text-green-700 font-medium flex items-center gap-2 justify-center">
                      <span>✓</span> {modelFile.name}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/20 rounded-lg hover:bg-primary/10 transition-all">
                  <Checkbox
                    checked={isDemo}
                    onCheckedChange={(checked) => setIsDemo(checked as boolean)}
                    className="w-5 h-5"
                  />
                  <label className="text-sm font-medium text-foreground cursor-pointer">
                    Use Demo Mode (mock data)
                  </label>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border/60 bg-card/50 backdrop-blur-sm hover:border-primary/40 transition-all duration-300 shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <Zap className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <CardTitle className="text-foreground">Select Attack Type</CardTitle>
                    <CardDescription>Choose one attack to simulate</CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {ATTACK_TYPES.map((atk) => {
                    const Icon = atk.icon
                    const active = selectedAttack === atk.id
                    return (
                      <button
                        key={atk.id}
                        onClick={() => toggleAttack(atk.id)}
                        className={`p-4 rounded-lg border-2 transition-all text-left group ${
                          active
                            ? "bg-primary/15 border-primary shadow-md shadow-primary/20"
                            : "bg-background border-border/50 hover:border-primary/40 hover:bg-primary/5"
                        }`}
                      >
                        <Icon className="w-6 h-6 mb-2 text-primary group-hover:scale-110 transition-transform" />
                        <p className="text-foreground font-semibold text-sm">{atk.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">{atk.description}</p>
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT SECTION */}
          <Card className="border border-border/60 bg-card/50 backdrop-blur-sm h-fit shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary/10 rounded-lg">
                  <Users className="w-5 h-5 text-secondary" />
                </div>
                <CardTitle className="text-foreground">Configuration</CardTitle>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Malicious Client Count */}
              <div>
                <p className="text-sm font-semibold text-foreground mb-3">Malicious Clients</p>
                <div className={`flex gap-3 ${!attackSelected ? "opacity-50 pointer-events-none" : ""}`}>
                  {[1, 2].map((val) => (
                    <Button
                      key={val}
                      disabled={!attackSelected}
                      onClick={() => {
                        if (!attackSelected) return
                        setMaliciousCount(val)
                        setSelectedClients([])
                      }}
                      className={`flex-1 transition-all font-medium ${
                        maliciousCount === val
                          ? "bg-gradient-to-r from-primary to-accent text-white hover:shadow-lg hover:shadow-primary/20"
                          : "bg-background border border-border/50 text-foreground hover:border-primary/40"
                      }`}
                      variant={maliciousCount === val ? "default" : "outline"}
                    >
                      {val}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-foreground mb-3">
                  Select Clients{" "}
                  <span className="text-primary">
                    ({selectedClients.length}/{maliciousCount})
                  </span>
                </p>
                <div className={`space-y-2 ${!attackSelected ? "opacity-50 pointer-events-none" : ""}`}>
                  {CLIENT_NAMES.map((client) => {
                    const selected = selectedClients.includes(client)
                    const atLimit = !selected && selectedClients.length >= maliciousCount
                    return (
                      <div
                        key={client}
                        className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                          selected
                            ? "bg-primary/10 border-primary/40 hover:bg-primary/15"
                            : "bg-background border-border/50 hover:border-primary/40"
                        } ${atLimit ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                      >
                        <Checkbox
                          checked={selected}
                          disabled={!attackSelected || atLimit}
                          onCheckedChange={(checked) => {
                            if (!attackSelected || atLimit) return
                            if (checked) {
                              setSelectedClients([...selectedClients, client])
                            } else {
                              setSelectedClients(selectedClients.filter((c) => c !== client))
                            }
                          }}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-foreground font-medium">{client}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Intensity Slider */}
              {selectedAttack === "label-flip" && (
                <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
                  <p className="text-sm font-semibold text-foreground mb-4">
                    Attack Intensity:{" "}
                    <span className="text-accent font-bold text-lg">{INTENSITY_VALUES[intensityIndex]}%</span>
                  </p>
                  <Slider
                    value={[intensityIndex]}
                    onValueChange={(v) => setIntensityIndex(v[0] || 0)}
                    min={0}
                    max={3}
                    step={1}
                    className="mb-3"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground font-medium">
                    <span>0%</span>
                    <span>20%</span>
                    <span>90%</span>
                    <span>100%</span>
                  </div>
                </div>
              )}

              {/* Start Button */}
              <Button
                onClick={handleStartSimulation}
                disabled={!attackSelected || selectedClients.length !== maliciousCount || !modelFile || isLoading}
                className="w-full bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/20 text-white font-semibold py-6 disabled:opacity-60 transition-all duration-300"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Starting...
                  </>
                ) : (
                  "Start Simulation"
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
