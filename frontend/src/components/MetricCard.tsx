import type React from "react"

interface MetricCardProps {
  label: string
  value: number | string
  unit?: string
  trend?: "up" | "down" | "neutral"
}

export const MetricCard: React.FC<MetricCardProps> = ({ label, value, unit = "", trend }) => {
  const trendColor = trend === "down" ? "text-destructive" : trend === "up" ? "text-success" : "text-foreground"

  return (
    <div className="card space-y-1">
      <p className="text-xs font-medium text-muted">{label}</p>
      <p className={`text-2xl font-bold ${trendColor}`}>
        {typeof value === "number" ? value.toFixed(3) : value}
        {unit}
      </p>
    </div>
  )
}
