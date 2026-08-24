import React, { useRef } from 'react'
import { createRoot } from 'react-dom/client'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows, Html } from '@react-three/drei'
import './office.css'

const dark = '#151515'
const skin = '#e1b69a'

function Director() {
  const root = useRef()
  const head = useRef()
  const chest = useRef()
  const leftArm = useRef()
  const rightArm = useRef()
  const leftEye = useRef()
  const rightEye = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (!root.current) return

    root.current.position.y = 0.76 + Math.sin(t * 1.55) * 0.008
    root.current.rotation.z = Math.sin(t * 0.42) * 0.012

    if (chest.current) chest.current.scale.y = 1 + Math.sin(t * 1.55) * 0.012

    if (head.current) {
      head.current.rotation.y = Math.sin(t * 0.55) * 0.08 + Math.sin(t * 0.18) * 0.025
      head.current.rotation.x = Math.sin(t * 0.4) * 0.018
    }

    if (leftArm.current) leftArm.current.rotation.y = Math.sin(t * 0.7) * 0.025
    if (rightArm.current) rightArm.current.rotation.y = Math.sin(t * 0.75 + 1) * 0.025

    const cycle = t % 5.4
    const blink = cycle > 5.05 ? Math.sin(((cycle - 5.05) / 0.35) * Math.PI) : 0
    const eyeScale = Math.max(0.08, 1 - blink)
    if (leftEye.current) leftEye.current.scale.y = eyeScale
    if (rightEye.current) rightEye.current.scale.y = eyeScale
  })

  return (
    <group ref={root} position={[0, 0.76, 0.2]}>
      {/* Chair: director is physically inside it */}
      <group position={[0, 0, 0.24]}>
        <mesh castShadow position={[0, 0.55, 0.16]}>
          <boxGeometry args={[0.78, 0.92, 0.16]} />
          <meshStandardMaterial color="#202020" roughness={0.36} />
        </mesh>
        <mesh castShadow position={[0, 0.12, 0]}>
          <boxGeometry args={[0.88, 0.16, 0.72]} />
          <meshStandardMaterial color="#181818" roughness={0.4} />
        </mesh>
        <mesh position={[0, -0.22, 0]}>
          <cylinderGeometry args={[0.055, 0.055, 0.5, 20]} />
          <meshStandardMaterial color="#777875" metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[0, -0.5, 0]}>
          <cylinderGeometry args={[0.34, 0.34, 0.06, 32]} />
          <meshStandardMaterial color="#777875" metalness={0.5} roughness={0.32} />
        </mesh>
      </group>

      {/* Seated torso */}
      <group ref={chest} position={[0, 1.12, 0.08]}>
        <mesh castShadow>
          <boxGeometry args={[0.58, 0.55, 0.34]} />
          <meshStandardMaterial color="#f8f8f5" roughness={0.32} />
        </mesh>
        <mesh castShadow position={[0, 0, -0.015]}>
          <boxGeometry args={[0.7, 0.6, 0.4]} />
          <meshStandardMaterial color={dark} roughness={0.36} />
        </mesh>
        <mesh position={[0, 0.02, -0.215]}>
          <boxGeometry args={[0.22, 0.44, 0.025]} />
          <meshStandardMaterial color="#ffffff" roughness={0.3} />
        </mesh>
        <mesh position={[0, -0.02, -0.24]}>
          <boxGeometry args={[0.06, 0.32, 0.035]} />
          <meshStandardMaterial color="#111111" roughness={0.25} />
        </mesh>
        <mesh position={[0, -0.19, -0.24]}>
          <coneGeometry args={[0.07, 0.11, 4]} />
          <meshStandardMaterial color="#111111" />
        </mesh>
        <mesh position={[-0.15, 0.09, -0.23]} rotation={[0, 0, -0.35]}>
          <boxGeometry args={[0.045, 0.34, 0.035]} />
          <meshStandardMaterial color="#303030" />
        </mesh>
        <mesh position={[0.15, 0.09, -0.23]} rotation={[0, 0, 0.35]}>
          <boxGeometry args={[0.045, 0.34, 0.035]} />
          <meshStandardMaterial color="#303030" />
        </mesh>
      </group>

      {/* Bent thighs and lower legs */}
      {[-1, 1].map((side) => (
        <group key={side}>
          <mesh
            castShadow
            position={[0.17 * side, 0.78, 0.02]}
            rotation={[-0.72, 0, 0]}
          >
            <capsuleGeometry args={[0.105, 0.34, 8, 16]} />
            <meshStandardMaterial color={dark} roughness={0.4} />
          </mesh>
          <mesh
            castShadow
            position={[0.17 * side, 0.48, -0.28]}
            rotation={[0.16, 0, 0]}
          >
            <capsuleGeometry args={[0.09, 0.3, 8, 16]} />
            <meshStandardMaterial color={dark} roughness={0.4} />
          </mesh>
          <mesh castShadow position={[0.17 * side, 0.35, -0.46]} scale={[1.05, 0.72, 1.55]}>
            <sphereGeometry args={[0.12, 24, 16]} />
            <meshStandardMaterial color="#0d0d0d" roughness={0.25} />
          </mesh>
        </group>
      ))}

      {/* Arms reach forward toward the desk */}
      <group ref={leftArm} position={[-0.36, 1.27, -0.02]} rotation={[-0.78, 0, -0.18]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.078, 0.38, 8, 16]} />
          <meshStandardMaterial color={dark} roughness={0.4} />
        </mesh>
        <mesh position={[0, -0.27, 0]}>
          <sphereGeometry args={[0.09, 24, 16]} />
          <meshStandardMaterial color={skin} roughness={0.55} />
        </mesh>
      </group>
      <group ref={rightArm} position={[0.36, 1.27, -0.02]} rotation={[-0.78, 0, 0.18]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.078, 0.38, 8, 16]} />
          <meshStandardMaterial color={dark} roughness={0.4} />
        </mesh>
        <mesh position={[0, -0.27, 0]}>
          <sphereGeometry args={[0.09, 24, 16]} />
          <meshStandardMaterial color={skin} roughness={0.55} />
        </mesh>
      </group>

      {/* Head and face: face points toward the desk (-Z) */}
      <group ref={head} position={[0, 1.82, 0.02]}>
        <mesh position={[0, -0.27, 0]}>
          <cylinderGeometry args={[0.11, 0.12, 0.2, 24]} />
          <meshStandardMaterial color={skin} roughness={0.55} />
        </mesh>
        <mesh castShadow>
          <sphereGeometry args={[0.34, 40, 32]} />
          <meshStandardMaterial color={skin} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.22, 0.01]} scale={[1.03, 0.58, 1.02]}>
          <sphereGeometry args={[0.35, 40, 24]} />
          <meshStandardMaterial color="#202020" roughness={0.32} />
        </mesh>
        <mesh position={[-0.33, 0, 0]}>
          <sphereGeometry args={[0.075, 20, 16]} />
          <meshStandardMaterial color="#d8aa8e" roughness={0.55} />
        </mesh>
        <mesh position={[0.33, 0, 0]}>
          <sphereGeometry args={[0.075, 20, 16]} />
          <meshStandardMaterial color="#d8aa8e" roughness={0.55} />
        </mesh>

        {/* Eyes */}
        <mesh ref={leftEye} position={[-0.125, 0.035, -0.315]}>
          <sphereGeometry args={[0.082, 32, 24]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} />
        </mesh>
        <mesh position={[-0.125, 0.035, -0.386]}>
          <sphereGeometry args={[0.037, 24, 20]} />
          <meshStandardMaterial color="#171717" roughness={0.15} />
        </mesh>
        <mesh ref={rightEye} position={[0.125, 0.035, -0.315]}>
          <sphereGeometry args={[0.082, 32, 24]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} />
        </mesh>
        <mesh position={[0.125, 0.035, -0.386]}>
          <sphereGeometry args={[0.037, 24, 20]} />
          <meshStandardMaterial color="#171717" roughness={0.15} />
        </mesh>

        {/* Brows */}
        <mesh position={[-0.125, 0.145, -0.32]} rotation={[0, 0, -0.12]}>
          <boxGeometry args={[0.14, 0.025, 0.025]} />
          <meshStandardMaterial color="#202020" />
        </mesh>
        <mesh position={[0.125, 0.145, -0.32]} rotation={[0, 0, 0.12]}>
          <boxGeometry args={[0.14, 0.025, 0.025]} />
          <meshStandardMaterial color="#202020" />
        </mesh>

        {/* Nose */}
        <mesh position={[0, -0.015, -0.37]} rotation={[-Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.045, 0.11, 16]} />
          <meshStandardMaterial color="#d0a287" roughness={0.5} />
        </mesh>

        {/* Beard and mouth */}
        <mesh position={[0, -0.19, -0.285]} scale={[0.58, 0.3, 0.38]}>
          <sphereGeometry args={[0.16, 24, 16]} />
          <meshStandardMaterial color="#353535" roughness={0.65} />
        </mesh>
        <mesh position={[0, -0.115, -0.345]} rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.065, 0.015, 12, 24, Math.PI]} />
          <meshStandardMaterial color="#6f3434" roughness={0.45} />
        </mesh>
      </group>

      <Html position={[0, 2.32, 0]} center distanceFactor={5}>
        <div className="director-label">AI DIRECTOR</div>
      </Html>
    </group>
  )
}

