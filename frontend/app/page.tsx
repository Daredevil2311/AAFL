"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const user = localStorage.getItem("user")
    if (!user) {
      router.push("/login")
    } else {
      router.push("/upload")
    }
  }, [router])

  if (!isClient) return null

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center animate-slideInUp">
        <div className="mb-8 flex justify-center">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full opacity-30 animate-pulse"></div>
            <div
              className="absolute inset-2 bg-gradient-to-r from-primary to-accent rounded-full opacity-50"
              style={{
                animation: "spin 2s linear infinite",
              }}
            ></div>
            <div className="absolute inset-6 bg-background rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-3">
          Initializing System
        </h1>
        <p className="text-lg text-muted-foreground">Loading your security dashboard...</p>

        <div className="mt-8 flex justify-center gap-1">
          <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
          <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
        </div>
      </div>
    </div>
  )
}
