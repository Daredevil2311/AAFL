"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, ArrowLeft, AlertTriangle, CheckCircle2, AlertCircle } from "lucide-react"

export default function ResultsPage() {
  const router = useRouter()
  const [results, setResults] = useState<any>(null)
  const [isExporting, setIsExporting] = useState(false)

  useEffect(() => {
    const lastAttack = localStorage.getItem("lastAttack")
    if (!lastAttack) {
      router.push("/upload")
    } else {
      setResults(JSON.parse(lastAttack))
    }
  }, [router])

  if (!results) return null

  const riskLevel = results.results.riskScore > 70 ? "critical" : results.results.riskScore > 40 ? "medium" : "low"
  const riskColors = {
    critical: "bg-red-50 border-red-200 text-red-700",
    medium: "bg-yellow-50 border-yellow-200 text-yellow-700",
    low: "bg-green-50 border-green-200 text-green-700",
  }

  const riskIcons = {
    critical: AlertTriangle,
    medium: AlertCircle,
    low: CheckCircle2,
  }

  const RiskIcon = riskIcons[riskLevel]

  const exportResults = async (format: "csv" | "json") => {
    setIsExporting(true)
    await new Promise((resolve) => setTimeout(resolve, 600))

    if (format === "json") {
      const blob = new Blob([JSON.stringify(results, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${results.type}_results.json`
      a.click()
    } else {
      const csv = `Metric,Value\nAttack Type,${results.type}\nRisk Score,${results.results.riskScore}\nVulnerabilities,${results.results.vulnerabilitiesFound}\nThreats,${results.results.threatsDetected}\nTimestamp,${results.timestamp}`
      const blob = new Blob([csv], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${results.type}_results.csv`
      a.click()
    }

    setIsExporting(false)
  }

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Button
          onClick={() => router.push("/upload")}
          variant="outline"
          className="mb-8 gap-2 bg-transparent border-border/60 hover:bg-primary/10 text-foreground"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Button>

        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
            Simulation Results
          </h1>
          <p className="text-muted-foreground text-sm">
            <span className="text-primary font-semibold capitalize">{results.type.replace("-", " ")}</span>
            <span className="text-muted-foreground/50 mx-2">•</span>
            <span>{new Date(results.timestamp).toLocaleString()}</span>
          </p>
        </div>

        <Card className={`border-2 ${riskColors[riskLevel]} p-10 mb-10 overflow-hidden group shadow-md`}>
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground/80 mb-3 uppercase tracking-widest">
                Overall Risk Assessment
              </p>
              <p className="text-6xl font-bold text-foreground">
                {results.results.riskScore}
                <span className="text-3xl text-muted-foreground/60">/100</span>
              </p>
            </div>
            <div className="text-right">
              <RiskIcon className="w-12 h-12 mb-3 text-foreground" />
              <Badge
                className={`${
                  riskLevel === "critical"
                    ? "bg-red-500 text-white"
                    : riskLevel === "medium"
                      ? "bg-yellow-500 text-white"
                      : "bg-green-500 text-white"
                } px-4 py-2 text-sm font-semibold border-0`}
              >
                {riskLevel.toUpperCase()}
              </Badge>
            </div>
          </div>
        </Card>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <Card className="border border-primary/30 bg-primary/5 p-8 hover:border-primary/60 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase">Vulnerabilities Found</p>
                <p className="text-5xl font-bold text-primary">{results.results.vulnerabilitiesFound}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground/70 mb-4">Security gaps that were exploited</p>
            <div className="h-2 bg-primary/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-accent"
                style={{ width: `${(results.results.vulnerabilitiesFound / 10) * 100}%` }}
              ></div>
            </div>
          </Card>

          <Card className="border border-accent/30 bg-accent/5 p-8 hover:border-accent/60 hover:shadow-lg hover:shadow-accent/20 transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase">Threats Detected</p>
                <p className="text-5xl font-bold text-accent">{results.results.threatsDetected}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground/70 mb-4">Potential attack vectors identified</p>
            <div className="h-2 bg-accent/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-accent to-primary"
                style={{ width: `${(results.results.threatsDetected / 5) * 100}%` }}
              ></div>
            </div>
          </Card>
        </div>

        <Card className="border border-border/60 bg-card/50 p-8 mb-10 shadow-sm">
          <h3 className="text-lg font-semibold text-foreground mb-6">Analysis Details</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-primary/8 border border-primary/20 rounded-lg hover:border-primary/40 transition-all">
              <p className="text-xs text-muted-foreground mb-2 font-semibold uppercase">Attack Vector</p>
              <p className="text-foreground font-semibold capitalize">{results.type.replace("-", " ")}</p>
            </div>
            <div className="p-4 bg-secondary/8 border border-secondary/20 rounded-lg hover:border-secondary/40 transition-all">
              <p className="text-xs text-muted-foreground mb-2 font-semibold uppercase">Timestamp</p>
              <p className="text-foreground font-semibold">{new Date(results.timestamp).toLocaleTimeString()}</p>
            </div>
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg hover:border-green-400 transition-all">
              <p className="text-xs text-muted-foreground mb-2 font-semibold uppercase">Status</p>
              <p className="text-green-600 font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Completed
              </p>
            </div>
          </div>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 justify-between mb-8">
          <div className="flex gap-3">
            <Button
              onClick={() => exportResults("json")}
              disabled={isExporting}
              variant="outline"
              className="gap-2 bg-transparent border-border/60 hover:bg-primary/10"
            >
              <Download className="w-4 h-4" /> JSON
            </Button>
            <Button
              onClick={() => exportResults("csv")}
              disabled={isExporting}
              variant="outline"
              className="gap-2 bg-transparent border-border/60 hover:bg-accent/10"
            >
              <Download className="w-4 h-4" /> CSV
            </Button>
          </div>
          <Button
            onClick={() => router.push("/upload")}
            className="bg-gradient-to-r from-primary to-accent text-white font-semibold hover:shadow-lg hover:shadow-primary/20 transition-all"
          >
            Run Another Simulation
          </Button>
        </div>
      </div>
    </div>
  )
}
