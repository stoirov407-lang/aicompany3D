import React, { useEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Html, PointerLockControls } from '@react-three/drei'
import * as THREE from 'three'
import './city3d.css'

const plans = [
  { id:'FREE', price:'$0', period:'forever', limit:1, office:'S · 3 places' },
  { id:'TRIAL', price:'$0', period:'14 days', limit:5, office:'M · 5 places' },
  { id:'GO', price:'$4.99', period:'/ month', limit:5, office:'M · 5 places' },
  { id:'PLUS', price:'$12.99', period:'/ month', limit:15, office:'L · 7 places' },
  { id:'PRO', price:'$29.99', period:'/ month', limit:50, office:'XL · 10 places' },
  { id:'LUXURY', price:'$199.50', period:'lifetime', limit:Infinity, office:'XXL · 15+' }
]
const categories = ['Development','Data & Analytics','Finance','Business','Research','Marketing','Content','Design','Sales & E-commerce','HR','Legal & Compliance','Project Management','AI & Automation','QA & Testing','Security']

// Real-world-scale commercial buildings. They are intentionally large even on FREE.
const buildings = [
  {id:'FREE',   p:[-62,0,-42], size:[24,10,18], h:10, color:'#68757d', label:'FREE OFFICE'},
  {id:'TRIAL',  p:[-5,0,-55],  size:[34,14,25], h:14, color:'#526875', label:'TRIAL OFFICE'},
  {id:'GO',     p:[55,0,-38],  size:[46,20,32], h:20, color:'#465c69', label:'GO OFFICE'},
  {id:'PLUS',   p:[-58,0,30],  size:[64,27,40], h:27, color:'#3e5665', label:'PLUS OFFICE'},
  {id:'PRO',    p:[35,0,38],   size:[88,38,50], h:38, color:'#344d5c', label:'PRO OFFICE'},
  {id:'LUXURY', p:[120,0,2],   size:[128,55,62], h:55, color:'#263f4e', label:'LUXURY HQ'}
]

const cityColliders = buildings.map(b => ({x:b.p[0], z:b.p[2], w:b.size[0] + 2.4, d:b.size[2] + 2.4}))
const clamp = (v,a,b) => Math.max(a, Math.min(b,v))

function blocked(x,z,colliders,margin=1.15){
  return colliders.some(c => Math.abs(x-c.x) < c.w/2+margin && Math.abs(z-c.z) < c.d/2+margin)
}

function FirstPerson({spawn=[0,2,0], colliders=[], onNear, nearDistance=18, onEnterNear}) {
  const {camera} = useThree()
  const keys = useRef({})
  const velocity = useRef(new THREE.Vector3())
  const last = useRef({x:spawn[0], z:spawn[2]})

  useEffect(() => {
    camera.position.set(...spawn)
    const down = e => { keys.current[e.code] = true }
    const up = e => { keys.current[e.code] = false }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up) }
  }, [camera, spawn])

  useEffect(() => {
    const enter = e => { if(e.code === 'KeyE' && onEnterNear) onEnterNear() }
    window.addEventListener('keydown', enter)
    return () => window.removeEventListener('keydown', enter)
  }, [onEnterNear])

  useFrame((_,delta) => {
    const dt = Math.min(delta, .05)
    const forward = Number(keys.current.KeyW || keys.current.ArrowUp) - Number(keys.current.KeyS || keys.current.ArrowDown)
    const side = Number(keys.current.KeyD || keys.current.ArrowRight) - Number(keys.current.KeyA || keys.current.ArrowLeft)
    const speed = keys.current.ShiftLeft || keys.current.ShiftRight ? 13 : 7
    const direction = new THREE.Vector3(side,0,-forward)
    if(direction.lengthSq()) direction.normalize().applyQuaternion(camera.quaternion).setY(0).normalize()
    velocity.current.lerp(direction.multiplyScalar(speed), 1-Math.pow(.001,dt))
    const nx = camera.position.x + velocity.current.x*dt
    const nz = camera.position.z + velocity.current.z*dt
    if(!blocked(nx, camera.position.z, colliders)) camera.position.x = nx
    if(!blocked(camera.position.x, nz, colliders)) camera.position.z = nz
    camera.position.y = 2
    camera.position.x = clamp(camera.position.x,-185,185)
    camera.position.z = clamp(camera.position.z,-185,185)
    last.current = {x:camera.position.x,z:camera.position.z}
    if(onNear){
      let best=null, dist=Infinity
      for(const b of buildings){
        const doorZ=b.p[2]+b.size[2]/2+3
        const d=Math.hypot(camera.position.x-b.p[0],camera.position.z-doorZ)
        if(d<dist){dist=d;best=b}
      }
      onNear(dist<nearDistance?best:null)
    }
  })

  return <PointerLockControls makeDefault />
}

