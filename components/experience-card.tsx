"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Code, Gamepad, GraduationCap } from "lucide-react"

interface ExperienceCardProps {
  title: string
  company: string
  period: string
  description: string
  icon: "gamepad" | "graduation-cap" | "code"
}

export default function ExperienceCard({ title, company, period, description, icon }: ExperienceCardProps) {
  const icons = {
    gamepad: <Gamepad className="w-10 h-10 text-purple-400" />,
    "graduation-cap": <GraduationCap className="w-10 h-10 text-cyan-400" />,
    code: <Code className="w-10 h-10 text-purple-400" />,
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(124, 58, 237, 0.1)" }}
    >
      <Card className="border-white/10 bg-black/50 backdrop-blur-md hover:border-purple-500/30 transition-all duration-300 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-cyan-500/5"></div>
        <CardHeader className="pb-2 relative">
          <div className="absolute top-2 right-2 opacity-70">{icons[icon]}</div>
          <CardTitle className="text-xl">{title}</CardTitle>
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>{company}</span>
            <span className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 px-2 py-0.5 rounded text-xs">
              {period}
            </span>
          </div>
        </CardHeader>
        <CardContent className="relative">
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}
