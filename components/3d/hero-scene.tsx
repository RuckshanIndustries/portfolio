"use client"

import { useRef, useState, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { PerspectiveCamera, Environment } from "@react-three/drei"
import { Vector3, MathUtils } from "three"
import { useInView } from "framer-motion"
import { Suspense } from "react"

function FloatingObject({ position, size = 1, color = "#00eeff", speed = 1, geometry = "box" }) {
  const meshRef = useRef()

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2 * speed
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3 * speed
      meshRef.current.position.y += Math.sin(state.clock.elapsedTime * speed) * 0.005
    }
  })

  const geometries = {
    box: <boxGeometry args={[size, size, size]} />,
    sphere: <sphereGeometry args={[size, 32, 32]} />,
    torus: <torusGeometry args={[size, size / 3, 16, 32]} />,
    cylinder: <cylinderGeometry args={[size / 2, size / 2, size, 32]} />,
    cone: <coneGeometry args={[size / 2, size, 32]} />,
  }

  return (
    <mesh ref={meshRef} position={position}>
      {geometries[geometry]}
      <meshStandardMaterial color={color} metalness={0.7} roughness={0.1} emissive={color} emissiveIntensity={0.5} />
    </mesh>
  )
}

function Scene() {
  const cameraRef = useRef()

  useFrame(({ mouse, viewport }) => {
    if (cameraRef.current) {
      cameraRef.current.position.x = MathUtils.lerp(cameraRef.current.position.x, mouse.x * 2, 0.05)
      cameraRef.current.position.y = MathUtils.lerp(cameraRef.current.position.y, mouse.y * 1, 0.05)
      cameraRef.current.lookAt(new Vector3(0, 0, 0))
    }
  })

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 0, 15]} fov={60} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#00eeff" />
      <pointLight position={[-10, -10, -10]} intensity={1} color="#ff1493" />

      <FloatingObject position={[-8, 0, -5]} size={1.5} color="#00eeff" speed={0.7} geometry="box" />
      <FloatingObject position={[8, 2, -3]} size={1} color="#8a2be2" speed={1.2} geometry="sphere" />
      <FloatingObject position={[6, -2, -4]} size={1.2} color="#00eeff" speed={0.9} geometry="torus" />
      <FloatingObject position={[-6, -1, -2]} size={0.8} color="#ff1493" speed={1.1} geometry="cylinder" />
      <FloatingObject position={[0, 5, -3]} size={2} color="#00eeff" speed={0.5} geometry="cone" />

      <Environment preset="studio" />
    </>
  )
}

export default function HeroScene() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false })
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <div ref={ref} style={{ width: "100%", height: "100%" }}>
      {isInView && (
        <Canvas
          gl={{ antialias: true }}
          onCreated={(state) => {
            state.gl.setClearColor(0x000000, 0)
          }}
        >
          <Suspense fallback={null}>
            {/* Temporarily use simple box for debugging */}
            <ambientLight intensity={0.5} />
            <mesh>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="#00eeff" />
            </mesh>
            {/* Uncomment to restore full scene after confirming fix */}
            {/* <Scene /> */}
          </Suspense>
        </Canvas>
      )}
    </div>
  )
}