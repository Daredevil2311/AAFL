"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCircle2 } from "lucide-react"

export default function ProgressPage() {
  const router = useRouter()
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [attackType, setAttackType] = useState<string>("")

  useEffect(() => {
    const currentAttackType = localStorage.getItem("currentAttackType")
    if (!currentAttackType) {
      router.push("/upload")
      return
    }
    setAttackType(currentAttackType)

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval)
          return 95
        }
        return prev + Math.random() * 15
      })
    }, 500)

    const completeTimer = setTimeout(() => {
      setProgress(100)
      setIsComplete(true)
      localStorage.setItem(
        "lastAttack",
        JSON.stringify({
          type: currentAttackType,
          timestamp: new Date().toISOString(),
          results: {
            riskScore: Math.floor(Math.random() * 100),
            vulnerabilitiesFound: Math.floor(Math.random() * 10),
            threatsDetected: Math.floor(Math.random() * 5),
          },
        }),
      )
    }, 6000)

    return () => {
      clearInterval(interval)
      clearTimeout(completeTimer)
    }
  }, [router])

  const handleViewResults = () => {
    router.push("/results")
  }

  const handleCancel = () => {
    localStorage.removeItem("currentJobId")
    localStorage.removeItem("currentAttackType")
    router.push("/upload")
  }

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <div className="max-w-2xl mx-auto">
        {!isComplete && (
          <Button onClick={handleCancel} variant="outline" className="mb-8 gap-2 bg-transparent">
            <ArrowLeft className="w-4 h-4" /> Cancel
          </Button>
        )}

        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Simulation in Progress</h1>
          <p className="text-muted-foreground">
            Running <span className="text-primary font-semibold capitalize">{attackType.replace("-", " ")}</span>
          </p>
        </div>

        <Card className="border border-border bg-card p-8 md:p-10 mt-10">
          <div className="space-y-8">
            <div>
              <div className="flex justify-between items-center mb-3">
                <p className="text-sm font-semibold text-foreground">Progress</p>
                <p className="text-lg font-bold text-primary">{Math.round(progress)}%</p>
              </div>
              <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                <div className="h-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }}></div>
              </div>
            </div>

            <div className="space-y-3">
              <StatusItem label="Initializing attack..." done={progress > 10} />
              <StatusItem label="Processing simulation..." done={progress > 40} />
              <StatusItem label="Analyzing results..." done={progress > 70} />
              <StatusItem label="Preparing results..." done={progress > 90} />
            </div>

            {isComplete && (
              <div className="p-4 bg-green-50 border border-green-200 rounded text-sm font-semibold text-green-700">
                ✓ Simulation completed
              </div>
            )}

            {isComplete && (
              <Button
                onClick={handleViewResults}
                className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-6 text-base"
              >
                View Results
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}

function StatusItem({ label, done }: { label: string; done: boolean }) {
  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
        done ? "bg-primary/8 border border-primary/20" : "bg-border/10 border border-border/20"
      }`}
    >
      {done ? (
        <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
      ) : (
        <div className="w-4 h-4 border-2 border-muted-foreground/30 border-t-muted-foreground rounded-full animate-spin flex-shrink-0" />
      )}
      <p className={`text-sm font-medium ${done ? "text-foreground" : "text-muted-foreground"}`}>{label}</p>
    </div>
  )
}
