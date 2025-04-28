"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Cpu, Users, Calendar } from "lucide-react"

interface WorkshopCardProps {
  title: string
  date: string
  location: string
  participants: string
  description: string
  imageUrl: string
}

export default function WorkshopCard({
  title,
  date,
  location,
  participants,
  description,
  imageUrl,
}: WorkshopCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="w-full"
    >
      <Card className="overflow-hidden border-zinc-200 bg-white hover:shadow-lg transition-all duration-300">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative h-64 md:h-full">
            <Image src={imageUrl || "/workshop/workshop-1.jpg"} alt={title} fill className="object-cover" />
          </div>
          <div className="p-6">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="text-2xl font-bold text-zinc-800">{title}</CardTitle>
              <div className="flex flex-col gap-2 mt-2">
                <div className="flex items-center text-sm text-zinc-600">
                  <Calendar className="w-4 h-4 mr-2 text-sky-500" />
                  {date}
                </div>
                <div className="flex items-center text-sm text-zinc-600">
                  <Users className="w-4 h-4 mr-2 text-indigo-500" />
                  {participants}
                </div>
                <div className="flex items-center text-sm text-zinc-600">
                  <Cpu className="w-4 h-4 mr-2 text-sky-500" />
                  {location}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <p className="text-zinc-600 mb-4">{description}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge className="bg-sky-100 text-sky-800 hover:bg-sky-200 border-none">IoT</Badge>
                <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200 border-none">Micro-Controller</Badge>
                <Badge className="bg-sky-100 text-sky-800 hover:bg-sky-200 border-none">STEM Education</Badge>
                <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200 border-none">Kids Workshop</Badge>
                <Badge className="bg-sky-100 text-sky-800 hover:bg-sky-200 border-none">ESP-32</Badge>
              </div>
            </CardContent>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
