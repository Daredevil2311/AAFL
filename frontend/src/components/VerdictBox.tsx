import type React from "react"

interface VerdictBoxProps {
  label: "Safe" | "Warning" | "Compromised"
  explanation: string
}

export const VerdictBox: React.FC<VerdictBoxProps> = ({ label, explanation }) => {
  const bgColor = {
    Safe: "bg-success bg-opacity-20 border-success",
    Warning: "bg-warning bg-opacity-20 border-warning",
    Compromised: "bg-destructive bg-opacity-20 border-destructive",
  }[label]

  const textColor = {
    Safe: "text-success",
    Warning: "text-warning",
    Compromised: "text-destructive",
  }[label]

  return (
    <div className={`card border ${bgColor} space-y-2`}>
      <div className="flex items-center space-x-2">
        <span className={`text-xl font-bold ${textColor}`}>●</span>
        <h3 className={`text-lg font-bold ${textColor}`}>Verdict: {label}</h3>
      </div>
      <p className="text-sm text-foreground">{explanation}</p>
    </div>
  )
}
