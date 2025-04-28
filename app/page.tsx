"use client"

import { Suspense, useRef } from "react"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import dynamic from "next/dynamic"
import AnimatedText from "@/components/animated-text"
import ExperienceTimeline from "@/components/experience-timeline"
import ProjectCard from "@/components/project-card"
import WorkshopCard from "@/components/workshop-card"
import LoadingSpinner from "@/components/loading-spinner"
import ParticleField from "@/components/particle-field"
import GlassmorphicPanel from "@/components/glassmorphic-panel"
import { motion, useScroll, useTransform } from "framer-motion"
import ProfileImage from "@/components/profile-image"
import Navbar from "@/components/navbar"
import SocialLinks from "@/components/social-links"
import TechStackDisplay from "@/components/tech-stack-display"
import ContactForm from "./contect"
import SkillsScene from "@/components/skills-scene"

// Dynamically import 3D components to avoid SSR issues
const HeroScene = dynamic(() => import("@/components/3d/hero-scene"), {
  ssr: false,
  loading: () => <LoadingSpinner />,
})

const ProjectsScene = dynamic(() => import("@/components/3d/projects-scene"), {
  ssr: false,
  loading: () => <LoadingSpinner />,
})

export default function Home() {
  // Refs for scroll functionality
  const aboutRef = useRef<HTMLElement>(null)
  const projectsRef = useRef<HTMLElement>(null)
  const workshopsRef = useRef<HTMLElement>(null)
  const experienceRef = useRef<HTMLElement>(null)
  const contactRef = useRef<HTMLElement>(null)

  // Scroll to section function
  const scrollToSection = (sectionId: string) => {
    const sectionRefs = {
      about: aboutRef,
      projects: projectsRef,
      workshops: workshopsRef,
      experience: experienceRef,
      contact: contactRef,
    }

    const ref = sectionRefs[sectionId as keyof typeof sectionRefs]

    if (ref && ref.current) {
      window.scrollTo({
        top: ref.current.offsetTop - 80, // Adjust for header height
        behavior: "smooth",
      })
    }
  }

  // Parallax effect for hero section
  const { scrollY } = useScroll()
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0])
  const heroY = useTransform(scrollY, [0, 300], [0, 100])

  return (
    <div className="min-h-screen bg-white text-zinc-800 overflow-hidden">
      {/* Header */}
      <Navbar onScrollToSection={scrollToSection} isHomePage={true} />

      {/* Hero Section with 3D and Profile Image */}
      <section ref={aboutRef} className="relative min-h-screen flex items-center justify-center pt-16 md:pt-0">
        <div className="absolute inset-0 z-0">
          <Suspense fallback={<LoadingSpinner />}>
            <HeroScene />
          </Suspense>
        </div>
        <motion.div
          className="container relative z-10 px-4 md:px-6 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16"
          style={{ opacity: heroOpacity, y: heroY }}
        >
          {/* Profile Image */}
          <ProfileImage />

          {/* Hero Content */}
          <GlassmorphicPanel className="p-8 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-zinc-800">
                <AnimatedText text="Game Developer & Software Engineer" />
              </h1>
              <p className="max-w-[700px] text-zinc-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                <AnimatedText
                  text="Building futuristic worlds in code. Crafting immersive experiences and robust applications."
                  delay={0.5}
                />
              </p>
              <div className="flex flex-col sm:flex-row justify-start gap-4 pt-4">
                <Button
                  onClick={() => scrollToSection("projects")}
                  className="bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white border-none"
                >
                  View Projects <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => scrollToSection("contact")}
                  className="border-zinc-300 hover:bg-zinc-100 text-zinc-800"
                >
                  Contact Me
                </Button>
              </div>

              {/* Social Links */}
              <SocialLinks />
            </motion.div>
          </GlassmorphicPanel>
        </motion.div>
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <button
            onClick={() => scrollToSection("projects")}
            className="text-zinc-400 hover:text-sky-500 transition-colors"
            aria-label="Scroll to projects"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </button>
        </div>
      </section>

      {/* About Me Section */}
      <section className="py-24 relative bg-gradient-to-b from-white to-zinc-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-indigo-500">
                <AnimatedText text="About Me" />
              </h2>
              <p className="max-w-[700px] text-zinc-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto">
                <AnimatedText
                  text="A passionate developer with expertise in game development and software engineering."
                  delay={0.3}
                />
              </p>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <GlassmorphicPanel className="p-8">
              <div className="space-y-6 text-zinc-700">
                <p>
                  With over 7 years in game development and 2.5 years in software engineering, I've built a diverse
                  skill set that spans multiple technologies and platforms. My journey began with a passion for creating
                  interactive experiences, which led me to explore both game engines and enterprise software
                  development.
                </p>
                <p>
                  In game development, I've worked extensively with Unreal Engine (C++) and Unity (C#), creating
                  immersive worlds and engaging gameplay mechanics. My experience includes everything from physics
                  simulations and AI programming to shader development and optimization.
                </p>
                <p>
                  As a software engineer, I've specialized in Java development with the IFS framework, building robust
                  enterprise applications that solve complex business problems. I'm proficient in database design, API
                  development, and implementing scalable solutions.
                </p>
                <p>
                  Currently, I'm balancing roles as a game developer at Ram Studios, a game development assistant
                  lecturer at MogoMedia Academy, and a software engineer at INIVOS. This multifaceted experience allows
                  me to bring unique perspectives to each project I undertake.
                </p>
              </div>
            </GlassmorphicPanel>
          </div>
        </div>
      </section>

      {/* Tech Stack Display */}
      <section className="py-12 relative">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-indigo-500">
                <AnimatedText text="My Tech Stack" />
              </h2>
              <p className="max-w-[700px] text-zinc-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto">
                <AnimatedText text="The technologies and tools I use to bring ideas to life." delay={0.3} />
              </p>
            </div>
          </div>

          <TechStackDisplay />
        </div>
      </section>

      {/* Projects Section with Particles */}
      <section ref={projectsRef} className="py-24 relative">
        <div className="absolute inset-0 z-0">
          <ParticleField />
        </div>
        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-indigo-500">
                <AnimatedText text="Featured Projects" />
              </h2>
              <p className="max-w-[700px] text-zinc-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto">
                <AnimatedText text="A selection of my work in game development and software engineering." delay={0.3} />
              </p>
            </div>
          </div>

          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2">
            <ProjectCard
              title="Bioware"
              category="Game Development"
              description="Bioaware is an open and closed world RPG where a hero battles a villain-spread virus and fights to destroy the enemy’s stronghold to save humanity."
              technologies={["Unreal Engine", "C++", "Blueprint", "Maximo"]}
              imageUrl="./Bio5.png"
              modelType="fantasy"
              liveUrl="https://ruckshanindustries.itch.io/bioware"
            // githubUrl="https://github.com/yourusername/adventure-quest"

            />
            <ProjectCard
              title="ForsakenValor"
              category="Game Development"
              description="Forsaken Valor is an RPG where an outcast boy, self-taught in archery and swordsmanship, rises to save his town from a deadly ghost disaster."
              technologies={["Unreal Engine", "C++", "Shader Programming", "Procedural Generation"]}
              imageUrl="./fv.png"
              modelType="space"
            // githubUrl="https://github.com/yourusername/space-explorer"
            // liveUrl="https://example.com/space-exploerer-demo"
            />
            <ProjectCard
              title="Bingo"
              category="Game Development"
              description="An Endless Runner Game."
              technologies={["Unreal Engine", "C++", "Blueprints"]}
              imageUrl="./Bingo4.png"
              modelType="space"
            //githubUrl="https://github.com/yourusername/space-explorer"
            //liveUrl="https://example.com/space-explorer-demo"
            />
            <ProjectCard
              title="Fire in the hell"
              category="Game Development"
              description="A Multiplayer Game like Bomber man in 3D."
              technologies={["Unreal Engine", "C++", "Blueprints", "Steam Plugin Integration"]}
              imageUrl="./fih.png"
              modelType="space"
            // githubUrl="https://github.com/yourusername/space-explorer"
            //liveUrl="https://example.com/space-explorer-demo"
            />
            <ProjectCard
              title="Tailoring Mobile App - Jean"
              category="Mobile Development"
              description="Its A suits Designing platform that will export the image will multiple combination.
              Made this for a customer in freelancing he higly stsified."
              technologies={["C#", "Firebase", "MAUI", "REST API"]}
              imageUrl="./jean.png"
              modelType="data"
              githubUrl="https://github.com/RuckshanIndustries/jean"
            />
            <ProjectCard
              title="Pet-Care Mobile App"
              category="Mobile Development"
              description="Pet-Care is a mobile app that helps you manage your pet’s health, schedule vet visits, track feeding, and get daily care tips — all in one place."
              technologies={["Flutter", "Firebase", "Supabase", "REST API"]}
              imageUrl="./petcare.png"
              modelType="data"
              githubUrl="https://github.com/RuckshanIndustries/petcarer"
            />
            <ProjectCard
              title="Ticket Booking"
              category="Software Engineering"
              description="Ticket Booking is a fast and easy mobile app to book tickets for movies — anytime, anywhere."
              technologies={["Java", "Spring Boot", "MySQL"]}
              imageUrl="./tsf.png"
              modelType="tech"
              githubUrl="https://github.com/RuckshanIndustries/ticketing-system-backend"
            // liveUrl="https://example.com/inventory-system-demo"
            />
          </div>
        </div>

        <div className="relative z-10 mt-16">
          <Suspense fallback={<LoadingSpinner />}>
            <ProjectsScene />
          </Suspense>
        </div>
      </section>


      {/* Workshops Section */}
      <section ref={workshopsRef} className="py-24 relative bg-gradient-to-b from-white to-zinc-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-indigo-500">
                <AnimatedText text="Educational Workshops" />
              </h2>
              <p className="max-w-[700px] text-zinc-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto">
                <AnimatedText
                  text="Sharing knowledge and inspiring the next generation of technologists."
                  delay={0.3}
                />
              </p>
            </div>
          </div>

          <div className="max-w-5xl mx-auto space-y-12">
            <WorkshopCard
                   title = "Weather Kids: Building Smart Society"
                   date= "June 03, 2023"
                   location= "Nuwara Eliya"
                   participants= "25+ children ages 10-18"
                   description= "The ‘Weather Kids’ program, in collaboration with Gavesha and UNICEF, talented young minds through hands-on workshops focused on weather science, IoT engineering, and career exploration in tech. The program included building weather stations, creating IoT-controlled cars, and learning about IoT careers, inspiring the future tech leaders of tomorrow."
                   

              imageUrl="./workshop1.jpg?height=500&width=800"
            />

            <Button
              asChild
              className="mx-auto bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white border-none"
            >
              <a href="/workshops">View All Workshops</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section ref={experienceRef} className="py-24 relative">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-indigo-500">
                <AnimatedText text="Professional Journey" />
              </h2>
              <p className="max-w-[700px] text-zinc-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto">
                <AnimatedText text="My career path in game development and software engineering." delay={0.3} />
              </p>
            </div>
          </div>

          <ExperienceTimeline />
        </div>
      </section>

      {/* Contact Section */}
      <section ref={contactRef} className="py-24 relative bg-gradient-to-b from-zinc-50 to-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-indigo-500">
                <AnimatedText text="Get In Touch" />
              </h2>
              <p className="max-w-[700px] text-zinc-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto">
                <AnimatedText text="Interested in working together? Let's connect." delay={0.3} />
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">

            <ContactForm />


            <GlassmorphicPanel className="p-6">
              <h3 className="text-xl font-bold mb-4 text-zinc-800">Connect With Me</h3>
              <div className="space-y-4">
                <a
                  href="mailto:arvinthdillruckshan3@gmail.com"
                  className="flex items-center space-x-3 p-4 rounded-lg border border-zinc-200 hover:border-sky-500/50 hover:bg-zinc-50 transition-all duration-300 group"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-sky-500 group-hover:text-sky-600"
                  >
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  <span className="group-hover:text-sky-600 transition-colors">Email</span>
                </a>
                <a
                  href="https://github.com/RuckshanIndustries"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-4 rounded-lg border border-zinc-200 hover:border-indigo-500/50 hover:bg-zinc-50 transition-all duration-300 group"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-indigo-500 group-hover:text-indigo-600"
                  >
                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                    <path d="M9 18c-4.51 2-5-2-7-2" />
                  </svg>
                  <span className="group-hover:text-indigo-600 transition-colors">Github</span>
                </a>
                <a
                  href="https://linkedin.com/in/arvinthdillruckshan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-4 rounded-lg border border-zinc-200 hover:border-sky-500/50 hover:bg-zinc-50 transition-all duration-300 group"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-sky-500 group-hover:text-sky-600"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect x="2" y="9" width="4" height="12" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                  <span className="group-hover:text-sky-600 transition-colors">Linkedin</span>
                </a>
              </div>
            </GlassmorphicPanel>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-white">
        <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <p className="text-center text-sm leading-loose text-zinc-600 md:text-left">
              © {new Date().getFullYear()} Portfolio. All rights reserved.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="text-sm text-zinc-600 hover:text-sky-500 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-zinc-600 hover:text-indigo-500 transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}