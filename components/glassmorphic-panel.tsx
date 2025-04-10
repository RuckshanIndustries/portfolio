import type React from "react"
import { cn } from "@/lib/utils"

interface GlassmorphicPanelProps {
  children: React.ReactNode
  className?: string
}

export default function GlassmorphicPanel({ children, className }: GlassmorphicPanelProps) {
  return (
    <div className={cn("backdrop-blur-sm bg-white/80 border border-zinc-200 rounded-xl shadow-sm", className)}>
      {children}
    </div>
  )
}
