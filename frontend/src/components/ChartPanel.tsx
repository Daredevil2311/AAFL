import type React from "react"
import Plot from "react-plotly.js"
import type { ClientMetric } from "../types"

interface ChartPanelProps {
  title: string
  clientMetrics: ClientMetric[]
  baselineGlobal: { f1: number; precision: number; recall: number; accuracy: number }
  attackedGlobal: { f1: number; precision: number; recall: number; accuracy: number }
}

export const ChartPanel: React.FC<ChartPanelProps> = ({ title, clientMetrics, baselineGlobal, attackedGlobal }) => {
  // Per-client bar chart
  const clientData = {
    data: [
      {
        name: "Baseline",
        x: clientMetrics.map((c) => `Client ${c.clientId}`),
        y: clientMetrics.map((c) => c.f1),
        type: "bar" as const,
        marker: { color: "#58a6ff" },
      },
      {
        name: "Attacked",
        x: clientMetrics.map((c) => `Client ${c.clientId}`),
        y: clientMetrics.map((c) => c.f1),
        type: "bar" as const,
        marker: { color: "#f85149" },
      },
    ],
    layout: {
      title: `${title} - Per-Client F1 Scores`,
      plot_bgcolor: "#0f1117",
      paper_bgcolor: "#1c2128",
      font: { color: "#e6edf3" },
      hovermode: "x unified",
      margin: { l: 50, r: 50, t: 50, b: 50 },
    },
  }

  // Global comparison
  const globalData = {
    data: [
      {
        name: "Baseline",
        x: ["F1", "Precision", "Recall", "Accuracy"],
        y: [baselineGlobal.f1, baselineGlobal.precision, baselineGlobal.recall, baselineGlobal.accuracy],
        type: "bar" as const,
        marker: { color: "#58a6ff" },
      },
      {
        name: "Attacked",
        x: ["F1", "Precision", "Recall", "Accuracy"],
        y: [attackedGlobal.f1, attackedGlobal.precision, attackedGlobal.recall, attackedGlobal.accuracy],
        type: "bar" as const,
        marker: { color: "#f85149" },
      },
    ],
    layout: {
      title: `${title} - Global Metrics Comparison`,
      plot_bgcolor: "#0f1117",
      paper_bgcolor: "#1c2128",
      font: { color: "#e6edf3" },
      barmode: "group" as const,
      hovermode: "x unified",
      margin: { l: 50, r: 50, t: 50, b: 50 },
    },
  }

  return (
    <div className="space-y-6">
      <div className="bg-secondary rounded-lg p-4 overflow-x-auto">
        <Plot
          data={clientData.data}
          layout={clientData.layout}
          config={{ responsive: true, displayModeBar: false }}
          style={{ width: "100%", height: "400px" }}
        />
      </div>

      <div className="bg-secondary rounded-lg p-4 overflow-x-auto">
        <Plot
          data={globalData.data}
          layout={globalData.layout}
          config={{ responsive: true, displayModeBar: false }}
          style={{ width: "100%", height: "400px" }}
        />
      </div>
    </div>
  )
}