function Desk() {
  return (
    <group position={[0, 0, -0.72]}>
      <mesh castShadow position={[0, 1.02, 0]}>
        <boxGeometry args={[2.0, 0.12, 0.82]} />
        <meshStandardMaterial color="#f5f5f2" roughness={0.35} />
      </mesh>
      {[-0.76, 0.76].map((x) => (
        <mesh key={x} position={[x, 0.5, 0]} castShadow>
          <boxGeometry args={[0.07, 0.9, 0.64]} />
          <meshStandardMaterial color="#bfc0bc" metalness={0.35} roughness={0.35} />
        </mesh>
      ))}
      <mesh castShadow position={[0, 1.38, -0.13]}>
        <boxGeometry args={[0.78, 0.47, 0.06]} />
        <meshStandardMaterial color="#171717" roughness={0.25} />
      </mesh>
      <mesh position={[0, 1.38, -0.095]}>
        <boxGeometry args={[0.69, 0.37, 0.02]} />
        <meshStandardMaterial color="#dfe3e0" emissive="#ffffff" emissiveIntensity={0.12} />
      </mesh>
      <mesh position={[0, 1.12, -0.13]}>
        <boxGeometry args={[0.06, 0.25, 0.06]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
    </group>
  )
}

function OfficeScene() {
  return (
    <>
      <color attach="background" args={["#f4f4f1"]} />
      <ambientLight intensity={1.25} />
      <directionalLight position={[4, 7, 5]} intensity={2.15} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
      <directionalLight position={[-4, 3, -2]} intensity={0.65} />
      <Environment preset="studio" />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[8, 7]} />
        <meshStandardMaterial color="#e5e5e1" roughness={0.82} />
      </mesh>
      <mesh position={[0, 1.9, -2.4]} receiveShadow>
        <boxGeometry args={[7, 3.8, 0.12]} />
        <meshStandardMaterial color="#eeeeea" roughness={0.7} />
      </mesh>
      <mesh position={[-3.45, 1.9, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[7, 3.8, 0.12]} />
        <meshStandardMaterial color="#f4f4f1" roughness={0.7} />
      </mesh>

      <mesh position={[1.8, 2.05, -2.32]}>
        <boxGeometry args={[2.5, 2.15, 0.05]} />
        <meshStandardMaterial color="#dfe7e8" roughness={0.25} />
      </mesh>
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

      <group position={[2.55, 0, -0.55]}>
        <mesh castShadow position={[0, 0.4, 0]}>
          <cylinderGeometry args={[0.38, 0.32, 0.7, 32]} />
          <meshStandardMaterial color="#dadbd7" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.9, 0]}>
          <sphereGeometry args={[0.5, 24, 16]} />
          <meshStandardMaterial color="#8d9b8d" roughness={0.7} />
        </mesh>
      </group>

      <ContactShadows position={[0, 0, 0]} opacity={0.22} scale={7} blur={2.2} far={3.5} />
      <OrbitControls enablePan={false} minDistance={4.5} maxDistance={8.5} minPolarAngle={0.9} maxPolarAngle={1.5} target={[0, 1.05, -0.5]} />
    </>
  )
}

