"use client"

import { useRef, useState, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { PerspectiveCamera, Environment, useGLTF, Text3D, Center } from "@react-three/drei"
import { useInView } from "framer-motion"

function FloatingModel({ position, scale = 1, rotation = [0, 0, 0], color = "#00eeff" }) {
  const modelRef = useRef()

  useFrame((state) => {
    if (modelRef.current) {
      modelRef.current.rotation.y = state.clock.elapsedTime * 0.2
      modelRef.current.position.y += Math.sin(state.clock.elapsedTime) * 0.002
    }
  })

  // Use duck.glb as a placeholder
  const { scene } = useGLTF("/assets/3d/duck.glb")

  // Clone the scene to avoid modifying the original
  const clonedScene = scene.clone()

  // Apply color to all meshes in the scene
  clonedScene.traverse((child) => {
    if (child.isMesh) {
      child.material = child.material.clone()
      child.material.color.set(color)
      child.material.emissive?.set(color)
      child.material.emissiveIntensity = 0.8
    }
  })

  return <primitive ref={modelRef} object={clonedScene} position={position} scale={scale} rotation={rotation} />
}

function FloatingText({ text, position, color = "#8a2be2" }) {
  const textRef = useRef()

  useFrame((state) => {
    if (textRef.current) {
      textRef.current.position.y += Math.sin(state.clock.elapsedTime) * 0.002
      textRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })

  return (
    <Center position={position} ref={textRef}>
      <Text3D font="/fonts/Inter_Bold.json" size={0.5} height={0.1} curveSegments={12}>
        {text}
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.2} />
      </Text3D>
    </Center>
  )
}

function Scene() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 2, 10]} fov={60} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#00eeff" />
      <pointLight position={[-10, -10, -10]} intensity={1} color="#ff1493" />

      <FloatingModel position={[-4, 0, 0]} scale={2} color="#00eeff" />
      <FloatingModel position={[4, 0, 0]} scale={2} color="#ff1493" rotation={[0, Math.PI, 0]} />

      <FloatingText text="PROJECTS" position={[0, 2, 0]} color="#8a2be2" />

      <Environment preset="studio" />
    </>
  )
}

export default function ProjectsScene() {
  const ref = useRef(null)
  const isInView = useInView(ref)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div ref={ref} className="w-full h-[300px]">
      {isInView && (
        <Canvas>
          <Scene />
        </Canvas>
      )}
    </div>
  )
}
