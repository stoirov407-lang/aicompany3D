import React, { useMemo, useRef, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Html, PointerLockControls } from '@react-three/drei'
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

// Large real-world-scale buildings, deliberately spread around a city rather than a line.
const buildings=[
{id:'FREE',p:[-42,0,-28],size:[26,10,20],color:'#69757c',label:'FREE OFFICE'},
{id:'TRIAL',p:[38,0,-42],size:[38,15,28],color:'#526a77',label:'TRIAL OFFICE'},
{id:'GO',p:[-58,0,42],size:[52,21,34],color:'#49616f',label:'GO OFFICE'},
{id:'PLUS',p:[28,0,52],size:[68,29,44],color:'#3e5665',label:'PLUS OFFICE'},
{id:'PRO',p:[92,0,12],size:[94,40,56],color:'#344d5c',label:'PRO OFFICE'},
{id:'LUXURY',p:[-105,0,88],size:[135,58,70],color:'#263f4e',label:'LUXURY HQ'}
]
const colliders=buildings.map(b=>({x:b.p[0],z:b.p[2],w:b.size[0]+2,d:b.size[2]+2}))
const blocked=(x,z)=>colliders.some(c=>Math.abs(x-c.x)<c.w/2+1.1&&Math.abs(z-c.z)<c.d/2+1.1)

function Player({spawn=[0,2,120],inside=false}){
 const {camera}=useThree(); const keys=useRef({}); const velocity=useRef(new THREE.Vector3())
 useEffect(()=>{camera.position.set(...spawn); const d=e=>keys.current[e.code]=true,u=e=>keys.current[e.code]=false; window.addEventListener('keydown',d);window.addEventListener('keyup',u);return()=>{window.removeEventListener('keydown',d);window.removeEventListener('keyup',u)}},[camera,spawn])
 useFrame((_,dt)=>{dt=Math.min(dt,.05);const f=+!!keys.current.KeyW-+!!keys.current.KeyS||+!!keys.current.ArrowUp-+!!keys.current.ArrowDown;const s=+!!keys.current.KeyD-+!!keys.current.KeyA||+!!keys.current.ArrowRight-+!!keys.current.ArrowLeft;const dir=new THREE.Vector3(s,0,-f);if(dir.lengthSq()){dir.normalize();const yaw=new THREE.Euler(0,camera.rotation.y,0,'YXZ');dir.applyEuler(yaw);dir.y=0;dir.normalize()}const speed=(keys.current.ShiftLeft||keys.current.ShiftRight)?12:6;velocity.current.lerp(dir.multiplyScalar(speed),.2);const nx=camera.position.x+velocity.current.x*dt,nz=camera.position.z+velocity.current.z*dt;if(inside||!blocked(nx,camera.position.z))camera.position.x=nx;if(inside||!blocked(camera.position.x,nz))camera.position.z=nz;camera.position.y=2})
 return <PointerLockControls makeDefault/>
}
function Building({b}){const [w,h,d]=b.size;const rows=Math.max(2,Math.floor(h/4));const cols=Math.max(4,Math.floor(w/5));return <group position={b.p}>
 <mesh position={[0,h/2,0]} castShadow receiveShadow><boxGeometry args={[w,h,d]}/><meshStandardMaterial color={b.color} roughness={.42} metalness={.28}/></mesh>
 <mesh position={[0,.18,d/2+.12]}><boxGeometry args={[Math.min(14,w*.28),.36,.22]}/><meshStandardMaterial color="#18242b" metalness={.65}/></mesh>
 {Array.from({length:rows*cols}).map((_,i)=>{const x=-w/2+3+(i%cols)*(w-6)/Math.max(1,cols-1);const y=3+(Math.floor(i/cols))*(h-5)/Math.max(1,rows-1);return <mesh key={i} position={[x,y,d/2+.1]}><boxGeometry args={[2.3,2,.08]}/><meshStandardMaterial color="#7098a8" emissive="#244c5d" emissiveIntensity={.55}/></mesh>})}
 <mesh position={[0,h+.25,0]}><boxGeometry args={[w*.74,.4,d*.74]}/><meshStandardMaterial color="#273a44" metalness={.5}/></mesh>
 <Html position={[0,h+4,d/2]} center distanceFactor={25}><div className="city-label"><b>{b.id}</b><span>{w}×{d}m</span></div></Html>
 </group>}
