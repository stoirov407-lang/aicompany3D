import React, { useEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PointerLockControls, Html } from '@react-three/drei'
import * as THREE from 'three'
import './city3d.css'

const plans=[
 {id:'FREE',price:'$0',period:'forever',limit:1},
 {id:'TRIAL',price:'$0',period:'14 days',limit:5},
 {id:'GO',price:'$4.99',period:'/ month',limit:5},
 {id:'PLUS',price:'$12.99',period:'/ month',limit:15},
 {id:'PRO',price:'$29.99',period:'/ month',limit:50},
 {id:'LUXURY',price:'$199.50',period:'lifetime',limit:Infinity}
]
const categories=['Development','Data & Analytics','Finance','Business','Research','Marketing','Content','Design','Sales & E-commerce','HR','Legal & Compliance','Project Management','AI & Automation','QA & Testing','Security']

const buildings=[
 {id:'FREE',p:[-48,0,-32],size:[28,11,22],color:'#7b858b',label:'FREE OFFICE'},
 {id:'TRIAL',p:[38,0,-48],size:[42,16,30],color:'#627884',label:'TRIAL OFFICE'},
 {id:'GO',p:[-66,0,48],size:[58,22,38],color:'#526b78',label:'GO OFFICE'},
 {id:'PLUS',p:[34,0,62],size:[74,30,48],color:'#435e6c',label:'PLUS OFFICE'},
 {id:'PRO',p:[104,0,8],size:[100,42,60],color:'#365260',label:'PRO OFFICE'},
 {id:'LUXURY',p:[-112,0,102],size:[140,60,74],color:'#294652',label:'LUXURY HQ'}
]
const colliders=buildings.map(b=>({x:b.p[0],z:b.p[2],w:b.size[0]+3,d:b.size[2]+3}))
const blocked=(x,z)=>colliders.some(c=>Math.abs(x-c.x)<c.w/2+1.2&&Math.abs(z-c.z)<c.d/2+1.2)

function Player({spawn=[0,2,130],inside=false}){
 const {camera}=useThree(); const keys=useRef({}); const velocity=useRef(new THREE.Vector3()); const spawnRef=useRef(spawn)
 useEffect(()=>{camera.position.set(...spawnRef.current);camera.rotation.set(0,0,0);const down=e=>keys.current[e.code]=true;const up=e=>keys.current[e.code]=false;window.addEventListener('keydown',down);window.addEventListener('keyup',up);return()=>{window.removeEventListener('keydown',down);window.removeEventListener('keyup',up)}},[camera])
 useFrame((_,dt)=>{dt=Math.min(dt,.05);const f=(keys.current.KeyW||keys.current.ArrowUp?1:0)-(keys.current.KeyS||keys.current.ArrowDown?1:0);const s=(keys.current.KeyD||keys.current.ArrowRight?1:0)-(keys.current.KeyA||keys.current.ArrowLeft?1:0);const dir=new THREE.Vector3(s,0,-f);if(dir.lengthSq()){dir.normalize();const yaw=camera.rotation.y;dir.applyAxisAngle(new THREE.Vector3(0,1,0),yaw)}const speed=keys.current.ShiftLeft||keys.current.ShiftRight?14:7;velocity.current.lerp(dir.multiplyScalar(speed),1-Math.pow(.001,dt));const nx=camera.position.x+velocity.current.x*dt,nz=camera.position.z+velocity.current.z*dt;if(inside||!blocked(nx,camera.position.z))camera.position.x=nx;if(inside||!blocked(camera.position.x,nz))camera.position.z=nz;camera.position.y=2;camera.position.x=THREE.MathUtils.clamp(camera.position.x,-178,178);camera.position.z=THREE.MathUtils.clamp(camera.position.z,-178,178)})
 return <PointerLockControls makeDefault/> 
}

function Building({b}){
 const [w,h,d]=b.size;const cols=Math.max(5,Math.floor(w/5));const rows=Math.max(2,Math.floor(h/4));
 return <group position={b.p}>
  <mesh position={[0,h/2,0]} castShadow receiveShadow><boxGeometry args={[w,h,d]}/><meshStandardMaterial color={b.color} roughness={.38} metalness={.2}/></mesh>
  <mesh position={[0,.2,d/2+.15]}><boxGeometry args={[Math.min(16,w*.3),.4,.25]}/><meshStandardMaterial color="#152027" metalness={.65}/></mesh>
  {Array.from({length:rows*cols}).map((_,i)=>{const x=-w/2+3+(i%cols)*(w-6)/Math.max(1,cols-1);const y=3+(Math.floor(i/cols))*(h-5)/Math.max(1,rows-1);return <mesh key={i} position={[x,y,d/2+.13]}><boxGeometry args={[2.3,2,.08]}/><meshStandardMaterial color="#9bc1cd" emissive="#214756" emissiveIntensity={.4}/></mesh>})}
  <mesh position={[0,h+.25,0]}><boxGeometry args={[w*.72,.42,d*.72]}/><meshStandardMaterial color="#223943" metalness={.45}/></mesh>
  <Html position={[0,h+4,d/2]} center distanceFactor={24}><div className="city-label"><b>{b.id}</b><span>{w}×{d}m · {h}m</span></div></Html>
 </group>
}

