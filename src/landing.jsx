import React, { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import './city3d.css'

const buildings = [
  { id: 'FREE', p: [-52, 0, -32], size: [30, 12, 24], accent: '#aeb9b8' },
  { id: 'TRIAL', p: [48, 0, -44], size: [42, 17, 30], accent: '#93a8a8' },
  { id: 'GO', p: [-62, 0, 42], size: [56, 23, 38], accent: '#81999a' },
  { id: 'PLUS', p: [34, 0, 54], size: [72, 30, 48], accent: '#718c8f' },
  { id: 'PRO', p: [104, 0, 8], size: [96, 42, 58], accent: '#617d82' },
  { id: 'LUXURY', p: [-116, 0, 92], size: [132, 58, 72], accent: '#526f76' }
]
const colliders = buildings.map(b => ({ x: b.p[0], z: b.p[2], w: b.size[0] + 4, d: b.size[2] + 4 }))
const blocked = (x, z) => colliders.some(c => Math.abs(x - c.x) < c.w / 2 && Math.abs(z - c.z) < c.d / 2)

function MobileControls({ input }) {
  const joy = useRef(null)
  const knob = useRef(null)
  const look = useRef(null)

  useEffect(() => {
    const j = joy.current
    const k = knob.current
    if (!j || !k) return
    const update = e => {
      e.preventDefault()
      const r = j.getBoundingClientRect()
      let x = e.clientX - (r.left + r.width / 2)
      let y = e.clientY - (r.top + r.height / 2)
      const max = 48
      const len = Math.hypot(x, y) || 1
      if (len > max) { x = x / len * max; y = y / len * max }
      input.current.jx = x / max
      input.current.jy = y / max
      k.style.transform = `translate(${x}px, ${y}px)`
    }
    const end = e => {
      e?.preventDefault?.()
      input.current.jx = 0
      input.current.jy = 0
      k.style.transform = 'translate(0,0)'
    }
    j.addEventListener('pointerdown', update)
    j.addEventListener('pointermove', update)
    j.addEventListener('pointerup', end)
    j.addEventListener('pointercancel', end)
    j.addEventListener('pointerleave', end)
    return () => {
      j.removeEventListener('pointerdown', update)
      j.removeEventListener('pointermove', update)
      j.removeEventListener('pointerup', end)
      j.removeEventListener('pointercancel', end)
      j.removeEventListener('pointerleave', end)
    }
  }, [input])

  useEffect(() => {
    const l = look.current
    if (!l) return
    let last = null
    const start = e => { if (e.pointerType === 'touch') { last = { x: e.clientX, y: e.clientY }; l.setPointerCapture?.(e.pointerId) } }
    const move = e => {
      if (!last) return
      input.current.lookX += (e.clientX - last.x) * 0.004
      input.current.lookY += (e.clientY - last.y) * 0.003
      last = { x: e.clientX, y: e.clientY }
    }
    const end = () => { last = null }
    l.addEventListener('pointerdown', start)
    l.addEventListener('pointermove', move)
    l.addEventListener('pointerup', end)
    l.addEventListener('pointercancel', end)
    return () => {
      l.removeEventListener('pointerdown', start)
      l.removeEventListener('pointermove', move)
      l.removeEventListener('pointerup', end)
      l.removeEventListener('pointercancel', end)
    }
  }, [input])

  return <div className="mobile-controls">
    <div ref={look} className="look-zone" />
    <div ref={joy} className="joystick"><div ref={knob} className="joystick-knob" /></div>
    <button className="run-button" onPointerDown={() => { input.current.run = true }} onPointerUp={() => { input.current.run = false }}>RUN</button>
    <button className="enter-button" onPointerDown={() => { input.current.enter = true }} onPointerUp={() => { input.current.enter = false }}>ENTER</button>
    <div className="mobile-hint">JOYSTICK · SWIPE RIGHT TO LOOK</div>
  </div>
}

function Player({ spawn = [0, 2, 125], onEnter, officeMode = false }) {
  const { camera } = useThree()
  const keys = useRef({})
  const input = useRef({ jx: 0, jy: 0, lookX: 0, lookY: 0, run: false, enter: false })
  const yaw = useRef(0)
  const pitch = useRef(0)
  const previousEnter = useRef(false)

  useEffect(() => {
    camera.position.set(...spawn)
    camera.rotation.order = 'YXZ'
    const down = e => { keys.current[e.code] = true }
    const up = e => { keys.current[e.code] = false }
    const mouse = e => {
      if (!('ontouchstart' in window) && document.pointerLockElement) {
        yaw.current -= e.movementX * 0.0025
        pitch.current -= e.movementY * 0.003
      }
    }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    window.addEventListener('mousemove', mouse)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
      window.removeEventListener('mousemove', mouse)
    }
  }, [camera, spawn])

  useEffect(() => {
    const canvas = document.querySelector('.city-core canvas, .office-canvas canvas')
    if (!canvas) return
    const click = () => {
      if (!('ontouchstart' in window)) canvas.requestPointerLock?.()
    }
    canvas.addEventListener('click', click)
    return () => canvas.removeEventListener('click', click)
  }, [])

  useFrame((_, dt) => {
    const d = Math.min(dt, 0.05)
    yaw.current -= input.current.lookX
    pitch.current -= input.current.lookY
    input.current.lookX = 0
    input.current.lookY = 0
    pitch.current = THREE.MathUtils.clamp(pitch.current, -1.25, 1.25)
    camera.rotation.y = yaw.current
    camera.rotation.x = pitch.current

    const k = keys.current
    const forward = (k.KeyW || k.ArrowUp ? 1 : 0) - (k.KeyS || k.ArrowDown ? 1 : 0) - input.current.jy
    const side = (k.KeyD || k.ArrowRight ? 1 : 0) - (k.KeyA || k.ArrowLeft ? 1 : 0) + input.current.jx
    const move = new THREE.Vector3(side, 0, -forward)
    if (move.lengthSq()) {
      move.normalize().applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw.current)
      const speed = (k.ShiftLeft || k.ShiftRight || input.current.run) ? 10 : 5.5
      const nx = camera.position.x + move.x * speed * d
      const nz = camera.position.z + move.z * speed * d
      if (officeMode || !blocked(nx, camera.position.z)) camera.position.x = nx
      if (officeMode || !blocked(camera.position.x, nz)) camera.position.z = nz
    }
    camera.position.y = 2

    const enter = !!(k.KeyE || input.current.enter)
    if (!officeMode && enter && !previousEnter.current && onEnter) {
      let best = null
      let distance = 22
      buildings.forEach(b => {
        const dist = Math.hypot(camera.position.x - b.p[0], camera.position.z - b.p[2])
        if (dist < distance) { best = b; distance = dist }
      })
      if (best) onEnter(best)
    }
    previousEnter.current = enter
  })

  return <MobileControls input={input} />
}

