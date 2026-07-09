"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface MetricComparison {
  metric: string
  secure: number | string
  compromised: number | string
  riskIncrease: number | string
  unit?: string
}

interface PrivacyRiskMatrixProps {
  data?: MetricComparison[]
}

export const PrivacyRiskMatrix: React.FC<PrivacyRiskMatrixProps> = ({ data }) => {
  // Mock data if not provided
  const matrixData = data || [
    { metric: "Privacy Score", secure: "95%", compromised: "38%", riskIncrease: "57% ↓", unit: "%" },
    { metric: "F1 Score", secure: 0.92, compromised: 0.65, riskIncrease: "0.27 ↓", unit: "" },
    { metric: "Recall", secure: 0.89, compromised: 0.58, riskIncrease: "0.31 ↓", unit: "" },
    { metric: "Precision", secure: 0.94, compromised: 0.72, riskIncrease: "0.22 ↓", unit: "" },
    { metric: "Data Integrity", secure: "100%", compromised: "42%", riskIncrease: "58% ↓", unit: "%" },
    { metric: "Model Stability", secure: "96%", compromised: "51%", riskIncrease: "45% ↓", unit: "%" },
  ]

  const getRiskColor = (metric: string, value: number | string) => {
    if (
      metric.includes("Score") ||
      metric.includes("Privacy") ||
      metric.includes("Integrity") ||
      metric.includes("Recall") ||
      metric.includes("Precision") ||
      metric.includes("Stability")
    ) {
      const numValue = typeof value === "string" ? Number.parseFloat(value) : value
      if (numValue >= 0.85 || numValue >= 85)
        return "bg-green-100 dark:bg-green-900/30 text-green-900 dark:text-green-300"
      if (numValue >= 0.7 || numValue >= 70)
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-900 dark:text-yellow-300"
      return "bg-red-100 dark:bg-red-900/30 text-red-900 dark:text-red-300"
    }
    return "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-300"
  }

  const formatValue = (value: number | string) => {
    if (typeof value === "string") return value
    return typeof value === "number" && value < 1 ? value.toFixed(2) : value
  }

  return (
    <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="text-slate-900 dark:text-white">Privacy Risk Assessment Matrix</CardTitle>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Comparative analysis of secure vs compromised models across key metrics
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-slate-300 dark:border-slate-600">
                <th className="text-left p-4 font-semibold text-slate-900 dark:text-white">Metric</th>
                <th className="text-center p-4 font-semibold text-slate-900 dark:text-white">Secure Model</th>
                <th className="text-center p-4 font-semibold text-slate-900 dark:text-white">Compromised Model</th>
                <th className="text-center p-4 font-semibold text-red-600 dark:text-red-400">Risk Increase</th>
              </tr>
            </thead>
            <tbody>
              {matrixData.map((row, idx) => (
                <tr
                  key={idx}
                  className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="p-4 font-medium text-slate-900 dark:text-white">{row.metric}</td>
                  <td className="p-4">
                    <div
                      className={`text-center px-3 py-2 rounded font-semibold ${getRiskColor(row.metric, row.secure)}`}
                    >
                      {formatValue(row.secure)}
                      {row.unit}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-center px-3 py-2 rounded font-semibold bg-red-100 dark:bg-red-900/30 text-red-900 dark:text-red-300">
                      {formatValue(row.compromised)}
                      {row.unit}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-center">
                      <Badge className="bg-red-600 dark:bg-red-700 hover:bg-red-700 dark:hover:bg-red-800 text-white font-semibold">
                        {row.riskIncrease}
                      </Badge>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
          <p className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Summary:</p>
          <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-1 list-disc list-inside">
            <li>Model shows significant vulnerability to attack with average 44% metric degradation</li>
            <li>Recall metric most affected, indicating poor detection of malicious patterns post-attack</li>
            <li>Privacy score drops by 57%, suggesting severe privacy breach exposure</li>
            <li>Immediate security measures recommended</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
