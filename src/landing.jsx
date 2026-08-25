import React, { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Html, PointerLockControls } from '@react-three/drei'
import * as THREE from 'three'
import './city3d.css'

const plans=[
{id:'FREE',price:'$0',period:'forever',limit:1,office:'S · 3 places'},
{id:'TRIAL',price:'$0',period:'14 days',limit:5,office:'M · 5 places'},
{id:'GO',price:'$4.99',period:'/ month',limit:5,office:'M · 5 places'},
{id:'PLUS',price:'$12.99',period:'/ month',limit:15,office:'L · 7 places'},
{id:'PRO',price:'$29.99',period:'/ month',limit:50,office:'XL · 10 places'},
{id:'LUXURY',price:'$199.50',period:'lifetime',limit:Infinity,office:'XXL · 15+'}
]
const categories=['Development','Data & Analytics','Finance','Business','Research','Marketing','Content','Design','Sales & E-commerce','HR','Legal & Compliance','Project Management','AI & Automation','QA & Testing','Security']

const buildings=[
{id:'FREE',p:[-52,0,-32],size:[30,12,24],accent:'#8b9aa2',label:'FREE OFFICE'},
{id:'TRIAL',p:[48,0,-44],size:[42,17,30],accent:'#7c919b',label:'TRIAL OFFICE'},
{id:'GO',p:[-62,0,42],size:[56,23,38],accent:'#6f858f',label:'GO OFFICE'},
{id:'PLUS',p:[34,0,54],size:[72,30,48],accent:'#647b86',label:'PLUS OFFICE'},
{id:'PRO',p:[104,0,8],size:[96,42,58],accent:'#526a76',label:'PRO HQ'},
{id:'LUXURY',p:[-116,0,92],size:[132,58,72],accent:'#455e6b',label:'LUXURY HQ'}
]
const colliders=buildings.map(b=>({x:b.p[0],z:b.p[2],w:b.size[0]+3,d:b.size[2]+3}))
const blocked=(x,z)=>colliders.some(c=>Math.abs(x-c.x)<c.w/2&&Math.abs(z-c.z)<c.d/2)

function Player({spawn=[0,2,125],onEnter}){
 const {camera}=useThree(); const keys=useRef({}); const previousE=useRef(false); const velocity=useRef(new THREE.Vector3())
 useEffect(()=>{
  camera.position.set(...spawn)
  const down=e=>keys.current[e.code]=true,up=e=>keys.current[e.code]=false
  window.addEventListener('keydown',down);window.addEventListener('keyup',up)
  return()=>{window.removeEventListener('keydown',down);window.removeEventListener('keyup',up)}
 },[camera,spawn])
 useFrame((_,dt)=>{
  dt=Math.min(dt,.045)
  const forward=(keys.current.KeyW||keys.current.ArrowUp?1:0)-(keys.current.KeyS||keys.current.ArrowDown?1:0)
  const side=(keys.current.KeyD||keys.current.ArrowRight?1:0)-(keys.current.KeyA||keys.current.ArrowLeft?1:0)
  const dir=new THREE.Vector3(side,0,-forward)
  if(dir.lengthSq()){dir.normalize();dir.applyEuler(new THREE.Euler(0,camera.rotation.y,0,'YXZ'));dir.y=0;dir.normalize()}
  const speed=(keys.current.ShiftLeft||keys.current.ShiftRight)?11:5.5
  velocity.current.lerp(dir.multiplyScalar(speed),.16)
  const nx=camera.position.x+velocity.current.x*dt,nz=camera.position.z+velocity.current.z*dt
  if(!blocked(nx,camera.position.z))camera.position.x=nx
  if(!blocked(camera.position.x,nz))camera.position.z=nz
  camera.position.y=2
  const e=!!keys.current.KeyE
  if(e&&!previousE.current&&onEnter){
   let best=null,dist=Infinity
   for(const b of buildings){const dx=camera.position.x-b.p[0],dz=camera.position.z-b.p[2],d=Math.hypot(dx,dz);if(d<Math.max(b.size[0],b.size[2])*.65&&d<18&&d<dist){best=b;dist=d}}
   if(best)onEnter(best)
  }
  previousE.current=e
 })
 return <PointerLockControls makeDefault/>
}

function Street({x=0,z=0,w=12,d=360}){return <group position={[x,.035,z]}><mesh receiveShadow><boxGeometry args={[w,.06,d]}/><meshStandardMaterial color="#d9dddb" roughness={.92}/></mesh><mesh position={[0,.035,0]}><boxGeometry args={[w*.08,.015,d]}/><meshStandardMaterial color="#f8f8f4"/></mesh></group>}
function Sidewalk({x,z,w,d}){return <mesh position={[x,.09,z]} receiveShadow><boxGeometry args={[w,.16,d]}/><meshStandardMaterial color="#e7e8e4" roughness={.9}/></mesh>}
function Tree({p}){return <group position={p}><mesh position={[0,1.4,0]} castShadow><cylinderGeometry args={[.18,.24,2.8,8]}/><meshStandardMaterial color="#8b7660"/></mesh><mesh position={[0,3.2,0]} castShadow><sphereGeometry args={[1.35,12,8]}/><meshStandardMaterial color="#91a996" roughness={1}/></mesh></group>}
function Lamp({p}){return <group position={p}><mesh position={[0,2.4,0]}><cylinderGeometry args={[.06,.06,4.8,8]}/><meshStandardMaterial color="#667177" metalness={.55}/></mesh><mesh position={[0,4.8,0]}><sphereGeometry args={[.18,10,8]}/><meshStandardMaterial color="#fff7d8" emissive="#fff2bd" emissiveIntensity={1.8}/></mesh></group>}

