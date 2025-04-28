"use client"

import { useState, useRef, useEffect } from "react"
import { motion, useInView } from "framer-motion"
import Image from "next/image"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface TechItem {
  name: string
  icon: string
  color: string
  category: "game" | "mobile" | "web" | "language" | "framework"
  description: string
}

export default function TechStackDisplay() {
  const [hoveredTech, setHoveredTech] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: false, amount: 0.3 })
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })
  const [initialized, setInitialized] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const techStack: TechItem[] = [
    { name: "Unreal Engine", icon: "./unreal-engine.svg", color: "#1A93F1", category: "game", description: "Game Development & 3D Visualization" },
    { name: "Unity", icon: "./unity.svg", color: "#00CCCC", category: "game", description: "Cross-platform Game Development" },
    { name: "C++", icon: "./cpp.svg", color: "#659BD3", category: "language", description: "Game Engine Programming" },
    { name: "C#", icon: "./csharp.svg", color: "#9B4F96", category: "language", description: "Unity Development & Backend" },
    { name: "Java", icon: "./java.svg", color: "#E76F00", category: "language", description: "Enterprise Application Development" },
    { name: "Flutter", icon: "./flutter.svg", color: "#54C5F8", category: "mobile", description: "Cross-platform Mobile Development" },
    { name: "Firebase", icon: "./firebase.svg", color: "#FFCA28", category: "web", description: "Backend & Authentication" },
    { name: "IFS", icon: "./ifs.svg", color: "#8A2BE2", category: "framework", description: "Enterprise Resource Planning" },
  ]

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        })
      }
      setIsMobile(window.innerWidth < 768)
    }
    updateSize()
    window.addEventListener("resize", updateSize)
    return () => window.removeEventListener("resize", updateSize)
  }, [])

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => setInitialized(true), 500)
      return () => clearTimeout(timer)
    }
  }, [isInView])

  const getRandomPosition = (index: number, total: number) => {
    if (isMobile) {
      const cols = 2
      const spacingX = containerSize.width / cols
      const spacingY = 140
      const col = index % cols
      const row = Math.floor(index / cols)

      return {
        x: spacingX * col + spacingX / 2 - 40,
        y: 100 + row * spacingY,
      }
    }

    const angle = (index / total) * Math.PI * 2
    const radius = Math.min(containerSize.width, containerSize.height) * 0.3

    return {
      x: Math.cos(angle) * radius + containerSize.width / 2 - 40,
      y: Math.sin(angle) * radius + containerSize.height / 2 - 40,
    }
  }

  const estimatedMobileHeight = Math.ceil(techStack.length / 2) * 140 + 200 // Rows x spacing + extra

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden my-12"
      style={{
        height: isMobile ? `${estimatedMobileHeight}px` : "500px",
      }}
    >
      {/* Central glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-gradient-to-r from-sky-500/30 to-indigo-500/30 blur-xl" />

      <TooltipProvider>
        {techStack.map((tech, index) => {
          const initialX = containerSize.width / 2 - 40
          const initialY = containerSize.height / 2 - 40
          const targetPos = getRandomPosition(index, techStack.length)

          return (
            <motion.div
              key={tech.name}
              className="absolute"
              initial={{ x: initialX, y: initialY, opacity: 0, scale: 0.5 }}
              animate={
                initialized
                  ? {
                    x: targetPos.x,
                    y: targetPos.y,
                    opacity: 1,
                    scale: 1,
                    transition: {
                      type: "spring",
                      stiffness: 100,
                      damping: 15,
                      delay: index * 0.1,
                    },
                  }
                  : {}
              }
              style={{ zIndex: hoveredTech === tech.name ? 10 : 1 }}
            >
              <motion.div
                animate={
                  initialized
                    ? {
                      y: [0, -10, 0, 5, 0],
                      x: [0, 5, 0, -5, 0],
                      rotate: [0, 2, 0, -2, 0],
                    }
                    : {}
                }
                transition={{
                  duration: 5 + Math.random() * 3,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                  delay: index * 0.2,
                }}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.div
                      className="relative cursor-pointer"
                      whileHover={{ scale: 1.2 }}
                      onHoverStart={() => setHoveredTech(tech.name)}
                      onHoverEnd={() => setHoveredTech(null)}
                    >
                      {/* Glow */}
                      <div className="absolute inset-0 rounded-full blur-md opacity-70" style={{ backgroundColor: tech.color }} />

                      {/* Icon container */}
                      <div className="relative w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg border border-zinc-100 overflow-hidden">
                        <div className="relative w-10 h-10">
                          <Image src={tech.icon || "/placeholder.svg"} alt={tech.name} fill className="object-contain" />
                        </div>

                        {/* Animated border */}
                        <motion.div
                          className="absolute inset-0 rounded-full border-2 opacity-70"
                          style={{ borderColor: tech.color }}
                          animate={{
                            boxShadow: [
                              `0 0 0 rgba(${hexToRgb(tech.color)}, 0.4)`,
                              `0 0 10px rgba(${hexToRgb(tech.color)}, 0.6)`,
                              `0 0 0 rgba(${hexToRgb(tech.color)}, 0.4)`,
                            ],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatType: "reverse",
                          }}
                        />
                      </div>
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-white/90 backdrop-blur-sm border border-zinc-200">
                    <div className="text-center">
                      <p className="font-medium text-zinc-800">{tech.name}</p>
                      <p className="text-xs text-zinc-500">{tech.description}</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </motion.div>
            </motion.div>
          )
        })}
      </TooltipProvider>

      {/* Central label */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 flex items-center justify-center text-white font-bold shadow-lg"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5, type: "spring" }}
      >
        <span className="text-xs text-center">Tech Stack</span>
      </motion.div>
    </div>
  )
}

// Helper
function hexToRgb(hex: string) {
  hex = hex.replace("#", "")
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  return `${r}, ${g}, ${b}`
}