function Building({b,onNear}){
  const [w,h,d] = b.size
  const windows = useMemo(()=>Array.from({length:Math.max(8,Math.floor(w/5))}),[w])
  return <group position={b.p}>
    <mesh position={[0,h/2,0]} castShadow receiveShadow><boxGeometry args={[w,h,d]}/><meshStandardMaterial color={b.color} roughness={.4} metalness={.35}/></mesh>
    <mesh position={[0,.16,d/2+.08]}><boxGeometry args={[w*.62,.32,.2]}/><meshStandardMaterial color="#17232b" metalness={.65}/></mesh>
    <mesh position={[0,1.8,d/2+.18]}><boxGeometry args={[Math.min(7,w*.18),3.1,.12]}/><meshPhysicalMaterial color="#8faab6" transmission={.18} roughness={.12} metalness={.2}/></mesh>
    {windows.map((_,i)=>{const x=-w/2+3+(i%(Math.floor(w/5)))*5; const y=5+Math.floor(i/Math.floor(w/5))*4.2; if(y>h-2)return null; return <mesh key={i} position={[x,y,d/2+.08]}><boxGeometry args={[2.2,2.1,.08]}/><meshStandardMaterial color="#6f99aa" emissive="#244b5c" emissiveIntensity={.55}/></mesh>})}
    <mesh position={[0,h+.18,0]}><boxGeometry args={[w*.72,.35,d*.72]}/><meshStandardMaterial color="#263943" metalness={.55}/></mesh>
    <Html position={[0,Math.min(h+5,60),d/2]} center distanceFactor={22}>
      <div className="city-label"><b>{b.id}</b><span>{Math.round(w)}×{Math.round(d)}m · {Math.round(h)}m high</span></div>
    </Html>
  </group>
}

function CityWorld({onEnter}){
  const [near,setNear]=useState(null)
  const enterNear=()=>{ if(near) onEnter(near) }
  return <>
    <ambientLight intensity={1.1}/><directionalLight position={[70,100,40]} intensity={3.4} castShadow/>
    <directionalLight position={[-60,35,-40]} intensity={1.2}/><Environment preset="city"/>
    <mesh rotation={[-Math.PI/2,0,0]} receiveShadow><planeGeometry args={[380,380]}/><meshStandardMaterial color="#19252d" roughness={.92}/></mesh>
    <gridHelper args={[360,72,'#30414b','#1b2830']} position={[0,.025,0]}/>
    {[-95,-25,45,115].map(x=><mesh key={'roadx'+x} position={[x,.05,0]}><boxGeometry args={[9,.1,360]}/><meshStandardMaterial color="#111a20"/></mesh>)}
    {[-105,-35,35,105].map(z=><mesh key={'roadz'+z} position={[0,.06,z]}><boxGeometry args={[360,.1,9]}/><meshStandardMaterial color="#111a20"/></mesh>)}
    {buildings.map(b=><Building key={b.id} b={b}/>) }
    <FirstPerson spawn={[0,2,112]} colliders={cityColliders} onNear={setNear} onEnterNear={enterNear}/>
    {near && <Html fullscreen><div className="fp-enter"><b>{near.id} · {near.label}</b><span>Вход рядом · нажми E</span></div></Html>}
  </>
}

function City({onEnter}){
  return <div className="city-core">
    <Canvas shadows camera={{position:[0,2,112],fov:72}}>
      <color attach="background" args={['#071727']}/><CityWorld onEnter={onEnter}/>
    </Canvas>
    <div className="city-hud"><div><span>3D OFFICE CITY</span><strong>AI COMPANY CITY</strong><small>First Person · WASD / стрелки · мышь · Shift · E</small></div><div className="hud-status"><i/>LIVE CITY</div></div>
    <div className="city-bottom"><span>FREE → TRIAL → GO → PLUS → PRO → LUXURY</span><span>Кликни по сцене для First Person</span></div>
  </div>
}

