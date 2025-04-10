"use client"

import { motion } from "framer-motion"
import { Briefcase, GraduationCap, Code, Smartphone } from "lucide-react"

export default function ExperienceTimeline() {
  const experiences = [
    {
      title: "Assistant Lecturer",
      company: "MogoMedia Academy",
      period: "2024 - Present",
      description:
        "Teaching game development concepts, mentoring students, and providing hands-on guidance with Unreal Engine (C++ and Blueprints), Unity (C#), and game design principles.",
      icon: <GraduationCap className="h-6 w-6 text-white" />,
      color: "bg-sky-500",
    },
    {
      title: "Mobile Developer",
      company: "DevTrio, UK",
      period: "2024 - Present",
      description:
        "Working on mobile app development using modern cross-platform tools. Collaborating remotely with international teams and focusing on performance, UI/UX, and efficient development cycles.",
      icon: <Smartphone className="h-6 w-6 text-white" />,
      color: "bg-indigo-500",
    },
    {
      title: "Game Programmer (Spl.Network-programming)",
      company: "Ram Studios",
      period: "2023 - Present",
      description:
        "Developing games using Unreal Engine (C++) and collaborating with cross-functional teams to create immersive gaming experiences.",
      icon: <Briefcase className="h-6 w-6 text-white" />,
      color: "bg-sky-500",
    },
    {
      title: "Software Engineer",
      company: "INIVOS",
      period: "2023 - Present",
      description:
        "Developing enterprise applications using the IFS framework, implementing solutions and ensuring software quality and performance.",
      icon: <Code className="h-6 w-6 text-white" />,
      color: "bg-indigo-500",
    },
    {
      title: "Game Developer - Freelancer",
      company: "Ruckshan Industires",
      period: "2015 - Present",
      description:
        "Worked on various indie game projects, primarily using Unreal Engine with C++ and Blueprints for gameplay mechanics and system design, alongside Unity and C# for UI development and additional gameplay features.",
      icon: <Briefcase className="h-6 w-6 text-white" />,
      color: "bg-sky-500",
    },
  ]

  return (
    <div className="max-w-3xl mx-auto">
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-sky-500 to-indigo-500" />

        {/* Timeline items */}
        <div className="space-y-12">
          {experiences.map((experience, index) => (
            <motion.div
              key={index}
              className="relative pl-12"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              {/* Icon */}
              <div className={`absolute left-0 p-2 rounded-full ${experience.color} shadow-lg`}>{experience.icon}</div>

              {/* Content */}
              <div className="bg-white rounded-lg shadow-sm border border-zinc-100 p-6 hover:shadow-md transition-all duration-300">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-zinc-800">{experience.title}</h3>
                    <p className="text-zinc-600">{experience.company}</p>
                  </div>
                  <span className="text-sm text-zinc-500 bg-zinc-100 px-2 py-1 rounded-full">{experience.period}</span>
                </div>
                <p className="text-zinc-600">{experience.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