function CityWorld(){return <><ambientLight intensity={1.5}/><directionalLight position={[80,100,50]} intensity={3.2} castShadow/><Environment preset="city"/><mesh rotation={[-Math.PI/2,0,0]} receiveShadow><planeGeometry args={[360,360]}/><meshStandardMaterial color="#303b42" roughness={.95}/></mesh>
 {[-90,0,90].map(x=><mesh key={'x'+x} position={[x,.06,0]}><boxGeometry args={[10,.1,350]}/><meshStandardMaterial color="#151d22"/></mesh>)}{[-90,0,90].map(z=><mesh key={'z'+z} position={[0,.065,z]}><boxGeometry args={[350,.1,10]}/><meshStandardMaterial color="#151d22"/></mesh>)}
 {buildings.map(b=><Building key={b.id} b={b}/>)}<Player/></>}
function City({onEnter}){return <div className="city-core"><Canvas shadows camera={{position:[0,2,120],fov:72}}><color attach="background" args={['#071727']}/><CityWorld/></Canvas><div className="city-hud"><div><span>3D OFFICE CITY</span><strong>AI COMPANY CITY</strong><small>FIRST PERSON · WASD · MOUSE · SHIFT</small></div><div className="hud-status"><i/>LIVE CITY</div></div><div className="city-bottom"><span>FREE · TRIAL · GO · PLUS · PRO · LUXURY</span></div></div>}
function Office({building,plan,onExit}){const [agents,setAgents]=useState([]);const [show,setShow]=useState(false);const [cat,setCat]=useState('Development');return <div className="office-screen"><div className="office-top"><button className="pill ghost" onClick={onExit}>← City</button><div><b>{building.label}</b><small>{building.size[0]}×{building.size[2]}m · FIRST PERSON</small></div><button className="pill primary" onClick={()=>setShow(true)}>+ Create agent</button></div><div className="office-canvas"><Canvas shadows camera={{position:[0,2,12],fov:72}}><color attach="background" args={['#d9d9d7']}/><ambientLight intensity={1.8}/><directionalLight position={[30,40,20]} intensity={3.2} castShadow/><Environment preset="city"/><mesh rotation={[-Math.PI/2,0,0]} receiveShadow><planeGeometry args={[Math.max(35,building.size[0]*.7),Math.max(28,building.size[2]*.7)]}/><meshStandardMaterial color="#d4d2cc"/></mesh><mesh position={[0,4,-18]}><boxGeometry args={[36,8,.3]}/><meshStandardMaterial color="#eceae4"/></mesh><mesh position={[-18,4,0]}><boxGeometry args={[.3,8,36]}/><meshStandardMaterial color="#eceae4"/></mesh><mesh position={[18,4,0]}><boxGeometry args={[.3,8,36]}/><meshStandardMaterial color="#eceae4"/></mesh><Player spawn={[0,2,12]} inside/></Canvas><div className="office-brief"><span>FIRST PERSON OFFICE</span><strong>{building.id}</strong><p>Большое рабочее пространство. WASD — ходьба, мышь — обзор, Shift — бег.</p></div></div>{show&&<div className="modal"><div className="modal-box"><button className="x" onClick={()=>setShow(false)}>×</button><span>DIRECTOR</span><h3>Create agent</h3><select value={cat} onChange={e=>setCat(e.target.value)}>{categories.map(c=><option key={c}>{c}</option>)}</select><button className="pill primary wide" onClick={()=>{setAgents(a=>[...a,{cat}]);setShow(false)}}>Create</button></div></div>}</div>}
function App(){const [plan,setPlan]=useState(plans[0]);const [office,setOffice]=useState(null);if(office)return <Office building={office} plan={plan} onExit={()=>setOffice(null)}/>;return <div className="app-core"><City onEnter={b=>setOffice(b)}/><div className="core-top"><div className="core-brand"><b>3D OFFICE</b><span>AI COMPANY</span></div><button className="pill">{plan.id} · {plan.limit===Infinity?'∞':plan.limit} agents</button></div></div>}
createRoot(document.getElementById('root')).render(<App/>);
