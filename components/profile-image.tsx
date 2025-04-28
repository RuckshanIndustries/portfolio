"use client"

import Image from "next/image"
import { motion, useAnimation } from "framer-motion"
import { useEffect, useState } from "react"

export default function ProfileImage() {
  const [isHovered, setIsHovered] = useState(false)
  const controls = useAnimation()

  useEffect(() => {
    if (isHovered) {
      controls.start({
        scale: 1.05,
        boxShadow: "0 0 25px rgba(14, 165, 233, 0.5), 0 0 10px rgba(99, 102, 241, 0.3)",
        transition: { duration: 0.3 },
      })
    } else {
      controls.start({
        scale: 1,
        boxShadow: "0 0 15px rgba(14, 165, 233, 0.3), 0 0 5px rgba(99, 102, 241, 0.2)",
        transition: { duration: 0.3 },
      })
    }
  }, [isHovered, controls])

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.div className="relative w-64 h-64 md:w-72 md:h-72 rounded-full overflow-hidden" animate={controls}>
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-sky-500/20 to-indigo-500/20 animate-pulse" />
        <Image
          src="./profilepic.jpg"
          alt="Profile"
          width={300}
          height={300}
          className="rounded-full object-cover"
          priority
        />
      </motion.div>

      {/* Decorative elements */}
      {/* <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 opacity-5 blur-md animate-tilt" /> */}
      {/* <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-sky-500/20 to-indigo-500/20 blur-xl" /> */}

      {/* Orbit effect */}
      <motion.div
        className="absolute w-4 h-4 rounded-full bg-sky-500"
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
        style={{
          top: "50%",
          left: "50%",
          translateX: "-50%",
          translateY: "-50%",
          transformOrigin: "center center",
          offsetPath: "path('M 0, 0 m -120, 0 a 120,120 0 1,0 240,0 a 120,120 0 1,0 -240,0')",
        }}
      />

      <motion.div
        className="absolute w-3 h-3 rounded-full bg-indigo-500"
        animate={{
          rotate: -360,
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
        style={{
          top: "50%",
          left: "50%",
          translateX: "-50%",
          translateY: "-50%",
          transformOrigin: "center center",
          offsetPath: "path('M 0, 0 m -140, 0 a 140,140 0 1,0 280,0 a 140,140 0 1,0 -280,0')",
        }}
      />
    </motion.div>
  )
}
