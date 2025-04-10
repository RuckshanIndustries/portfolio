"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"

interface SkillBadgeProps {
  name: string
  level: number
}

export default function SkillBadge({ name, level }: SkillBadgeProps) {
  return (
    <div className="relative group">
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${level}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-md"
      />
      <Badge
        variant="outline"
        className="relative px-3 py-1 border-white/10 group-hover:border-cyan-500/50 transition-all duration-300"
      >
        <span className="mr-2">{name}</span>
        <span className="text-xs opacity-70">{level}%</span>
      </Badge>
    </div>
  )
}
