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
      title: "Weather Kids: Building Smart Society",
      date: "June 03, 2023",
      location: "Nuwara Eliya",
      participants: "25+ children ages 10-18",
      description:
        "The ‘Weather Kids’ program, in collaboration with Gavesha and UNICEF, talented young minds through hands-on workshops focused on weather science, IoT engineering, and career exploration in tech. The program included building weather stations, creating IoT-controlled cars, and learning about IoT careers, inspiring the future tech leaders of tomorrow.",
      longDescription:
        "The ‘Weather Kids’ program, a collaborative initiative with Gavesha and UNICEF, provided a transformative learning experience for youth interested in weather science and IoT technology. Through four engaging workshops, young participants developed their skills in building weather stations, presenting weather forecasts like professional meteorologists, and creating remote-controlled IoT cars using ESP-32 and the Gavesha app. The program culminated in career guidance in IoT, inspiring the next generation of tech leaders. This initiative not only equipped participants with practical skills but also sparked their curiosity and passion for technology, setting them on a path toward limitless possibilities in the world of innovation",
      category: "kids",
      tags: ["IoT", "Micro-Controller", "STEM Education", "Kids Workshop","ESP-32"],
      mainImage: "/workshop-9.jpg",
      gallery: [
        "/workshop1.jpg",
        "/workshop-2.jpg",
        "/workshop-3.jpg",
        "/workshop-5.jpg",
        "/workshop-6.jpg",
        "/workshop-7.jpg",
        "/workshop-9.jpg",
        "/workshop-11.jpg",
        "/workshop-12.jpg",
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
