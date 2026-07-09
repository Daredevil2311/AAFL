import type React from "react"

interface ProgressBarProps {
  percent: number
  stage: string
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ percent, stage }) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">Progress</span>
        <span className="text-sm font-bold text-accent">{percent}%</span>
      </div>
      <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
        <div
          className="bg-gradient-to-r from-primary to-accent h-full transition-all duration-300"
          style={{ width: `${percent}%` }}
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      <p className="text-xs text-muted capitalize">
        Current stage: <span className="text-accent">{stage}</span>
      </p>
    </div>
  )
}
