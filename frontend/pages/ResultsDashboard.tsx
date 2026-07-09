"use client"

import type React from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useJob } from "../context/JobContext"
import { MetricCard } from "../components/MetricCard"
import { VerdictBox } from "../components/VerdictBox"
import { ChartPanel } from "../components/ChartPanel"

export const ResultsDashboard: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>()
  const navigate = useNavigate()
  const { getJobById } = useJob()

  const job = jobId ? getJobById(jobId) : null
  const result = job?.result

  if (!result) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-xl text-muted">Results not found</p>
          <button onClick={() => navigate("/upload")} className="btn-primary">
            Return to Upload
          </button>
        </div>
      </div>
    )
  }

  const baselineF1 = result.metrics.baselineGlobal.f1
  const attackedF1 = result.metrics.attackedGlobal.f1
  const f1Drop = baselineF1 - attackedF1
  const f1DropPercent = (f1Drop / baselineF1) * 100

  const downloadCSV = () => {
    const csv = [
      ["Metric", "Baseline", "Attacked", "Drop"],
      ["F1", baselineF1.toFixed(4), attackedF1.toFixed(4), f1Drop.toFixed(4)],
      [
        "Precision",
        result.metrics.baselineGlobal.precision.toFixed(4),
        result.metrics.attackedGlobal.precision.toFixed(4),
        (result.metrics.baselineGlobal.precision - result.metrics.attackedGlobal.precision).toFixed(4),
      ],
      [
        "Recall",
        result.metrics.baselineGlobal.recall.toFixed(4),
        result.metrics.attackedGlobal.recall.toFixed(4),
        (result.metrics.baselineGlobal.recall - result.metrics.attackedGlobal.recall).toFixed(4),
      ],
      [
        "Accuracy",
        result.metrics.baselineGlobal.accuracy.toFixed(4),
        result.metrics.attackedGlobal.accuracy.toFixed(4),
        (result.metrics.baselineGlobal.accuracy - result.metrics.attackedGlobal.accuracy).toFixed(4),
      ],
    ]
      .map((row) => row.join(","))
      .join("\n")

    const element = document.createElement("a")
    element.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(csv))
    element.setAttribute("download", `results-${jobId}.csv`)
    element.style.display = "none"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-accent">Attack Simulation Results</h1>
            <p className="text-muted">
              Job ID: <span className="font-mono text-sm">{jobId}</span>
            </p>
          </div>
          <button onClick={() => navigate("/upload")} className="btn-secondary" aria-label="New simulation">
            New Simulation
          </button>
        </div>

        {/* Summary Card */}
        <div className="card space-y-3">
          <h2 className="text-lg font-bold">Simulation Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted">Attack Type</p>
              <p className="font-semibold">{result.attack}</p>
            </div>
            <div>
              <p className="text-muted">Intensity</p>
              <p className="font-semibold">{result.intensityPercent}%</p>
            </div>
            <div>
              <p className="text-muted">Clients Attacked</p>
              <p className="font-semibold">{result.clientsAttacked.length}</p>
            </div>
            <div>
              <p className="text-muted">Time</p>
              <p className="font-semibold">{new Date(result.createdAt || "").toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Global Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard label="Baseline F1" value={baselineF1} />
            <MetricCard label="Attacked F1" value={attackedF1} trend="down" />
            <MetricCard label="F1 Drop" value={f1Drop} unit="" trend="down" />
            <MetricCard label="F1 Drop %" value={f1DropPercent} unit="%" trend="down" />
          </div>
        </div>

        {/* Verdict */}
        {result.verdict && <VerdictBox label={result.verdict.label} explanation={result.verdict.explanation} />}

        {/* Charts */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Performance Analysis</h2>
          <ChartPanel
            title="Attack Analysis"
            clientMetrics={result.metrics.perClient}
            baselineGlobal={result.metrics.baselineGlobal}
            attackedGlobal={result.metrics.attackedGlobal}
          />
        </div>

        {/* Export */}
        <div className="flex gap-4">
          <button onClick={downloadCSV} className="btn-secondary" aria-label="Download metrics as CSV">
            📥 Download Metrics CSV
          </button>
          <button onClick={() => navigate("/history")} className="btn-secondary" aria-label="View job history">
            📋 View History
          </button>
        </div>
      </div>
    </div>
  )
}