function Building({ b }) {
  const [w, h, d] = b.size
  const rows = Math.max(3, Math.floor(h / 5))
  const cols = Math.max(4, Math.floor(w / 7))
  return <group position={b.p}>
    <mesh position={[0, h / 2, 0]} castShadow>
      <boxGeometry args={[w, h, d]} />
      <meshStandardMaterial color="#eef2ef" roughness={0.62} />
    </mesh>
    <mesh position={[0, h + 0.4, 0]}>
      <boxGeometry args={[w * 0.88, 0.8, d * 0.84]} />
      <meshStandardMaterial color={b.accent} roughness={0.45} />
    </mesh>
    {Array.from({ length: rows * cols }).map((_, i) => {
      const col = i % cols
      const row = Math.floor(i / cols)
      const x = -w / 2 + 3 + col * (w - 6) / Math.max(1, cols - 1)
      const y = 3 + row * (h - 6) / Math.max(1, rows - 1)
      return <mesh key={i} position={[x, y, d / 2 + 0.08]}>
        <boxGeometry args={[Math.min(3.4, (w - 6) / cols * 0.7), 1.8, 0.12]} />
        <meshStandardMaterial color="#c4e0e1" metalness={0.15} roughness={0.28} />
      </mesh>
    })}
    <mesh position={[0, 1.3, d / 2 + 0.18]}>
      <boxGeometry args={[5, 2.6, 0.35]} />
      <meshStandardMaterial color={b.accent} />
    </mesh>
  </group>
}

