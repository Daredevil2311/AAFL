"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface HeatmapCell {
  client: string
  attackType: string
  intensity: number // 0-100
  dataCompromise: number // 0-100
}

interface AttackHeatmapProps {
  data?: HeatmapCell[]
}

export const AttackHeatmap: React.FC<AttackHeatmapProps> = ({ data }) => {
  // Mock data if not provided
  const heatmapData = data || [
    { client: "C1", attackType: "Label Flip", intensity: 85, dataCompromise: 75 },
    { client: "C1", attackType: "Backdoor", intensity: 60, dataCompromise: 50 },
    { client: "C1", attackType: "Scaling", intensity: 40, dataCompromise: 35 },
    { client: "C2", attackType: "Label Flip", intensity: 45, dataCompromise: 40 },
    { client: "C2", attackType: "Backdoor", intensity: 70, dataCompromise: 65 },
    { client: "C2", attackType: "Scaling", intensity: 30, dataCompromise: 25 },
    { client: "C3", attackType: "Label Flip", intensity: 90, dataCompromise: 88 },
    { client: "C3", attackType: "Backdoor", intensity: 55, dataCompromise: 48 },
    { client: "C3", attackType: "Scaling", intensity: 20, dataCompromise: 15 },
    { client: "C4", attackType: "Label Flip", intensity: 50, dataCompromise: 45 },
    { client: "C4", attackType: "Backdoor", intensity: 75, dataCompromise: 70 },
    { client: "C4", attackType: "Scaling", intensity: 35, dataCompromise: 30 },
    { client: "C5", attackType: "Label Flip", intensity: 80, dataCompromise: 78 },
    { client: "C5", attackType: "Backdoor", intensity: 65, dataCompromise: 60 },
    { client: "C5", attackType: "Scaling", intensity: 25, dataCompromise: 20 },
  ]

  const getColor = (value: number) => {
    // Gradient from blue (safe) to red (dangerous)
    if (value < 25) return "bg-blue-900 dark:bg-blue-950"
    if (value < 40) return "bg-blue-700 dark:bg-blue-800"
    if (value < 55) return "bg-cyan-600 dark:bg-cyan-700"
    if (value < 70) return "bg-yellow-600 dark:bg-yellow-700"
    if (value < 85) return "bg-orange-600 dark:bg-orange-700"
    return "bg-red-600 dark:bg-red-700"
  }

  const clients = [...new Set(heatmapData.map((d) => d.client))]
  const attackTypes = [...new Set(heatmapData.map((d) => d.attackType))]

  return (
    <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="text-slate-900 dark:text-white">Attack Intensity Heat Map</CardTitle>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Combined attack intensity and data compromise ratio per client and attack type
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left p-3 font-medium text-slate-700 dark:text-slate-300">Attack Type</th>
                {clients.map((client) => (
                  <th key={client} className="text-center p-3 font-medium text-slate-700 dark:text-slate-300">
                    {client}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {attackTypes.map((attackType) => (
                <tr key={attackType} className="border-b border-slate-200 dark:border-slate-700">
                  <td className="p-3 font-medium text-slate-900 dark:text-white">{attackType}</td>
                  {clients.map((client) => {
                    const cell = heatmapData.find((d) => d.client === client && d.attackType === attackType)
                    const combinedScore = cell ? (cell.intensity + cell.dataCompromise) / 2 : 0

                    return (
                      <td key={`${client}-${attackType}`} className="p-2">
                        <div
                          className={`${getColor(combinedScore)} text-white text-center rounded px-3 py-2 font-semibold transition-all duration-200 hover:shadow-lg cursor-pointer`}
                          title={`Intensity: ${cell?.intensity}% | Data Compromise: ${cell?.dataCompromise}%`}
                        >
                          {Math.round(combinedScore)}
                        </div>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
          <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-3">Risk Level:</p>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-900 dark:bg-blue-950 rounded"></div>
              <span className="text-xs text-slate-600 dark:text-slate-400">Safe (0-25)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-cyan-600 dark:bg-cyan-700 rounded"></div>
              <span className="text-xs text-slate-600 dark:text-slate-400">Low (25-55)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-600 dark:bg-yellow-700 rounded"></div>
              <span className="text-xs text-slate-600 dark:text-slate-400">Medium (55-70)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-600 dark:bg-orange-700 rounded"></div>
              <span className="text-xs text-slate-600 dark:text-slate-400">High (70-85)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-600 dark:bg-red-700 rounded"></div>
              <span className="text-xs text-slate-600 dark:text-slate-400">Critical (85-100)</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