function OfficeWorld({building}){
  const [w,h,d]=building.size
  const roomW=Math.max(22,w*.7), roomD=Math.max(18,d*.7), roomH=Math.max(7,h*.22)
  const colliders=[{x:0,z:-roomD/2,w:roomW,d:.5},{x:0,z:roomD/2,w:roomW,d:.5},{x:-roomW/2,z:0,w:.5,d:roomD},{x:roomW/2,z:0,w:.5,d:roomD}]
  return <>
    <ambientLight intensity={1.8}/><directionalLight position={[20,30,12]} intensity={3.5} castShadow/><Environment preset="city"/>
    <mesh rotation={[-Math.PI/2,0,0]} receiveShadow><planeGeometry args={[roomW,roomD]}/><meshStandardMaterial color="#d7d6d1" roughness={.8}/></mesh>
    <mesh position={[0,roomH/2,-roomD/2]}><boxGeometry args={[roomW,roomH,.35]}/><meshStandardMaterial color="#e9e8e2"/></mesh>
    <mesh position={[0,roomH/2,roomD/2]}><boxGeometry args={[roomW,roomH,.35]}/><meshStandardMaterial color="#e9e8e2"/></mesh>
    <mesh position={[-roomW/2,roomH/2,0]}><boxGeometry args={[.35,roomH,roomD]}/><meshStandardMaterial color="#e9e8e2"/></mesh>
    <mesh position={[roomW/2,roomH/2,0]}><boxGeometry args={[.35,roomH,roomD]}/><meshStandardMaterial color="#e9e8e2"/></mesh>
    <mesh position={[0,roomH-.08,0]}><boxGeometry args={[roomW,.16,roomD]}/><meshStandardMaterial color="#f1f0eb"/></mesh>
    <group position={[roomW*.23,1.5,-roomD*.22]}><mesh><boxGeometry args={[Math.min(18,roomW*.34),3,.08]}/><meshPhysicalMaterial color="#b9c5c8" transmission={.5} roughness={.12}/></mesh><Html position={[0,2.2,0]} center><div className="room-sign">DIRECTOR OFFICE</div></Html></group>
    {Array.from({length:Math.min(30,Math.max(8,Math.floor(roomW/3)))}).map((_,i)=>{const cols=Math.max(4,Math.floor(roomW/4)); const x=-roomW/2+2+(i%cols)*4; const z=-roomD/2+4+Math.floor(i/cols)*4.2; return <group key={i} position={[x,0,z]}><mesh position={[0,.78,0]}><boxGeometry args={[2.3,.14,1.15]}/><meshStandardMaterial color="#eeeae2"/></mesh><mesh position={[0,1.35,0]}><boxGeometry args={[.72,.52,.06]}/><meshStandardMaterial color="#20282d"/></mesh><mesh position={[0,.42,.72]}><boxGeometry args={[.8,.08,.08]}/><meshStandardMaterial color="#283238"/></mesh></group>})}
    <FirstPerson spawn={[0,2,roomD/2-4]} colliders={colliders}/>
  </>
}

function AgentDialog({plan,onClose,onCreated}){
  const [category,setCategory]=useState('Development'); const [stage,setStage]=useState('suggest')
  const confirm=()=>stage==='suggest'?setStage('warning'):onCreated(category)
  return <div className="modal"><div className="modal-box agent-dialog"><button className="x" onClick={onClose}>×</button>{stage==='suggest'?<><span>DIRECTOR</span><h3>I understand what you want to accomplish.</h3><p>I recommend a <strong>{category}</strong> agent for this task. You can choose a different category.</p><select value={category} onChange={e=>setCategory(e.target.value)}>{categories.map(c=><option key={c}>{c}</option>)}</select><button className="pill primary wide" onClick={confirm}>Allow Director to create</button><button className="text-btn" onClick={onClose}>Cancel</button></>:<><span>FINAL CONFIRMATION</span><h3>Create {category} agent?</h3><p>Your <strong>{plan.id}</strong> plan has {plan.limit===Infinity?'unlimited':plan.limit} user-agent slots.</p><p className="warning">This is the last confirmation. The category becomes permanent and cannot be changed later. Agree?</p><button className="pill primary wide" onClick={confirm}>Agree & create agent</button><button className="text-btn" onClick={onClose}>Cancel</button></>}</div></div>
}