function Building({b,onEnter}){
 const [w,h,d]=b.size
 const floors=Math.max(2,Math.round(h/4.2)),cols=Math.max(4,Math.floor(w/6))
 const doorW=Math.min(6,w*.18)
 return <group position={b.p}>
  <mesh position={[0,-.02,0]} receiveShadow><boxGeometry args={[w+5,.18,d+5]}/><meshStandardMaterial color="#cfd4d2" roughness={.9}/></mesh>
  <mesh position={[0,h/2,0]} castShadow receiveShadow><boxGeometry args={[w,h,d]}/><meshStandardMaterial color="#eef0ed" roughness={.62}/></mesh>
  <mesh position={[0,h*.5,d/2+.08]}><boxGeometry args={[w-.8,h-.8,.14]}/><meshStandardMaterial color="#e5e8e5"/></mesh>
  {Array.from({length:floors*cols}).map((_,i)=>{const col=i%cols,row=Math.floor(i/cols);const x=-w/2+2.5+(col*(w-5)/Math.max(1,cols-1));const y=2+(row*(h-4)/Math.max(1,floors-1));return <mesh key={i} position={[x,y,d/2+.17]}><boxGeometry args={[Math.min(3.6,(w-5)/cols*.68),2.05,.12]}/><meshStandardMaterial color="#b9d2d5" metalness={.18} roughness={.22}/></mesh>})}
  <mesh position={[0,h*.52,d/2+.23]}><boxGeometry args={[doorW,h*.58,.2]}/><meshStandardMaterial color="#a9b9ba" metalness={.25} roughness={.22}/></mesh>
  <mesh position={[0,h*.52,d/2+.36]}><boxGeometry args={[doorW*.72,h*.52,.05]}/><meshStandardMaterial color="#d8eeee" transparent opacity={.72} metalness={.1}/></mesh>
  <mesh position={[0,h+.28,0]}><boxGeometry args={[w*.86,.56,d*.82]}/><meshStandardMaterial color={b.accent} metalness={.3}/></mesh>
  <mesh position={[0,h+.58,0]}><boxGeometry args={[w*.34,.12,d*.34]}/><meshStandardMaterial color="#f7f8f5"/></mesh>
  <Html position={[0,h+3,d/2+.8]} center distanceFactor={24}><div className="city-label"><b>{b.id}</b><span>{w}×{d}m</span></div></Html>
 </group>
}

function CityWorld({onEnter}){
 const trees=[]
 for(let x=-150;x<=150;x+=25){trees.push(<Tree key={'a'+x} p={[x,0,-8]}/>);trees.push(<Tree key={'b'+x} p={[x,0,78]}/>)}
 return <>
  <color attach="background" args={['#f4f6f3']}/><fog attach="fog" args={['#f4f6f3',170,330]}/>
  <ambientLight intensity={2.2}/><directionalLight position={[80,120,70]} intensity={4} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048}/>
  <mesh rotation={[-Math.PI/2,0,0]} receiveShadow><planeGeometry args={[380,380]}/><meshStandardMaterial color="#dfe3df" roughness={1}/></mesh>
  <Street x={0} z={0} w={15} d={360}/><Street x={-90} z={0} w={12} d={360}/><Street x={90} z={0} w={12} d={360}/><Street x={0} z={-90} w={360} d={12}/><Street x={0} z={90} w={360} d={12}/>
  <Sidewalk x={-7.5} z={0} w={2.2} d={360}/><Sidewalk x={7.5} z={0} w={2.2} d={360}/><Sidewalk x={0} z={-7.5} w={360} d={2.2}/><Sidewalk x={0} z={7.5} w={360} d={2.2}/>
  {trees}
  {[-75,75].flatMap(x=>[-60,0,60].map(z=><Lamp key={`${x}-${z}`} p={[x,0,z]}/>))}
  {buildings.map(b=><Building key={b.id} b={b} onEnter={onEnter}/>)}
  <Player onEnter={onEnter}/>
 </>
}

function City({onEnter}){return <div className="city-core"><Canvas shadows camera={{position:[0,2,125],fov:72}}><CityWorld onEnter={onEnter}/></Canvas><div className="city-hud"><div><span>AI COMPANY CITY</span><strong>THE OFFICE WORLD</strong><small>FIRST PERSON · WASD · MOUSE · SHIFT · E ENTER</small></div><div className="hud-status"><i/>LIVE</div></div><div className="city-tip">К зданию подойди ближе и нажми <b>E</b></div></div>}