function CityWorld(){return <>
 <color attach="background" args={['#0b1820']}/><ambientLight intensity={1.25}/><directionalLight position={[70,100,40]} intensity={3.5} castShadow/>
 <mesh rotation={[-Math.PI/2,0,0]} receiveShadow><planeGeometry args={[360,360]}/><meshStandardMaterial color="#303b40" roughness={.9}/></mesh>
 <gridHelper args={[360,72,'#4a565b','#263238']} position={[0,.03,0]}/>
 {[-105,0,105].map(x=><mesh key={'rx'+x} position={[x,.08,0]}><boxGeometry args={[11,.12,350]}/><meshStandardMaterial color="#161d22"/></mesh>)}
 {[-105,0,105].map(z=><mesh key={'rz'+z} position={[0,.09,z]}><boxGeometry args={[350,.12,11]}/><meshStandardMaterial color="#161d22"/></mesh>)}
 {buildings.map(b=><Building key={b.id} b={b}/>)}
 <Player/>
 </>}

function City(){return <div className="city-core"><Canvas shadows camera={{position:[0,2,130],fov:72}} gl={{antialias:true}}><CityWorld/></Canvas><div className="city-hud"><strong>AI COMPANY CITY</strong><span>FIRST PERSON · WASD / ARROWS · MOUSE · SHIFT</span></div><div className="city-bottom">FREE · TRIAL · GO · PLUS · PRO · LUXURY</div></div>}

function Office({building,onExit}){
 const [show,setShow]=useState(false);const [cat,setCat]=useState('Development');const [agents,setAgents]=useState([]);const width=Math.max(34,building.size[0]*.7);const depth=Math.max(28,building.size[2]*.7);const height=9;
 return <div className="office-screen"><div className="office-top"><button className="pill ghost" onClick={onExit}>← City</button><div><b>{building.label}</b><small>{building.size[0]}×{building.size[2]}m · FIRST PERSON</small></div><button className="pill primary" onClick={()=>setShow(true)}>+ Create agent</button></div><div className="office-canvas"><Canvas shadows camera={{position:[0,2,depth/2-5],fov:72}} gl={{antialias:true}}><color attach="background" args={['#e3e5e3']}/><ambientLight intensity={1.8}/><directionalLight position={[25,35,15]} intensity={3.2} castShadow/><mesh rotation={[-Math.PI/2,0,0]} receiveShadow><planeGeometry args={[width,depth]}/><meshStandardMaterial color="#d1d0ca" roughness={.8}/></mesh><mesh position={[0,height/2,-depth/2]}><boxGeometry args={[width,height,.3]}/><meshStandardMaterial color="#e9e8e3"/></mesh><mesh position={[-width/2,height/2,0]}><boxGeometry args={[.3,height,depth]}/><meshStandardMaterial color="#e9e8e3"/></mesh><mesh position={[width/2,height/2,0]}><boxGeometry args={[.3,height,depth]}/><meshStandardMaterial color="#e9e8e3"/></mesh>{Array.from({length:Math.min(30,Math.max(8,Math.floor(width/4)))}).map((_,i)=><mesh key={i} position={[-width/2+3+(i%Math.floor(width/4))*4,1,Math.floor(i/Math.floor(width/4))*4-depth/2+5]}><boxGeometry args={[2.3,.12,1.1]}/><meshStandardMaterial color="#b9b2a5"/></mesh>)}<Player spawn={[0,2,depth/2-5]} inside/></Canvas><div className="office-brief"><strong>{building.id} OFFICE</strong><span>WASD — ходьба · мышь — обзор · Shift — бег</span></div></div>{show&&<div className="modal"><div className="modal-box"><button className="x" onClick={()=>setShow(false)}>×</button><b>DIRECTOR</b><h3>Create agent</h3><select value={cat} onChange={e=>setCat(e.target.value)}>{categories.map(c=><option key={c}>{c}</option>)}</select><button className="pill primary wide" onClick={()=>{setAgents(a=>[...a,{cat,id:Date.now()}]);setShow(false)}}>Create agent</button></div></div>}</div>
}

function App(){const [plan,setPlan]=useState(plans[0]);const [office,setOffice]=useState(null);const [cityKey,setCityKey]=useState(0);return office?<Office building={office} onExit={()=>{setOffice(null);setCityKey(k=>k+1)}}/>:<div className="app-core"><City key={cityKey}/><div className="core-top"><div className="core-brand"><b>3D OFFICE</b><span>AI COMPANY</span></div><select value={plan.id} onChange={e=>setPlan(plans.find(p=>p.id===e.target.value))}>{plans.map(p=><option key={p.id} value={p.id}>{p.id}</option>)}</select></div><div className="enter-help">Подойди к зданию и нажми <b>E</b></div></div>}

createRoot(document.getElementById('root')).render(<App/>);