function Office({building,plan,onExit,onBuy}){
  const [agents,setAgents]=useState([]); const [chat,setChat]=useState(''); const [showCreate,setShowCreate]=useState(false)
  const owned=plan.id===building.id || plan.id==='LUXURY'
  const remaining=plan.limit===Infinity?'∞':Math.max(0,plan.limit-agents.length)
  const send=()=>{if(!chat.trim())return;setChat('');setShowCreate(true)}
  const created=cat=>{setAgents(a=>[...a,{id:Date.now(),cat}]);setShowCreate(false)}
  return <div className="office-screen"><div className="office-top"><button className="pill ghost" onClick={onExit}>← City</button><div><b>{building.label}</b><small>{owned?'ACTIVE OFFICE':'PREVIEW · '+building.id} · {building.size[0]}×{building.size[2]}m</small></div>{!owned?<button className="pill primary" onClick={()=>onBuy(building.id)}>Buy {building.id}</button>:<button className="pill primary" onClick={()=>setShowCreate(true)} disabled={remaining===0}>+ Create agent</button>}</div>
    <div className="office-canvas"><Canvas shadows camera={{position:[0,2,10],fov:72}}><color attach="background" args={['#d9d9d7']}/><OfficeWorld building={building}/></Canvas>
      <div className="office-brief"><span>FIRST PERSON OFFICE</span><strong>{building.id} · {building.size[0]}×{building.size[2]}m</strong><p>“Здравствуйте. Добро пожаловать. Ходите по офису от первого лица.”</p></div>
      <div className="office-chat"><div className="chat-title">DIRECTOR · WORK PLANNING</div><div className="chat-bubble">Я анализирую вашу цель, подбираю агентов и проверяю результат.</div><div className="chat-row"><input value={chat} onChange={e=>setChat(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="Что вы хотите сделать?"/><button onClick={send}>Send</button></div></div>
    </div>{showCreate&&<AgentDialog plan={plan} onClose={()=>setShowCreate(false)} onCreated={created}/>}</div>
}

function App(){
  const [plan,setPlan]=useState(plans[0]); const [office,setOffice]=useState(null); const [showPlans,setShowPlans]=useState(false); const [message,setMessage]=useState('')
  const buy=async id=>{const p=plans.find(x=>x.id===id);if(!p)return;if(p.id==='FREE'||p.id==='TRIAL'){setPlan(p);setOffice(buildings.find(b=>b.id===id)||buildings[0]);return} try{const r=await fetch('/api/create-checkout-session',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({plan:p.id})});const d=await r.json();if(d.url)window.location.href=d.url;else{setMessage(d.error||'Checkout is not configured yet.');setShowPlans(true)}}catch{setMessage('Could not start checkout.')}}
  if(office)return <Office building={office} plan={plan} onExit={()=>setOffice(null)} onBuy={buy}/>
  return <div className="app-core"><City onEnter={setOffice}/><div className="core-top"><div className="core-brand"><b>3D OFFICE</b><span>AI COMPANY</span></div><button className="pill" onClick={()=>setShowPlans(true)}>{plan.id} · {plan.limit===Infinity?'∞':plan.limit} agents</button></div>{showPlans&&<div className="modal"><div className="modal-box plans-modal"><button className="x" onClick={()=>setShowPlans(false)}>×</button><span>OFFICES & PLANS</span><h3>Choose the company space you need.</h3><div className="plan-list">{plans.map(p=><button key={p.id} className="plan-row" onClick={()=>{setShowPlans(false);buy(p.id)}}><b>{p.id}</b><span>{p.price} {p.period}</span><small>{p.limit===Infinity?'∞':p.limit} user agents · {p.office}</small></button>)}</div></div></div>}{message&&<div className="toast">{message}<button onClick={()=>setMessage('')}>×</button></div>}</div>
}

createRoot(document.getElementById('root')).render(<App />)
