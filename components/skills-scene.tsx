"use client"

import { useRef, useState, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Text, Float, PerspectiveCamera, Environment } from "@react-three/drei"
import { MathUtils } from "three"
import { useInView } from "framer-motion"

function FloatingSkill({ text, position, color, size = 0.5, speed = 1 }) {
  const textRef = useRef()
  const [hover, setHover] = useState(false)

  useFrame((state) => {
    if (textRef.current) {
      textRef.current.position.y += Math.sin(state.clock.elapsedTime * speed) * 0.002
      textRef.current.rotation.y = MathUtils.lerp(textRef.current.rotation.y, hover ? 0.2 : 0, 0.05)
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <Text
        ref={textRef}
        position={position}
        fontSize={size}
        color={color}
        font="/fonts/Geist-Bold.ttf"
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
        maxWidth={10}
        textAlign="center"
      >
        {text}
      </Text>
    </Float>
  )
}

function Scene() {
  const cameraRef = useRef()

  useFrame(({ mouse, viewport }) => {
    if (cameraRef.current) {
      cameraRef.current.position.x = MathUtils.lerp(cameraRef.current.position.x, mouse.x * 2, 0.05)
      cameraRef.current.position.y = MathUtils.lerp(cameraRef.current.position.y, mouse.y * 1, 0.05)
    }
  })

  const gameSkills = [
    { text: "Unreal Engine", position: [-5, 3, -2], color: "#9333ea", size: 0.6, speed: 0.7 },
    { text: "Unity", position: [4, 2, -3], color: "#06b6d4", size: 0.6, speed: 0.8 },
    { text: "C++", position: [-3, -2, -1], color: "#9333ea", size: 0.7, speed: 0.9 },
    { text: "C#", position: [3, -3, -2], color: "#06b6d4", size: 0.7, speed: 1 },
    { text: "3D Modeling", position: [0, 4, -4], color: "#9333ea", size: 0.5, speed: 0.6 },
  ]

  const softwareSkills = [
    { text: "Java", position: [-6, 0, -5], color: "#06b6d4", size: 0.6, speed: 0.7 },
    { text: "IFS", position: [6, 0, -4], color: "#9333ea", size: 0.5, speed: 0.8 },
    { text: "SQL", position: [-4, -4, -3], color: "#06b6d4", size: 0.5, speed: 0.9 },
    { text: "REST API", position: [5, -1, -2], color: "#9333ea", size: 0.5, speed: 1 },
    { text: "Git", position: [0, -5, -5], color: "#06b6d4", size: 0.6, speed: 0.6 },
  ]

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 0, 10]} fov={60} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#9333ea" />

      {gameSkills.map((skill, index) => (
        <FloatingSkill
          key={`game-${index}`}
          text={skill.text}
          position={skill.position}
          color={skill.color}
          size={skill.size}
          speed={skill.speed}
        />
      ))}

      {softwareSkills.map((skill, index) => (
        <FloatingSkill
          key={`software-${index}`}
          text={skill.text}
          position={skill.position}
          color={skill.color}
          size={skill.size}
          speed={skill.speed}
        />
      ))}

      <Environment preset="night" />
    </>
  )
}

export default function SkillsScene() {
  const ref = useRef(null)
  const isInView = useInView(ref)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div ref={ref} className="w-full h-full">
      {isInView && (
        <Canvas>
          <Scene />
        </Canvas>
      )}
    </div>
  )
}