function OfficeVisual() {
  return (
    <div className="office-wrap" id="office">
      <Canvas shadows camera={{ position: [4.6, 3.0, 5.7], fov: 38 }}>
        <OfficeScene />
      </Canvas>
      <div className="office-hint">DRAG TO EXPLORE · 3D OFFICE</div>
    </div>
  )
}

function App() {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <main>
      <nav className="nav">
        <a className="brand" href="#top"><span className="brand-mark">✦</span> AI COMPANY</a>
        <div className="nav-links">
          <a href="#company">Company</a>
          <a href="#director">AI Director</a>
          <a href="#agents">Agents</a>
        </div>
        <button className="nav-button" onClick={() => scrollTo('company')}>Enter company <span>↗</span></button>
      </nav>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><span /> THE OPERATING SYSTEM FOR YOUR AI COMPANY</p>
          <h1>Your company.<br /><em>Reimagined.</em></h1>
          <p className="lead">Turn your offline office into an intelligent online company. One AI Director coordinates your agents, people and work.</p>
          <div className="actions">
            <button className="primary" onClick={() => scrollTo('company')}>Enter the company <span>→</span></button>
            <button className="secondary" onClick={() => scrollTo('office')}>Explore the office <span>↓</span></button>
          </div>
          <div className="micro"><span className="status" /> Real 3D environment · Interactive workspace</div>
        </div>
        <OfficeVisual />
      </section>

      <section className="statement" id="company">
        <p className="eyebrow">ONE COMPANY / ONE DIRECTOR / MANY AGENTS</p>
        <h2>Give AI a place to <em>work.</em></h2>
        <p>AI Company creates a persistent digital workplace where intelligence is organized around real business processes.</p>
      </section>

      <section className="flow" id="director">
        <div className="flow-head"><span>01</span><h3>Director → Agents → Work</h3></div>
        <div className="flow-grid">
          <article><span>01</span><h4>AI Director</h4><p>Understands goals, plans work and coordinates the company.</p></article>
          <article><span>02</span><h4>AI Agents</h4><p>Specialized digital employees execute focused responsibilities.</p></article>
          <article><span>03</span><h4>Real Work</h4><p>Tasks become actions, decisions and measurable company output.</p></article>
        </div>
      </section>

      <footer id="agents"><span>AI COMPANY</span><span>YOUR OFFICE, ONLINE.</span></footer>
    </main>
  )
}

createRoot(document.getElementById('root')).render(<App />)