function CityWorld({ onEnter }) {
  return <>
    <color attach="background" args={['#f2f5f2']} />
    <fog attach="fog" args={['#f2f5f2', 150, 330]} />
    <ambientLight intensity={1.8} />
    <directionalLight position={[80, 120, 60]} intensity={3.2} castShadow />
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[380, 380]} />
      <meshStandardMaterial color="#dfe5e1" />
    </mesh>
    {[0, -90, 90].map(x => <mesh key={`v${x}`} position={[x, 0.03, 0]}><boxGeometry args={[12, 0.06, 380]} /><meshStandardMaterial color="#cfd6d2" /></mesh>)}
    {[0, -90, 90].map(z => <mesh key={`h${z}`} position={[0, 0.04, z]}><boxGeometry args={[380, 0.06, 12]} /><meshStandardMaterial color="#cfd6d2" /></mesh>)}
    {buildings.map(b => <Building key={b.id} b={b} />)}
    <Player onEnter={onEnter} />
  </>
}

function Agent({ index, x, z }) {
  return <group position={[x, 0, z]}>
    <mesh position={[0, 1.2, 0]}><sphereGeometry args={[0.28, 16, 10]} /><meshStandardMaterial color="#789197" /></mesh>
    <mesh position={[0, 0.65, 0]}><cylinderGeometry args={[0.25, 0.32, 1, 12]} /><meshStandardMaterial color="#d7ddda" /></mesh>
  </group>
}

function OfficeWorld({ building }) {
  const count = Math.min(15, Math.max(3, Math.round(building.size[0] / 6)))
  return <>
    <color attach="background" args={['#f5f7f4']} />
    <ambientLight intensity={2.2} />
    <directionalLight position={[20, 35, 15]} intensity={3.4} castShadow />
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[Math.max(45, building.size[0] * 0.8), Math.max(35, building.size[2] * 0.8)]} /><meshStandardMaterial color="#e7ece8" /></mesh>
    <mesh position={[0, 5, -22]}><boxGeometry args={[48, 10, 0.3]} /><meshStandardMaterial color="#ffffff" /></mesh>
    {Array.from({ length: count }).map((_, i) => {
      const col = i % 3
      const row = Math.floor(i / 3)
      const x = (col - 1) * 7
      const z = row * 5 - 4
      return <group key={i}>
        <mesh position={[x, 1, z]}><boxGeometry args={[2.8, 0.12, 1.5]} /><meshStandardMaterial color="#ffffff" /></mesh>
        <mesh position={[x, 1.7, z - 0.25]}><boxGeometry args={[1.5, 0.8, 0.08]} /><meshStandardMaterial color="#a9c5c7" /></mesh>
        <Agent index={i} x={x} z={z + 1.2} />
      </group>
    })}
    <Player spawn={[0, 2, 18]} officeMode />
  </>
}

function ErrorBoundary({ children }) {
  const [error, setError] = useState(null)
  if (error) return <div style={{ padding: 24, fontFamily: 'system-ui', color: '#263236', background: '#f5f7f4', height: '100%' }}><h2>AI Company 3D</h2><p>3D scene failed to start.</p><pre style={{ whiteSpace: 'pre-wrap' }}>{String(error)}</pre></div>
  return <ErrorCatcher onError={setError}>{children}</ErrorCatcher>
}

class ErrorCatcher extends React.Component {
  state = { error: null }
  static getDerivedStateFromError(error) { return { error } }
  componentDidCatch(error) { this.props.onError(error) }
  render() { return this.state.error ? null : this.props.children }
}

function City({ onEnter }) {
  return <div className="city-core">
    <Canvas dpr={[1, 1.5]} shadows camera={{ position: [0, 2, 125], fov: 72 }}>
      <CityWorld onEnter={onEnter} />
    </Canvas>
    <div className="city-hud"><strong>AI COMPANY CITY</strong><span>JOYSTICK + SWIPE · WASD + MOUSE</span></div>
  </div>
}

function Office({ building, onExit }) {
  return <div className="office-screen">
    <div className="office-top"><button className="pill ghost" onClick={onExit}>← CITY</button><div><b>{building.id} OFFICE</b><small>WALK INSIDE · WATCH AGENTS WORK</small></div><span /></div>
    <div className="office-canvas">
      <Canvas dpr={[1, 1.5]} shadows camera={{ position: [0, 2, 18], fov: 72 }}><OfficeWorld building={building} /></Canvas>
      <div className="office-brief"><strong>{building.id} OFFICE</strong><span>JOYSTICK + SWIPE · WASD + MOUSE · RUN</span></div>
    </div>
  </div>
}

export default function App() {
  const [office, setOffice] = useState(null)
  return <ErrorBoundary>{office ? <Office building={office} onExit={() => setOffice(null)} /> : <City onEnter={setOffice} />}</ErrorBoundary>
}
