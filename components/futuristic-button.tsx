"use client"

import { forwardRef } from "react"
import { Button, type ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const FuturisticButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
        <Button
          ref={ref}
          variant={variant}
          size={size}
          className={cn(
            "relative bg-black text-white border-white/10 hover:bg-black/80 transition-all duration-300",
            variant === "outline" && "bg-transparent border-white/20 hover:bg-black/20 hover:border-cyan-500/50",
            className,
          )}
          {...props}
        >
          {children}
        </Button>
      </div>
    )
  },
)
FuturisticButton.displayName = "FuturisticButton"

export default FuturisticButton
