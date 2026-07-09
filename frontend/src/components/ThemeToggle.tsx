"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/src/context/ThemeContext"
import { Button } from "@/components/ui/button"

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button
      onClick={toggleTheme}
      variant="ghost"
      size="icon"
      className="rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-slate-700" />}
    </Button>
  )
}