function Desk({x,z,i}){return <group position={[x,0,z]}><mesh position={[0,1.05,0]} castShadow><boxGeometry args={[2.4,.12,1.2]}/><meshStandardMaterial color="#ffffff"/></mesh><mesh position={[-.9,.5,0]}><boxGeometry args={[.12,1,.12]}/><meshStandardMaterial color="#b7c0bd"/></mesh><mesh position={[.9,.5,0]}><boxGeometry args={[.12,1,.12]}/><meshStandardMaterial color="#b7c0bd"/></mesh><mesh position={[0,1.48,-.2]}><boxGeometry args={[1.05,.58,.06]}/><meshStandardMaterial color="#c8d7d7" metalness={.15}/></mesh><Agent x={0} z={.85} i={i}/></group>}
function Agent({x,z,i}){return <group position={[x,0,z]}><mesh position={[0,1.12,0]} castShadow><sphereGeometry args={[.28,14,10]}/><meshStandardMaterial color={i%3===0?'#7f9aa2':'#b2a99c'}/></mesh><mesh position={[0,.65,0]} castShadow><capsuleGeometry args={[.25,.75,6,10]}/><meshStandardMaterial color={i%2?'#d6dcd8':'#a9b8bc'}/></mesh><mesh position={[-.13,.28,0]}><boxGeometry args={[.1,.55,.1]}/><meshStandardMaterial color="#68747a"/></mesh><mesh position={[.13,.28,0]}><boxGeometry args={[.1,.55,.1]}/><meshStandardMaterial color="#68747a"/></mesh><Html position={[0,1.8,0]} center distanceFactor={12}><div className="agent-tag">AGENT {i+1}<small>WORKING</small></div></Html></group>}
function Office({building,onExit}){
 const [show,setShow]=useState(false);const [cat,setCat]=useState('Development')
 const count=Math.min(12,Math.max(3,building.size[0]===30?3:Math.round(building.size[0]/7)))
 return <div className="office-screen"><div className="office-top"><button className="pill ghost" onClick={onExit}>← CITY</button><div><b>{building.label}</b><small>FIRST PERSON · {building.size[0]}×{building.size[2]}m</small></div><button className="pill primary" onClick={()=>setShow(true)}>+ CREATE AGENT</button></div><div className="office-canvas"><Canvas shadows camera={{position:[0,2,18],fov:72}}><color attach="background" args={['#f5f6f3']}/><fog attach="fog" args={['#f5f6f3',35,95]}/><ambientLight intensity={2.4}/><directionalLight position={[20,35,15]} intensity={3.5} castShadow/><mesh rotation={[-Math.PI/2,0,0]} receiveShadow><planeGeometry args={[Math.max(38,building.size[0]*.75),Math.max(30,building.size[2]*.75)]}/><meshStandardMaterial color="#e9ebe7" roughness={1}/></mesh><mesh position={[0,5,-22]}><boxGeometry args={[42,10,.35]}/><meshStandardMaterial color="#ffffff"/></mesh><mesh position={[-21,5,0]}><boxGeometry args={[.35,10,44]}/><meshStandardMaterial color="#ffffff"/></mesh><mesh position={[21,5,0]}><boxGeometry args={[.35,10,44]}/><meshStandardMaterial color="#ffffff"/></mesh>{Array.from({length:count}).map((_,i)=>{const cols=3,rows=Math.ceil(count/cols),cx=(i%cols)-1,rz=Math.floor(i/cols);return <Desk key={i} x={cx*7} z={rz*5-3} i={i}/>})}<Player spawn={[0,2,18]}/></Canvas><div className="office-brief"><span>AI COMPANY / OFFICE</span><strong>{building.id}</strong><p>Светлый минималистичный офис. Каждый агент получает своё рабочее место и задачу.</p></div><div className="office-help">WASD · мышь · Shift · <b>Esc</b> выйти из захвата мыши</div></div>{show&&<div className="modal"><div className="modal-box"><button className="x" onClick={()=>setShow(false)}>×</button><span>DIRECTOR</span><h3>Create agent</h3><select value={cat} onChange={e=>setCat(e.target.value)}>{categories.map(c=><option key={c}>{c}</option>)}</select><button className="pill primary wide" onClick={()=>setShow(false)}>CREATE {cat.toUpperCase()} AGENT</button></div></div>}</div>
}
function App(){const [plan]=useState(plans[0]);const [office,setOffice]=useState(null);return office?<Office building={office} onExit={()=>setOffice(null)}/>:<div className="app-core"><City onEnter={setOffice}/><div className="core-top"><div className="core-brand"><b>3D OFFICE</b><span>AI COMPANY</span></div><button className="pill">{plan.id} · {plan.limit} agent</button></div></div>}

createRoot(document.getElementById('root')).render(<App/>)
