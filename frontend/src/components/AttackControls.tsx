"use client"

import type React from "react"

interface AttackControlsProps {
  attackType: string
  onAttackTypeChange: (type: string) => void
  intensityPercent: number
  onIntensityChange: (intensity: number) => void
  numClients: number
  onNumClientsChange: (num: number) => void
  useDemo: boolean
  onUseDemoChange: (use: boolean) => void
}

const ATTACK_TYPES = ["Label Flip", "Manzantan", "Backdoor", "Cycle", "Freeride", "Scaling"]

export const AttackControls: React.FC<AttackControlsProps> = ({
  attackType,
  onAttackTypeChange,
  intensityPercent,
  onIntensityChange,
  numClients,
  onNumClientsChange,
  useDemo,
  onUseDemoChange,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="demo-toggle"
          checked={useDemo}
          onChange={(e) => onUseDemoChange(e.target.checked)}
          className="w-4 h-4 cursor-pointer"
          aria-label="Use demo files"
        />
        <label htmlFor="demo-toggle" className="text-sm font-medium cursor-pointer">
          Use Demo Model & Attack Files
        </label>
      </div>

      <div className="space-y-2">
        <label htmlFor="attack-type" className="block text-sm font-medium">
          Attack Type
        </label>
        <select
          id="attack-type"
          value={attackType}
          onChange={(e) => onAttackTypeChange(e.target.value)}
          aria-label="Select attack type"
        >
          <option value="">Select an attack type...</option>
          {ATTACK_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="num-clients" className="block text-sm font-medium">
          Number of Clients: {numClients}
        </label>
        <input
          id="num-clients"
          type="range"
          min="1"
          max="5"
          value={numClients}
          onChange={(e) => onNumClientsChange(Number.parseInt(e.target.value))}
          className="w-full"
          aria-label="Number of clients"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="intensity" className="block text-sm font-medium">
          Attack Intensity: {intensityPercent}%
        </label>
        <input
          id="intensity"
          type="range"
          min="0"
          max="100"
          value={intensityPercent}
          onChange={(e) => onIntensityChange(Number.parseInt(e.target.value))}
          className="w-full"
          aria-label="Attack intensity percentage"
        />
      </div>
    </div>
  )
}
