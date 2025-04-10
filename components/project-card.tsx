"use client"

import Image from "next/image"
import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, ExternalLink, Github } from "lucide-react"
import GlassmorphicPanel from "@/components/glassmorphic-panel"

interface ProjectCardProps {
  title: string
  category: string
  description: string
  technologies: string[]
  imageUrl: string
  modelType?: "fantasy" | "space" | "data" | "tech"
  githubUrl?: string
  liveUrl?: string
}

export default function ProjectCard({
  title,
  category,
  description,
  technologies,
  imageUrl,
  modelType = "tech",
  githubUrl,
  liveUrl,
}: ProjectCardProps) {
  const [expanded, setExpanded] = useState(false)
  const cardRef = useRef(null)

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="perspective-1000"
    >
      <Card className="overflow-hidden border-zinc-200 bg-white hover:shadow-lg transition-all duration-300 h-full hover:neon-border">
        <div className="relative h-48 overflow-hidden group">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <Badge className="absolute top-3 left-3 bg-gradient-to-r from-[#00eeff] to-[#8a2be2] text-white border-none neon-pulse">
            {category}
          </Badge>
        </div>
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-2 text-zinc-800">{title}</h3>
          <p className="text-zinc-600 mb-4">{description}</p>

          <div className="flex flex-wrap gap-2 mb-4">
            {technologies.map((tech, index) => (
              <Badge key={index} variant="outline" className="text-xs border-zinc-200 bg-zinc-50 text-zinc-700">
                {tech}
              </Badge>
            ))}
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-between text-zinc-600 hover:text-sky-500"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Show Less" : "Show More"}
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </Button>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <GlassmorphicPanel className="mt-4 p-4" glowColor="multi">
                  <h4 className="font-medium mb-2 text-zinc-800">Project Details</h4>
                  <p className="text-zinc-600 mb-4">
                    This project showcases my expertise in {category.toLowerCase()} using {technologies.join(", ")}. I
                    was responsible for architecture, implementation, and optimization.
                  </p>

                  <div className="flex gap-2 mt-4">
                    {githubUrl && (
                      <Button size="sm" variant="outline" asChild className="gap-2">
                        <a href={githubUrl} target="_blank" rel="noopener noreferrer">
                          <Github size={16} />
                          Code
                        </a>
                      </Button>
                    )}
                    {liveUrl && (
                      <Button
                        size="sm"
                        asChild
                        className="gap-2 bg-gradient-to-r from-[#00eeff] to-[#8a2be2] hover:from-[#00d0dd] hover:to-[#7a26c9] text-white border-none"
                      >
                        <a href={liveUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink size={16} />
                          Live Demo
                        </a>
                      </Button>
                    )}
                  </div>
                </GlassmorphicPanel>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  )
}
