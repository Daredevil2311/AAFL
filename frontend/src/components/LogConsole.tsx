"use client"

import type React from "react"
import { useEffect, useRef } from "react"

interface LogConsoleProps {
  logs: string[]
}

export const LogConsole: React.FC<LogConsoleProps> = ({ logs }) => {
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [logs])

  return (
    <div className="bg-secondary border border-secondary rounded-lg p-4 h-64 overflow-y-auto font-mono text-xs space-y-1">
      {logs.length === 0 ? (
        <p className="text-muted">Waiting for logs...</p>
      ) : (
        logs.map((log, idx) => (
          <div key={idx} className="text-muted hover:text-accent transition">
            <span className="text-primary">[{idx + 1}]</span> {log}
          </div>
        ))
      )}
      <div ref={endRef} />
    </div>
  )
}
