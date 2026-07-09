"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"

export default function HistoryPage() {
  const router = useRouter()
  const [history, setHistory] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [selectedId, setSelectedId] = useState<number | null>(null)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }
    setUser(JSON.parse(userData))

    const mockHistory = [
      {
        id: 1,
        type: "backdoor",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        duration: "5m 23s",
        results: { vulnerabilitiesFound: 5, threatsDetected: 3, riskScore: 72 },
        status: "completed",
      },
      {
        id: 2,
        type: "freeride",
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        duration: "4m 58s",
        results: { vulnerabilitiesFound: 3, threatsDetected: 2, riskScore: 45 },
        status: "completed",
      },
      {
        id: 3,
        type: "backdoor",
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        duration: "6m 12s",
        results: { vulnerabilitiesFound: 8, threatsDetected: 4, riskScore: 85 },
        status: "completed",
      },
    ]
    setHistory(mockHistory)
  }, [router])

  const getRiskBadge = (score: number) => {
    if (score > 70) return <Badge className="bg-red-500/30 text-red-700 border border-red-500/50">Critical</Badge>
    if (score > 40)
      return <Badge className="bg-yellow-500/30 text-yellow-700 border border-yellow-500/50">Medium</Badge>
    return <Badge className="bg-green-500/30 text-green-700 border border-green-500/50">Low</Badge>
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString()
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-start md:items-center mb-8 gap-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-1">Simulation History</h1>
            <p className="text-muted-foreground">Previous attack simulations</p>
          </div>
          <Button variant="outline" onClick={() => router.push("/upload")} className="gap-2">
            New Simulation <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {history.length > 0 && (
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card className="border border-border bg-card p-4">
              <p className="text-xs text-muted-foreground mb-1 font-semibold">Total</p>
              <p className="text-3xl font-bold text-primary">{history.length}</p>
            </Card>
            <Card className="border border-border bg-card p-4">
              <p className="text-xs text-muted-foreground mb-1 font-semibold">Avg Risk</p>
              <p className="text-3xl font-bold text-foreground">
                {Math.round(history.reduce((acc, h) => acc + h.results.riskScore, 0) / history.length)}
              </p>
            </Card>
            <Card className="border border-border bg-card p-4">
              <p className="text-xs text-muted-foreground mb-1 font-semibold">Total Threats</p>
              <p className="text-3xl font-bold text-foreground">
                {history.reduce((acc, h) => acc + h.results.threatsDetected, 0)}
              </p>
            </Card>
            <Card className="border border-border bg-card p-4">
              <p className="text-xs text-muted-foreground mb-1 font-semibold">Vulnerabilities</p>
              <p className="text-3xl font-bold text-foreground">
                {history.reduce((acc, h) => acc + h.results.vulnerabilitiesFound, 0)}
              </p>
            </Card>
          </div>
        )}

        {history.length > 0 ? (
          <div className="space-y-4">
            {history.map((item, index) => (
              <Card
                key={item.id}
                onClick={() => setSelectedId(selectedId === item.id ? null : item.id)}
                className={`border transition-all cursor-pointer overflow-hidden ${
                  selectedId === item.id ? "border-primary bg-card/80" : "border-border hover:border-primary/40 bg-card"
                }`}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground capitalize">
                          {item.type.replace("-", " ")} Attack
                        </h3>
                        <p className="text-sm text-muted-foreground">{formatTime(item.timestamp)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-8 pr-4">
                      <div className="text-right hidden sm:block">
                        <p className="text-xs text-muted-foreground mb-1 font-semibold">Vulnerabilities</p>
                        <p className="text-2xl font-bold text-foreground">{item.results.vulnerabilitiesFound}</p>
                      </div>
                      <div className="text-right hidden sm:block">
                        <p className="text-xs text-muted-foreground mb-1 font-semibold">Threats</p>
                        <p className="text-2xl font-bold text-foreground">{item.results.threatsDetected}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground mb-1 font-semibold">Risk</p>
                        <p className="text-2xl font-bold text-foreground">{item.results.riskScore}</p>
                      </div>
                      <div>{getRiskBadge(item.results.riskScore)}</div>
                    </div>
                  </div>

                  <div className="w-full bg-background rounded-full h-1 overflow-hidden mt-4">
                    <div
                      className="h-full bg-primary transition-all duration-500"
                      style={{ width: `${item.results.riskScore}%` }}
                    ></div>
                  </div>

                  {selectedId === item.id && (
                    <div className="mt-6 pt-6 border-t border-border space-y-3">
                      <div className="grid md:grid-cols-3 gap-3">
                        <div className="p-3 bg-background rounded-lg border border-border">
                          <p className="text-xs text-muted-foreground mb-1">Duration</p>
                          <p className="text-foreground font-semibold text-sm">{item.duration}</p>
                        </div>
                        <div className="p-3 bg-background rounded-lg border border-border">
                          <p className="text-xs text-muted-foreground mb-1">Status</p>
                          <Badge className="bg-green-500/20 text-green-700 text-xs">✓ Completed</Badge>
                        </div>
                        <div className="p-3 bg-background rounded-lg border border-border">
                          <p className="text-xs text-muted-foreground mb-1">Total Issues</p>
                          <p className="text-foreground font-semibold text-sm">
                            {item.results.vulnerabilitiesFound + item.results.threatsDetected}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border border-border bg-card p-12 text-center">
            <p className="text-2xl font-semibold text-foreground mb-2">No simulations yet</p>
            <p className="text-muted-foreground mb-6">Start by running your first attack simulation</p>
            <Button onClick={() => router.push("/upload")} className="bg-primary hover:bg-primary/90 text-white">
              Start Simulation
            </Button>
          </Card>
        )}
      </div>
    </div>
  )
}
