"use client"

import type React from "react"

interface ClientsSelectorProps {
  numClients: number
  selectedClients: number[]
  onClientsChange: (clients: number[]) => void
}

export const ClientsSelector: React.FC<ClientsSelectorProps> = ({ numClients, selectedClients, onClientsChange }) => {
  const toggleClient = (clientId: number) => {
    const updated = selectedClients.includes(clientId)
      ? selectedClients.filter((c) => c !== clientId)
      : [...selectedClients, clientId]
    onClientsChange(updated)
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">Attack Target Clients</label>
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: numClients }, (_, i) => i + 1).map((clientId) => (
          <button
            key={clientId}
            onClick={() => toggleClient(clientId)}
            className={`px-3 py-1 rounded text-sm font-medium transition ${
              selectedClients.includes(clientId)
                ? "bg-primary text-white"
                : "bg-secondary text-foreground hover:bg-opacity-80"
            }`}
            aria-pressed={selectedClients.includes(clientId)}
            aria-label={`Client ${clientId}`}
          >
            Client {clientId}
          </button>
        ))}
      </div>
    </div>
  )
}
