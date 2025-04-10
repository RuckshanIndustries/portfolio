"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import GlassmorphicPanel from "@/components/glassmorphic-panel"
import AnimatedText from "@/components/animated-text"
import Navbar from "@/components/navbar"
import { Calendar, Users, MapPin, ExternalLink } from "lucide-react"

export default function WorkshopsPage() {
  const [activeTab, setActiveTab] = useState("all")

  const workshops = [
    {
      id: "iot-kids",
      title: "IoT for Kids: Building Smart Devices",
      date: "June 15-17, 2023",
      location: "City Science Center",
      participants: "25 children ages 10-14",
      description:
        "A three-day workshop where children learned the basics of Internet of Things (IoT) technology through hands-on projects. Participants built simple smart devices using Arduino boards, sensors, and basic programming concepts. The workshop culminated in a showcase where kids demonstrated their creations to parents and peers, including smart plant monitors, mini weather stations, and interactive LED displays.",
      longDescription:
        "This workshop was designed to introduce children to the exciting world of IoT and inspire the next generation of makers and technologists. The curriculum was structured to make technology accessible and fun while teaching fundamental concepts of electronics, programming, and problem-solving.\n\nDay 1 focused on basic electronics, introducing components like LEDs, resistors, and sensors. Day 2 covered Arduino programming fundamentals and simple circuits. Day 3 was dedicated to completing projects and preparing for the showcase exhibition where parents and community members could see the children's creations.\n\nThe workshop received overwhelmingly positive feedback from both participants and parents, with many children expressing interest in continuing to learn about technology and programming.",
      category: "kids",
      tags: ["IoT", "Arduino", "STEM Education", "Kids Workshop"],
      mainImage: "/workshop/workshop-9.jpg?height=500&width=800",
      gallery: [
        "/workshop/workshop-1.jpg?height=400&width=600",
        "/workshop/workshop-2.jpg?height=400&width=600",
        "/workshop/workshop-3.jpg?height=400&width=600",
        "/workshop/workshop-5.jpg?height=400&width=600",
        "/workshop/workshop-6.jpg?height=400&width=600",
        "/workshop/workshop-7.jpg?height=400&width=600",
        "/workshop/workshop-9.jpg?height=400&width=600",
        "/workshop/workshop-11.jpg?height=400&width=600",
        "/workshop/workshop-12.jpg?height=400&width=600",
      ],
      materials: [
        { name: "Workshop Slides", url: "#" },
        { name: "Project Guide", url: "#" },
      ],
    }


  ]

  const filteredWorkshops =
    activeTab === "all" ? workshops : workshops.filter((workshop) => workshop.category === activeTab)

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-white to-zinc-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-indigo-500">
                <AnimatedText text="Educational Workshops & Training" />
              </h1>
              <p className="text-xl text-zinc-600 mb-8">
                <AnimatedText
                  text="Empowering others through interactive learning experiences in technology, game development, and digital skills."
                  delay={0.3}
                />
              </p>
            </div>
          </div>
        </section>

        {/* Workshops Section */}
        <section className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <Tabs defaultValue="all" className="w-full max-w-5xl mx-auto" onValueChange={setActiveTab}>
              <div className="flex justify-center mb-8">
                <TabsList>
                  <TabsTrigger value="all">All Workshops</TabsTrigger>
                  <TabsTrigger value="kids">Kids</TabsTrigger>
                  <TabsTrigger value="teens">Teens</TabsTrigger>
                  <TabsTrigger value="professional">Professional</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value={activeTab} className="space-y-12">
                {filteredWorkshops.map((workshop, index) => (
                  <motion.div
                    key={workshop.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <GlassmorphicPanel className="overflow-hidden">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="relative h-64 md:h-auto">
                          <Image
                            src={workshop.mainImage || "/placeholder.svg"}
                            alt={workshop.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="p-6">
                          <h3 className="text-2xl font-bold text-zinc-800 mb-3">{workshop.title}</h3>

                          <div className="flex flex-col gap-2 mb-4">
                            <div className="flex items-center text-sm text-zinc-600">
                              <Calendar className="w-4 h-4 mr-2 text-sky-500" />
                              {workshop.date}
                            </div>
                            <div className="flex items-center text-sm text-zinc-600">
                              <MapPin className="w-4 h-4 mr-2 text-indigo-500" />
                              {workshop.location}
                            </div>
                            <div className="flex items-center text-sm text-zinc-600">
                              <Users className="w-4 h-4 mr-2 text-sky-500" />
                              {workshop.participants}
                            </div>
                          </div>

                          <p className="text-zinc-600 mb-4">{workshop.description}</p>

                          <div className="flex flex-wrap gap-2 mb-6">
                            {workshop.tags.map((tag, i) => (
                              <Badge key={i} className="bg-sky-100 text-sky-800 hover:bg-sky-200 border-none">
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          <Button
                            onClick={() => {
                              document.getElementById(workshop.id)?.scrollIntoView({ behavior: "smooth" })
                            }}
                            className="bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white border-none"
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </GlassmorphicPanel>
                  </motion.div>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Workshop Details Sections */}
        {workshops.map((workshop) => (
          <section
            key={workshop.id}
            id={workshop.id}
            className="py-16 bg-gradient-to-b from-zinc-50 to-white scroll-mt-20"
          >
            <div className="container px-4 md:px-6">
              <div className="max-w-5xl mx-auto">
                <GlassmorphicPanel className="p-8">
                  <h2 className="text-3xl font-bold mb-6 text-zinc-800">{workshop.title}</h2>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="space-y-2">
                      <h3 className="font-medium text-sky-500">Date</h3>
                      <p className="text-zinc-700">{workshop.date}</p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-medium text-sky-500">Location</h3>
                      <p className="text-zinc-700">{workshop.location}</p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-medium text-sky-500">Participants</h3>
                      <p className="text-zinc-700">{workshop.participants}</p>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h3 className="text-xl font-medium mb-4 text-zinc-800">About This Workshop</h3>
                    <div className="text-zinc-700 space-y-4">
                      {workshop.longDescription.split("\n\n").map((paragraph, i) => (
                        <p key={i}>{paragraph}</p>
                      ))}
                    </div>
                  </div>

                  <div className="mb-8">
                    <h3 className="text-xl font-medium mb-4 text-zinc-800">Gallery</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {workshop.gallery.map((image, i) => (
                        <div key={i} className="relative aspect-video rounded-lg overflow-hidden">
                          <Image
                            src={image || "/placeholder.svg"}
                            alt={`${workshop.title} - Image ${i + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {workshop.materials.length > 0 && (
                    <div>
                      <h3 className="text-xl font-medium mb-4 text-zinc-800">Workshop Materials</h3>
                      <div className="flex flex-wrap gap-4">
                        {workshop.materials.map((material, i) => (
                          <Button key={i} variant="outline" asChild className="gap-2">
                            <a href={material.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink size={16} />
                              {material.name}
                            </a>
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </GlassmorphicPanel>
              </div>
            </div>
          </section>
        ))}

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-zinc-50 to-white">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-indigo-500">
                Interested in a Custom Workshop?
              </h2>
              <p className="text-xl text-zinc-600 mb-8">
                I can design tailored workshops for your school, company, or organization on various technology topics
                including game development, programming, IoT, and more.
              </p>
              <Button
                className="bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white border-none"
                size="lg"
                asChild
              >
                <a href="/#contact">Get in Touch</a>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
