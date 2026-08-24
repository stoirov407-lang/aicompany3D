import React from 'react'
import { createRoot } from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows, Html } from '@react-three/drei'
import './styles.css'

function Director() {
  return (
    <group position={[0, 1.05, -0.55]}>
      <mesh position={[0, 1.55, 0]} castShadow>
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshStandardMaterial color="#d7b59a" roughness={0.65} />
      </mesh>
      <mesh position={[0, 1.82, 0]}>
        <sphereGeometry args={[0.255, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#252525" roughness={0.5} />
      </mesh>
      <mesh position={[0, 1.17, 0]} castShadow>
        <boxGeometry args={[0.58, 0.72, 0.34]} />
        <meshStandardMaterial color="#171717" roughness={0.42} />
      </mesh>
      <mesh position={[0, 1.2, 0.181]}>
        <boxGeometry args={[0.23, 0.45, 0.025]} />
        <meshStandardMaterial color="#f7f7f4" roughness={0.35} />
      </mesh>
      <mesh position={[0, 1.27, 0.205]}>
        <boxGeometry args={[0.055, 0.32, 0.03]} />
        <meshStandardMaterial color="#111111" roughness={0.25} />
      </mesh>
      <mesh position={[-0.19, 0.66, 0]} castShadow>
        <cylinderGeometry args={[0.105, 0.12, 0.8, 24]} />
        <meshStandardMaterial color="#202020" roughness={0.45} />
      </mesh>
      <mesh position={[0.19, 0.66, 0]} castShadow>
        <cylinderGeometry args={[0.105, 0.12, 0.8, 24]} />
        <meshStandardMaterial color="#202020" roughness={0.45} />
      </mesh>
      <mesh position={[-0.39, 1.18, 0]} rotation={[0, 0, -0.12]} castShadow>
        <cylinderGeometry args={[0.075, 0.075, 0.7, 20]} />
        <meshStandardMaterial color="#171717" roughness={0.42} />
      </mesh>
      <mesh position={[0.39, 1.18, 0]} rotation={[0, 0, 0.12]} castShadow>
        <cylinderGeometry args={[0.075, 0.075, 0.7, 20]} />
        <meshStandardMaterial color="#171717" roughness={0.42} />
      </mesh>
      <Html position={[0, 2.15, 0]} center distanceFactor={5}>
        <div className="director-label">AI DIRECTOR</div>
      </Html>
    </group>
  )
}

function Desk() {
  return (
    <group position={[0, 0.72, -0.25]}>
      <mesh castShadow>
        <boxGeometry args={[2.4, 0.14, 1.05]} />
        <meshStandardMaterial color="#f5f5f2" roughness={0.35} />
      </mesh>
      {[-0.95, 0.95].map((x) => (
        <mesh key={x} position={[x, -0.38, 0]} castShadow>
          <boxGeometry args={[0.08, 0.75, 0.75]} />
          <meshStandardMaterial color="#bfc0bc" metalness={0.35} roughness={0.35} />
        </mesh>
      ))}
      <mesh position={[0, 0.48, -0.22]} castShadow>
        <boxGeometry args={[0.9, 0.55, 0.07]} />
        <meshStandardMaterial color="#171717" roughness={0.25} />
      </mesh>
      <mesh position={[0, 0.48, -0.175]}>
        <boxGeometry args={[0.8, 0.43, 0.02]} />
        <meshStandardMaterial color="#dfe3e0" emissive="#ffffff" emissiveIntensity={0.12} />
      </mesh>
    </group>
  )
}

function OfficeScene() {
  return (
    <>
      <color attach="background" args={["#f4f4f1"]} />
      <ambientLight intensity={1.4} />
      <directionalLight position={[4, 7, 5]} intensity={2.2} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
      <directionalLight position={[-4, 3, -2]} intensity={0.7} />
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
        <meshStandardMaterial color="#dfe7e8" metalness={0.05} roughness={0.25} />
      </mesh>
      <mesh position={[1.8, 2.05, -2.27]}>
        <boxGeometry args={[0.035, 2.15, 0.03]} />
        <meshStandardMaterial color="#c4c8c6" />
      </mesh>
      <mesh position={[1.8, 2.05, -2.27]}>
        <boxGeometry args={[2.5, 0.035, 0.03]} />
        <meshStandardMaterial color="#c4c8c6" />
      </mesh>

      <group position={[0, 0, 0]}>
        <Desk />
        <Director />
      </group>

      <mesh position={[2.65, 0.45, -0.65]} castShadow>
        <cylinderGeometry args={[0.42, 0.34, 0.8, 32]} />
        <meshStandardMaterial color="#dadbd7" roughness={0.5} />
      </mesh>
      <mesh position={[2.65, 1.0, -0.65]}>
        <sphereGeometry args={[0.55, 24, 16]} />
        <meshStandardMaterial color="#8d9b8d" roughness={0.7} />
      </mesh>
      <mesh position={[-2.35, 0.65, -0.7]} castShadow>
        <boxGeometry args={[0.85, 0.12, 0.85]} />
        <meshStandardMaterial color="#f6f6f2" roughness={0.35} />
      </mesh>

      <ContactShadows position={[0, 0, 0]} opacity={0.22} scale={7} blur={2.2} far={3.5} />
      <OrbitControls enablePan={false} minDistance={4.8} maxDistance={8.5} minPolarAngle={0.9} maxPolarAngle={1.55} target={[0, 1, -0.4]} />
    </>
  )
}

function OfficeVisual() {
  return (
    <div className="office-wrap">
      <Canvas shadows camera={{ position: [4.8, 3.1, 5.8], fov: 38 }}>
        <OfficeScene />
      </Canvas>
      <div className="office-hint">DRAG TO EXPLORE · 3D OFFICE</div>
    </div>
  )
}

function App() {
  return (
    <main>
      <nav className="nav">
        <a className="brand" href="#top"><span className="brand-mark">✦</span> AI COMPANY</a>
        <div className="nav-links">
          <a href="#company">Company</a>
          <a href="#director">AI Director</a>
          <a href="#agents">Agents</a>
        </div>
        <button className="nav-button">Enter company <span>↗</span></button>
      </nav>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><span /> THE OPERATING SYSTEM FOR YOUR AI COMPANY</p>
          <h1>Your company.<br /><em>Reimagined.</em></h1>
          <p className="lead">Turn your offline office into an intelligent online company. One AI Director coordinates your agents, people and work.</p>
          <div className="actions">
            <button className="primary">Enter the company <span>→</span></button>
            <button className="secondary">Explore the office <span>↓</span></button>
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
