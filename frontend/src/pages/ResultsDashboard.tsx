import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useJob } from "../context/JobContext"
import Plot from "react-plotly.js"
import axios from "axios"

interface AttackMetrics {
  accuracy: number
  precision: number
  recall: number
  f1: number
  auc: number
}

interface AttackResult {
  attackType: string
  cleanMetrics: AttackMetrics
  attackedMetrics: AttackMetrics
  metricDrops: AttackMetrics
  detectionAccuracy: number
  attackSuccessRate: number
  clusterSize?: number
  sybilInfluence?: number
  backdoorSuccessRate?: number
}

export const ResultsDashboard: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>()
  const { getJobById } = useJob()
  const [result, setResult] = useState<AttackResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchResults = async () => {
      if (!jobId) return

      try {
        // Try to get from context first
        const job = getJobById(jobId)
        if (job?.result) {
          setResult(job.result as any)
          setLoading(false)
          return
        }

        // Otherwise fetch from backend
        const response = await axios.get(`http://localhost:8000/api/mock/jobs/${jobId}`)
        if (response.data.result) {
          setResult(response.data.result)
        }
      } catch (error) {
        console.error("Error fetching results:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [jobId, getJobById])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-muted">Loading results...</p>
        </div>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-xl">❌ No results found for this job</p>
        </div>
      </div>
    )
  }

  // Metrics Comparison Bar Chart
  const metricsComparisonData = {
    data: [
      {
        name: "Clean Model",
        x: ["Accuracy", "Precision", "Recall", "F1 Score", "AUC"],
        y: [
          result.cleanMetrics.accuracy,
          result.cleanMetrics.precision,
          result.cleanMetrics.recall,
          result.cleanMetrics.f1,
          result.cleanMetrics.auc,
        ],
        type: "bar" as const,
        marker: { color: "#10b981" }, // green
      },
      {
        name: "Attacked Model",
        x: ["Accuracy", "Precision", "Recall", "F1 Score", "AUC"],
        y: [
          result.attackedMetrics.accuracy,
          result.attackedMetrics.precision,
          result.attackedMetrics.recall,
          result.attackedMetrics.f1,
          result.attackedMetrics.auc,
        ],
        type: "bar" as const,
        marker: { color: "#ef4444" }, // red
      },
    ],
    layout: {
      title: `${result.attackType} - Metrics Comparison`,
      plot_bgcolor: "#0f1117",
      paper_bgcolor: "#1c2128",
      font: { color: "#e6edf3" },
      barmode: "group" as const,
      yaxis: { title: "Score", range: [0, 1] },
      hovermode: "x unified",
      margin: { l: 60, r: 40, t: 60, b: 60 },
    },
  }

  // Metric Drops Bar Chart (Impact Visualization)
  const metricDropsData = {
    data: [
      {
        x: ["Accuracy", "Precision", "Recall", "F1 Score", "AUC"],
        y: [
          result.metricDrops.accuracy,
          result.metricDrops.precision,
          result.metricDrops.recall,
          result.metricDrops.f1,
          result.metricDrops.auc,
        ],
        type: "bar" as const,
        marker: { 
          color: [
            result.metricDrops.accuracy,
            result.metricDrops.precision,
            result.metricDrops.recall,
            result.metricDrops.f1,
            result.metricDrops.auc,
          ].map(v => v < -0.1 ? "#dc2626" : v < -0.05 ? "#f59e0b" : "#10b981")
        },
      },
    ],
    layout: {
      title: `${result.attackType} - Performance Impact`,
      plot_bgcolor: "#0f1117",
      paper_bgcolor: "#1c2128",
      font: { color: "#e6edf3" },
      yaxis: { title: "Metric Drop", tickformat: ".2%" },
      hovermode: "x unified",
      margin: { l: 60, r: 40, t: 60, b: 60 },
    },
  }

  // Detection & Success Rates Gauge Chart
  const gaugeData = {
    data: [
      {
        type: "indicator" as const,
        mode: "gauge+number+delta",
        value: result.detectionAccuracy * 100,
        title: { text: "Detection Accuracy", font: { color: "#e6edf3" } },
        delta: { reference: 90 },
        gauge: {
          axis: { range: [0, 100], tickcolor: "#e6edf3" },
          bar: { color: "#10b981" },
          steps: [
            { range: [0, 50], color: "#1f2937" },
            { range: [50, 75], color: "#374151" },
            { range: [75, 100], color: "#4b5563" },
          ],
          threshold: {
            line: { color: "#ef4444", width: 4 },
            thickness: 0.75,
            value: 90,
          },
        },
      },
    ],
    layout: {
      plot_bgcolor: "#0f1117",
      paper_bgcolor: "#1c2128",
      font: { color: "#e6edf3" },
      margin: { l: 40, r: 40, t: 60, b: 40 },
      height: 300,
    },
  }

  const successRateData = {
    data: [
      {
        type: "indicator" as const,
        mode: "gauge+number",
        value: result.attackSuccessRate * 100,
        title: { text: "Attack Success Rate", font: { color: "#e6edf3" } },
        gauge: {
          axis: { range: [0, 100], tickcolor: "#e6edf3" },
          bar: { color: "#ef4444" },
          steps: [
            { range: [0, 33], color: "#1f2937" },
            { range: [33, 66], color: "#374151" },
            { range: [66, 100], color: "#4b5563" },
          ],
        },
      },
    ],
    layout: {
      plot_bgcolor: "#0f1117",
      paper_bgcolor: "#1c2128",
      font: { color: "#e6edf3" },
      margin: { l: 40, r: 40, t: 60, b: 40 },
      height: 300,
    },
  }

  // Radar Chart for Metrics Comparison
  const radarData = {
    data: [
      {
        type: "scatterpolar" as const,
        r: [
          result.cleanMetrics.accuracy,
          result.cleanMetrics.precision,
          result.cleanMetrics.recall,
          result.cleanMetrics.f1,
          result.cleanMetrics.auc,
        ],
        theta: ["Accuracy", "Precision", "Recall", "F1", "AUC"],
        fill: "toself",
        name: "Clean Model",
        marker: { color: "#10b981" },
      },
      {
        type: "scatterpolar" as const,
        r: [
          result.attackedMetrics.accuracy,
          result.attackedMetrics.precision,
          result.attackedMetrics.recall,
          result.attackedMetrics.f1,
          result.attackedMetrics.auc,
        ],
        theta: ["Accuracy", "Precision", "Recall", "F1", "AUC"],
        fill: "toself",
        name: "Attacked Model",
        marker: { color: "#ef4444" },
      },
    ],
    layout: {
      title: `${result.attackType} - Radar Comparison`,
      plot_bgcolor: "#0f1117",
      paper_bgcolor: "#1c2128",
      font: { color: "#e6edf3" },
      polar: {
        radialaxis: {
          visible: true,
          range: [0, 1],
          tickcolor: "#e6edf3",
        },
      },
      margin: { l: 80, r: 80, t: 60, b: 60 },
    },
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-card rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">{result.attackType} Results</h1>
          <p className="text-muted">Job ID: {jobId}</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card rounded-lg shadow p-6">
            <h3 className="text-sm text-muted mb-2">Detection Accuracy</h3>
            <p className="text-3xl font-bold text-green-500">
              {(result.detectionAccuracy * 100).toFixed(1)}%
            </p>
          </div>
          <div className="bg-card rounded-lg shadow p-6">
            <h3 className="text-sm text-muted mb-2">Attack Success Rate</h3>
            <p className="text-3xl font-bold text-red-500">
              {(result.attackSuccessRate * 100).toFixed(1)}%
            </p>
          </div>
          <div className="bg-card rounded-lg shadow p-6">
            <h3 className="text-sm text-muted mb-2">Accuracy Drop</h3>
            <p className="text-3xl font-bold text-yellow-500">
              {(result.metricDrops.accuracy * 100).toFixed(1)}%
            </p>
          </div>
          <div className="bg-card rounded-lg shadow p-6">
            <h3 className="text-sm text-muted mb-2">F1 Score Drop</h3>
            <p className="text-3xl font-bold text-yellow-500">
              {(result.metricDrops.f1 * 100).toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Main Metrics Comparison */}
        <div className="bg-card rounded-lg shadow-lg p-6">
          <Plot
            data={metricsComparisonData.data}
            layout={metricsComparisonData.layout}
            config={{ responsive: true, displayModeBar: true }}
            style={{ width: "100%", height: "500px" }}
          />
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Metric Drops */}
          <div className="bg-card rounded-lg shadow-lg p-6">
            <Plot
              data={metricDropsData.data}
              layout={metricDropsData.layout}
              config={{ responsive: true, displayModeBar: false }}
              style={{ width: "100%", height: "400px" }}
            />
          </div>

          {/* Radar Chart */}
          <div className="bg-card rounded-lg shadow-lg p-6">
            <Plot
              data={radarData.data}
              layout={radarData.layout}
              config={{ responsive: true, displayModeBar: false }}
              style={{ width: "100%", height: "400px" }}
            />
          </div>
        </div>

        {/* Gauges */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-lg shadow-lg p-6">
            <Plot
              data={gaugeData.data}
              layout={gaugeData.layout}
              config={{ responsive: true, displayModeBar: false }}
              style={{ width: "100%", height: "300px" }}
            />
          </div>
          <div className="bg-card rounded-lg shadow-lg p-6">
            <Plot
              data={successRateData.data}
              layout={successRateData.layout}
              config={{ responsive: true, displayModeBar: false }}
              style={{ width: "100%", height: "300px" }}
            />
          </div>
        </div>

        {/* Additional Attack-Specific Info */}
        {result.clusterSize && (
          <div className="bg-card rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4">Sybil Attack Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-muted">Cluster Size</p>
                <p className="text-2xl font-bold text-accent">{result.clusterSize}</p>
              </div>
              <div>
                <p className="text-muted">Sybil Influence</p>
                <p className="text-2xl font-bold text-accent">
                  {(result.sybilInfluence! * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        )}

        {result.backdoorSuccessRate && (
          <div className="bg-card rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4">Backdoor Attack Details</h3>
            <div>
              <p className="text-muted">Backdoor Success Rate</p>
              <p className="text-2xl font-bold text-accent">
                {(result.backdoorSuccessRate * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
