"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Download, Menu, X } from "lucide-react"

interface NavbarProps {
  onScrollToSection?: (sectionId: string) => void
  isHomePage?: boolean
}

export default function Navbar({ onScrollToSection, isHomePage = false }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  const handleScroll = () => {
    setScrolled(window.scrollY > 10)
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const handleSectionClick = (sectionId: string) => {
    setMobileMenuOpen(false)
    if (isHomePage && onScrollToSection) {
      onScrollToSection(sectionId)
    }
  }

  const isActive = (path: string) => pathname === path

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${scrolled ? "border-zinc-200 backdrop-blur-md bg-white/80" : "border-transparent bg-white/0"
        }`}
    >
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <Link href="/" className="text-xl font-bold tracking-tighter relative group">
          <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-indigo-500">
            ARVINTH RUCKSHAN
          </span>
          <span className="absolute -inset-1 rounded-lg bg-gradient-to-r from-sky-500/10 to-indigo-500/10 blur group-hover:blur-md transition-all duration-300"></span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {isHomePage ? (
            <>
              <button
                onClick={() => handleSectionClick("about")}
                className="text-sm hover:text-sky-500 transition-colors relative group"
              >
                About
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-sky-500 group-hover:w-full transition-all duration-300"></span>
              </button>
              <button
                onClick={() => handleSectionClick("projects")}
                className="text-sm hover:text-sky-500 transition-colors relative group"
              >
                Projects
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-sky-500 group-hover:w-full transition-all duration-300"></span>
              </button>
              <button
                onClick={() => handleSectionClick("experience")}
                className="text-sm hover:text-sky-500 transition-colors relative group"
              >
                Experience
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-sky-500 group-hover:w-full transition-all duration-300"></span>
              </button>
              <button
                onClick={() => handleSectionClick("contact")}
                className="text-sm hover:text-sky-500 transition-colors relative group"
              >
                Contact
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-sky-500 group-hover:w-full transition-all duration-300"></span>
              </button>
            </>
          ) : (
            <Link href="/" className="text-sm hover:text-sky-500 transition-colors relative group">
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-sky-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
          )}

          <Link
            href="/workshops"
            className={`text-sm hover:text-sky-500 transition-colors relative group ${isActive("/workshops") ? "text-sky-500" : ""
              }`}
          >
            Workshops
            {isActive("/workshops") && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-sky-500"></span>}
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-sky-500 group-hover:w-full transition-all duration-300"></span>
          </Link>

          <Link
            href="/blog"
            className={`text-sm hover:text-sky-500 transition-colors relative group ${isActive("/blog") ? "text-sky-500" : ""
              }`}
          >
            Blog
            {isActive("/blog") && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-sky-500"></span>}
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-sky-500 group-hover:w-full transition-all duration-300"></span>
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-zinc-800 hover:text-sky-500 transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Resume Button */}
        <a
          href="/resume/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:flex items-center gap-2 bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white border-none px-4 py-2 rounded-md font-medium text-sm transition-all duration-300"
        >
          Resume <Download size={16} />
        </a>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          className="fixed inset-0 z-40 bg-white/95 backdrop-blur-md pt-20 px-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <nav className="flex flex-col items-center gap-8 text-lg">
            {isHomePage ? (
              <>
                <button onClick={() => handleSectionClick("about")} className="hover:text-sky-500 transition-colors">
                  About
                </button>
                <button onClick={() => handleSectionClick("projects")} className="hover:text-sky-500 transition-colors">
                  Projects
                </button>
                <button
                  onClick={() => handleSectionClick("experience")}
                  className="hover:text-sky-500 transition-colors"
                >
                  Experience
                </button>
                <button onClick={() => handleSectionClick("contact")} className="hover:text-sky-500 transition-colors">
                  Contact
                </button>
              </>
            ) : (
              <Link href="/" className="hover:text-sky-500 transition-colors">
                Home
              </Link>
            )}

            <Link
              href="/workshops"
              className={`hover:text-sky-500 transition-colors ${isActive("/workshops") ? "text-sky-500" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Workshops
            </Link>

            <Link
              href="/blog"
              className={`hover:text-sky-500 transition-colors ${isActive("/blog") ? "text-sky-500" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Blog
            </Link>

            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white border-none px-4 py-2 rounded-md font-medium text-sm transition-all duration-300 w-full justify-center"
            >
              Resume <Download size={16} />
            </a>
          </nav>
        </motion.div>
      )}
    </header>
  )
}