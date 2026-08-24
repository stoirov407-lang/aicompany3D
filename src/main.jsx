import React, { useRef } from 'react'
import { createRoot } from 'react-dom/client'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  OrbitControls,
  Environment,
  ContactShadows,
  Html,
} from '@react-three/drei'
import * as THREE from 'three'
import './office.css'

function Director() {
  const group = useRef()
  const head = useRef()
  const leftArm = useRef()
  const rightArm = useRef()
  const leftEye = useRef()
  const rightEye = useRef()
  const chest = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()

    if (!group.current) return

    // Relaxed breathing
    const breathing = Math.sin(t * 1.7) * 0.012
    group.current.position.y = 0.72 + breathing

    if (chest.current) {
      chest.current.scale.y = 1 + Math.sin(t * 1.7) * 0.018
    }

    // Slight "lazy / confident" body movement
    group.current.rotation.z = Math.sin(t * 0.55) * 0.018

    // Head movement
    if (head.current) {
      head.current.rotation.y =
        Math.sin(t * 0.65) * 0.12 +
        Math.sin(t * 0.21) * 0.05

      head.current.rotation.x =
        Math.sin(t * 0.45) * 0.025
    }

    // Small arm movements
    if (leftArm.current) {
      leftArm.current.rotation.z =
        -0.12 + Math.sin(t * 0.8) * 0.025
    }

    if (rightArm.current) {
      rightArm.current.rotation.z =
        0.12 + Math.sin(t * 0.7 + 1) * 0.025
    }

    // Natural blinking
    const blinkCycle = t % 5.2
    const blink =
      blinkCycle > 4.92
        ? Math.sin((blinkCycle - 4.92) / 0.28 * Math.PI)
        : 0

    const eyeScale = Math.max(0.08, 1 - blink)

    if (leftEye.current) {
      leftEye.current.scale.y = eyeScale
    }

    if (rightEye.current) {
      rightEye.current.scale.y = eyeScale
    }
  })

  return (
    <group ref={group} position={[0, 0.72, -0.65]}>

      {/* Office chair */}
      <group position={[0, 0.48, 0.22]}>
        <mesh castShadow position={[0, 0.55, 0]}>
          <boxGeometry args={[0.72, 0.85, 0.18]} />
          <meshStandardMaterial
            color="#202020"
            roughness={0.38}
          />
        </mesh>

        <mesh castShadow position={[0, 0.12, 0.03]}>
          <boxGeometry args={[0.9, 0.16, 0.78]} />
          <meshStandardMaterial
            color="#181818"
            roughness={0.4}
          />
        </mesh>

        {/* Chair column */}
        <mesh position={[0, -0.22, 0]}>
          <cylinderGeometry args={[0.055, 0.055, 0.48, 20]} />
          <meshStandardMaterial color="#777875" metalness={0.55} />
        </mesh>

        {/* Chair base */}
        <mesh position={[0, -0.46, 0]}>
          <cylinderGeometry args={[0.34, 0.34, 0.06, 32]} />
          <meshStandardMaterial
            color="#777875"
            metalness={0.5}
            roughness={0.35}
          />
        </mesh>
      </group>

      {/* BODY */}
      <group ref={chest} position={[0, 1.28, -0.05]}>

        {/* White shirt */}
        <mesh castShadow>
          <boxGeometry args={[0.62, 0.62, 0.38]} />
          <meshStandardMaterial
            color="#f8f8f5"
            roughness={0.32}
          />
        </mesh>

        {/* Black suit jacket */}
        <mesh
          castShadow
          position={[0, 0, -0.015]}
        >
          <boxGeometry args={[0.72, 0.62, 0.42]} />
          <meshStandardMaterial
            color="#151515"
            roughness={0.36}
          />
        </mesh>

        {/* Shirt opening */}
        <mesh position={[0, 0.02, 0.225]}>
          <boxGeometry args={[0.24, 0.48, 0.025]} />
          <meshStandardMaterial
            color="#ffffff"
            roughness={0.3}
          />
        </mesh>

        {/* Tie */}
        <mesh position={[0, -0.015, 0.25]}>
          <boxGeometry args={[0.065, 0.34, 0.035]} />
          <meshStandardMaterial
            color="#111111"
            roughness={0.25}
          />
        </mesh>

        <mesh position={[0, -0.19, 0.25]}>
          <coneGeometry args={[0.075, 0.12, 4]} />
          <meshStandardMaterial color="#111111" />
        </mesh>

        {/* Suit lapels */}
        <mesh
          position={[-0.16, 0.09, 0.235]}
          rotation={[0, 0, -0.35]}
        >
          <boxGeometry args={[0.045, 0.35, 0.035]} />
          <meshStandardMaterial color="#303030" />
        </mesh>

        <mesh
          position={[0.16, 0.09, 0.235]}
          rotation={[0, 0, 0.35]}
        >
          <boxGeometry args={[0.045, 0.35, 0.035]} />
          <meshStandardMaterial color="#303030" />
        </mesh>
      </group>

      {/* LEFT ARM */}
      <group
        ref={leftArm}
        position={[-0.39, 1.22, 0]}
        rotation={[0, 0, -0.12]}
      >
        <mesh castShadow>
          <capsuleGeometry args={[0.09, 0.45, 8, 16
