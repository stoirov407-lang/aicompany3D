import React, { useRef } from 'react'
import { createRoot } from 'react-dom/client'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  OrbitControls,
  Environment,
  ContactShadows,
  Html,
} from '@react-three/drei'
import './office.css'

function Director() {
  const group = useRef()
  const head = useRef()
  const leftArm = useRef()
  const rightArm = useRef()
  const chest = useRef()
  const leftEye = useRef()
  const rightEye = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()

    if (!group.current) return

    // Breathing
    group.current.position.y =
      0.72 + Math.sin(t * 1.6) * 0.012

    if (chest.current) {
      chest.current.scale.y =
        1 + Math.sin(t * 1.6) * 0.018
    }

    // Relaxed body movement
    group.current.rotation.z =
      Math.sin(t * 0.5) * 0.018

    // Head movement
    if (head.current) {
      head.current.rotation.y =
        Math.sin(t * 0.65) * 0.13 +
        Math.sin(t * 0.22) * 0.05

      head.current.rotation.x =
        Math.sin(t * 0.45) * 0.025
    }

    // Arms
    if (leftArm.current) {
      leftArm.current.rotation.z =
        -0.15 + Math.sin(t * 0.8) * 0.025
    }

    if (rightArm.current) {
      rightArm.current.rotation.z =
        0.15 + Math.sin(t * 0.7 + 1) * 0.025
    }

    // Blinking
    const cycle = t % 5.2
    const blink =
      cycle > 4.92
        ? Math.sin(((cycle - 4.92) / 0.28) * Math.PI)
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
    <group
      ref={group}
      position={[0, 0.72, -0.65]}
    >
      {/* CHAIR */}
      <group position={[0, 0.48, 0.22]}>
        <mesh
          castShadow
          position={[0, 0.55, 0]}
        >
          <boxGeometry args={[0.72, 0.85, 0.18]} />
          <meshStandardMaterial
            color="#202020"
            roughness={0.38}
          />
        </mesh>

        <mesh
          castShadow
          position={[0, 0.12, 0.03]}
        >
          <boxGeometry args={[0.9, 0.16, 0.78]} />
          <meshStandardMaterial
            color="#181818"
            roughness={0.4}
          />
        </mesh>

        <mesh position={[0, -0.22, 0]}>
          <cylinderGeometry
            args={[0.055, 0.055, 0.48, 20]}
          />
          <meshStandardMaterial
            color="#777875"
            metalness={0.55}
            roughness={0.35}
          />
        </mesh>

        <mesh position={[0, -0.46, 0]}>
          <cylinderGeometry
            args={[0.34, 0.34, 0.06, 32]}
          />
          <meshStandardMaterial
            color="#777875"
            metalness={0.5}
            roughness={0.35}
          />
        </mesh>
      </group>

      {/* BODY */}
      <group
        ref={chest}
        position={[0, 1.28, -0.05]}
      >
        {/* Shirt */}
        <mesh castShadow>
          <boxGeometry args={[0.62, 0.62, 0.38]} />
          <meshStandardMaterial
            color="#f8f8f5"
            roughness={0.32}
          />
        </mesh>

        {/* Suit */}
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

        {/* Lapels */}
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
          <capsuleGeometry
            args={[0.09, 0.45, 8, 16]}
          />
          <meshStandardMaterial
            color="#151515"
            roughness={0.4}
          />
        </mesh>

        <mesh position={[0, -0.29, 0.03]}>
          <sphereGeometry args={[0.105, 24, 16]} />
          <meshStandardMaterial
            color="#d9ad91"
            roughness={0.55}
          />
        </mesh>
      </group>

      {/* RIGHT ARM */}
      <group
        ref={rightArm}
        position={[0.39, 1.22, 0]}
        rotation={[0, 0, 0.12]}
      >
        <mesh castShadow>
          <capsuleGeometry
            args={[0.09, 0.45, 8, 16]}
          />
          <meshStandardMaterial
            color="#151515"
            roughness={0.4}
          />
        </mesh>

        <mesh position={[0, -0.29, 0.03]}>
          <sphereGeometry args={[0.105, 24, 16]} />
          <meshStandardMaterial
            color="#d9ad91"
            roughness={0.55}
          />
        </mesh>
      </group>

      {/* LEGS */}
      <group position={[0, 0.73, 0]}>
        <mesh
          position={[-0.17, -0.05, 0.04]}
          rotation={[0.15, 0, 0.08]}
          castShadow
        >
          <capsuleGeometry
            args={[0.105, 0.43, 8, 16]}
          />
          <meshStandardMaterial
            color="#171717"
            roughness={0.4}
          />
        </mesh>

        <mesh
          position={[0.17, -0.05, 0.04]}
          rotation={[0.15, 0, -0.08]}
          castShadow
        >
          <capsuleGeometry
            args={[0.105, 0.43, 8, 16]}
          />
          <meshStandardMaterial
            color="#171717"
            roughness={0.4}
          />
        </mesh>

        {/* Shoes */}
        <mesh
          position={[-0.2, -0.32, 0.12]}
          castShadow
        >
          <sphereGeometry args={[0.14, 24, 16]} />
          <meshStandardMaterial
            color="#0d0d0d"
            roughness={0.25}
          />
        </mesh>

        <mesh
          position={[0.2, -0.32, 0.12]}
          castShadow
        >
          <sphereGeometry args={[0.14, 24, 16]} />
          <meshStandardMaterial
            color="#0d0d0d"
            roughness={0.25}
          />
        </mesh>
      </group>

      {/* HEAD */}
      <group
        ref={head}
        position={[0, 1.95, 0]}
      >
        {/* Neck */}
        <mesh position={[0, -0.29, 0]}>
          <cylinderGeometry
            args={[0.11, 0.12, 0.2, 24]}
          />
          <meshStandardMaterial
            color="#d9ad91"
            roughness={0.55}
          />
        </mesh>

        {/* Face */}
        <mesh castShadow>
          <sphereGeometry args={[0.34, 40, 32]} />
          <meshStandardMaterial
            color="#e1b69a"
            roughness={0.5}
          />
        </mesh>

        {/* Ears */}
        <mesh position={[-0.33, 0, 0]}>
          <sphereGeometry args={[0.075, 20, 16]} />
          <meshStandardMaterial
            color="#d8aa8e"
            roughness={0.55}
          />
        </mesh>

        <mesh position={[0.33, 0, 0]}>
          <sphereGeometry args={[0.075, 20, 16]} />
          <meshStandardMaterial
            color="#d8aa8e"
            roughness={0.55}
          />
        </mesh>

        {/* Hair */}
        <mesh
          position={[0, 0.21, -0.005]}
          scale={[1.02, 0.6, 1.02]}
        >
          <sphereGeometry args={[0.35, 40, 24]} />
          <meshStandardMaterial
            color="#202020"
            roughness={0.32}
          />
        </mesh>

        {/* Hair front */}
        <mesh
          position={[0, 0.22, 0.25]}
          rotation={[0.15, 0, 0]}
        >
          <boxGeometry args={[0.46, 0.13, 0.08]} />
          <meshStandardMaterial color="#181818" />
        </mesh>

        {/* LEFT EYE */}
        <mesh
          ref={leftEye}
          position={[-0.125, 0.035, 0.315]}
        >
          <sphereGeometry args={[0.082, 32, 24]} />
          <meshStandardMaterial
            color="#ffffff"
            roughness={0.25}
          />
        </mesh>

        <mesh position={[-0.125, 0.035, 0.39]}>
          <sphereGeometry args={[0.037, 24, 20]} />
          <meshStandardMaterial
            color="#171717"
            roughness={0.2}
          />
        </mesh>

        {/* RIGHT EYE */}
        <mesh
          ref={rightEye}
          position={[0.125, 0.035, 0.315]}
        >
          <sphereGeometry args={[0.082, 32, 24]} />
          <meshStandardMaterial
            color="#ffffff"
            roughness={0.25}
          />
        </mesh>

        <mesh position={[0.125, 0.035, 0.39]}>
          <sphereGeometry args={[0.037, 24, 20]} />
          <meshStandardMaterial
            color="#171717"
            roughness={0.2}
          />
        </mesh>

        {/* Eyebrows */}
        <mesh
          position={[-0.125, 0.145, 0.335]}
          rotation={[0, 0, -0.12]}
        >
          <boxGeometry args={[0.14, 0.025, 0.025]} />
          <meshStandardMaterial color="#202020" />
        </mesh>

        <mesh
          position={[0.125, 0.145, 0.335]}
          rotation={[0, 0, 0.12]}
        >
          <boxGeometry args={[0.14, 0.025, 0.025]} />
          <meshStandardMaterial color="#202020" />
        </mesh>

        {/* Nose */}
        <mesh
          position={[0, -0.015, 0.365]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <coneGeometry args={[0.045, 0.11, 16]} />
          <meshStandardMaterial
            color="#d0a287"
            roughness={0.5}
          />
        </mesh>

        {/* Smile */}
        <mesh
          position={[0, -0.13, 0.345]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <torusGeometry
            args={[0.075, 0.018, 12, 24, Math.PI]}
          />
          <meshStandardMaterial
            color="#6f3434"
            roughness={0.45}
          />
        </mesh>

        {/* Beard */}
        <mesh
          position={[0, -0.205, 0.22]}
          scale={[0.55, 0.28, 0.35]}
        >
          <sphereGeometry args={[0.16, 24, 16]} />
          <meshStandardMaterial
            color="#353535"
            roughness={0.65}
          />
        </mesh>
      </group>

      <Html
        position={[0, 2.48, 0]}
        center
        distanceFactor={5}
      >
        <div className="director-label">
          AI DIRECTOR
        </div>
      </Html>
    </group>
  )
}

function Desk() {
  return (
    <group position={[0, 0.72, -0.25]}>
      {/* Desk top */}
      <mesh castShadow>
        <boxGeometry args={[2.4, 0.14, 1.05]} />
        <meshStandardMaterial
          color="#f5f5f2"
          roughness={0.35}
        />
      </mesh>

      {/* Desk legs */}
      {[-0.95, 0.95].map((x) => (
        <mesh
          key={x}
          position={[x, -0.38, 0]}
          castShadow
        >
          <boxGeometry args={[0.08, 0.75, 0.75]} />
          <meshStandardMaterial
            color="#bfc0bc"
            metalness={0.35}
            roughness={0.35}
          />
        </mesh>
      ))}

      {/* Monitor */}
      <mesh
        position={[0, 0.48, -0.22]}
        castShadow
      >
        <boxGeometry args={[0.9, 0.55, 0.07]} />
        <meshStandardMaterial
          color="#171717"
          roughness={0.25}
        />
      </mesh>

      <mesh position={[0, 0.48, -0.175]}>
        <boxGeometry args={[0.8, 0.43, 0.02]} />
        <meshStandardMaterial
          color="#dfe3e0"
          emissive="#ffffff"
          emissiveIntensity={0.12}
        />
      </mesh>

      {/* Monitor stand */}
      <mesh position={[0, 0.15, -0.22]}>
        <boxGeometry args={[0.08, 0.35, 0.08]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
    </group>
  )
}

function OfficeScene() {
  return (
    <>
      <color
        attach="background"
        args={['#f4f4f1']}
      />

      <ambientLight intensity={1.4} />

      <directionalLight
        position={[4, 7, 5]}
        intensity={2.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      <directionalLight
        position={[-4, 3, -2]}
        intensity={0.7}
      />

      <Environment preset="studio" />

      {/* FLOOR */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.02, 0]}
        receiveShadow
      >
        <planeGeometry args={[8, 7]} />
        <meshStandardMaterial
          color="#e5e5e1"
          roughness={0.82}
        />
      </mesh>

      {/* BACK WALL */}
      <mesh
        position={[0, 1.9, -2.4]}
        receiveShadow
      >
        <boxGeometry args={[7, 3.8, 0.12]} />
        <meshStandardMaterial
          color="#eeeeea"
          roughness={0.7}
        />
      </mesh>

      {/* SIDE WALL */}
      <mesh
        position={[-3.45, 1.9, 0]}
        rotation={[0, Math.PI / 2, 0]}
        receiveShadow
      >
        <boxGeometry args={[7, 3.8, 0.12]} />
        <meshStandardMaterial
          color="#f4f4f1"
          roughness={0.7}
        />
      </mesh>

      {/* WINDOW */}
      <mesh position={[1.8, 2.05, -2.32]}>
        <boxGeometry args={[2.5, 2.15, 0.05]} />
        <meshStandardMaterial
          color="#dfe7e8"
          metalness={0.05}
          roughness={0.25}
        />
      </mesh>

      {/* Window frame */}
      <mesh position={[1.8, 2.05, -2.27]}>
        <boxGeometry args={[0.035, 2.15, 0.03]} />
        <meshStandardMaterial color="#c4c8c6" />
      </mesh>

      <mesh position={[1.8, 2.05, -2.27]}>
        <boxGeometry args={[2.5, 0.035, 0.03]} />
        <meshStandardMaterial color="#c4c8c6" />
      </mesh>

      <Desk />
      <Director />

      {/* Plant pot */}
      <mesh
        position={[2.65, 0.45, -0.65]}
        castShadow
      >
        <cylinderGeometry
          args={[0.42, 0.34, 0.8, 32]}
        />
        <meshStandardMaterial
          color="#dadbd7"
          roughness={0.5}
        />
      </mesh>

      {/* Plant */}
      <mesh position={[2.65, 1.0, -0.65]}>
        <sphereGeometry args={[0.55, 24, 16]} />
        <meshStandardMaterial
          color="#8d9b8d"
          roughness={0.7}
        />
      </mesh>

      {/* Side table */}
      <mesh
        position={[-2.35, 0.65, -0.7]}
        castShadow
      >
        <boxGeometry args={[0.85, 0.12, 0.85]} />
        <meshStandardMaterial
          color="#f6f6f2"
          roughness={0.35}
        />
      </mesh>

      <ContactShadows
        position={[0, 0, 0]}
        opacity={0.22}
        scale={7}
        blur={2.2}
        far={3.5}
      />

      <OrbitControls
        enablePan={false}
        minDistance={4.8}
        maxDistance={8.5}
        minPolarAngle={0.9}
        maxPolarAngle={1.55}
        target={[0, 1, -0.4]}
      />
    </>
  )
}

function OfficeVisual() {
  return (
    <div className="office-wrap">
      <Canvas
        shadows
        camera={{
          position: [4.8, 3.1, 5.8],
          fov: 38,
        }}
      >
        <OfficeScene />
      </Canvas>

      <div className="office-hint">
        DRAG TO EXPLORE · 3D OFFICE
      </div>
    </div>
  )
}

function App() {
  return (
    <main>
      <nav className="nav">
        <a
          className="brand"
          href="#top"
        >
          <span className="brand-mark">✦</span>
          AI COMPANY
        </a>

        <div className="nav-links">
          <a href="#company">Company</a>
          <a href="#director">AI Director</a>
          <a href="#agents">Agents</a>
        </div>

        <button className="nav-button">
          Enter company <span>↗</span>
        </button>
      </nav>

      <section
        className="hero"
        id="top"
      >
        <div className="hero-copy">
          <p className="eyebrow">
            <span />
            THE OPERATING SYSTEM FOR YOUR AI COMPANY
          </p>

          <h1>
            Your company.
            <br />
            <em>Reimagined.</em>
          </h1>

          <p className="lead">
            Turn your offline office into an intelligent
            online company. One AI Director coordinates
            your agents, people and work.
          </p>

          <div className="actions">
            <button className="primary">
              Enter the company <span>→</span>
            </button>

            <button className="secondary">
              Explore the office <span>↓</span>
            </button>
          </div>

          <div className="micro">
            <span className="status" />
            Real 3D environment · Interactive workspace
          </div>
        </div>

        <OfficeVisual />
      </section>

      <section
        className="statement"
        id="company"
      >
        <p className="eyebrow">
          ONE COMPANY / ONE DIRECTOR / MANY AGENTS
        </p>

        <h2>
          Give AI a place to <em>work.</em>
        </h2>

        <p>
          AI Company creates a persistent digital
          workplace where intelligence is organized
          around real business processes.
        </p>
      </section>

      <section
        className="flow"
        id="director"
      >
        <div className="flow-head">
          <span>01</span>
          <h3>Director → Agents → Work</h3>
        </div>

        <div className="flow-grid">
          <article>
            <span>01</span>
            <h4>AI Director</h4>
            <p>
              Understands goals, plans work and
              coordinates the company.
            </p>
          </article>

          <article>
            <span>02</span>
            <h4>AI Agents</h4>
            <p>
              Specialized digital employees execute
              focused responsibilities.
            </p>
          </article>

          <article>
            <span>03</span>
            <h4>Real Work</h4>
            <p>
              Tasks become actions, decisions and
              measurable company output.
            </p>
          </article>
        </div>
      </section>

      <footer id="agents">
        <span>AI COMPANY</span>
        <span>YOUR OFFICE, ONLINE.</span>
      </footer>
    </main>
  )
}

createRoot(
  document.getElementById('root')
).render(<App />)
