import React, { useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import { Environment, Html, OrbitControls } from '@react-three/drei'
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

// Only subscription offices are visible in the city. Each level is physically larger than the previous one.
const buildings=[
  {id:'FREE',p:[-10,0,-1],s:.58,l:'FREE OFFICE',c:'S',places:3},
  {id:'GO',p:[-4.7,0,-1],s:.82,l:'GO OFFICE',c:'M',places:5},
  {id:'PLUS',p:[1.8,0,-1],s:1.08,l:'PLUS OFFICE',c:'L',places:7},
  {id:'PRO',p:[9.4,0,-1],s:1.38,l:'PRO OFFICE',c:'XL',places:10},
  {id:'LUXURY',p:[18.5,0,-1],s:1.78,l:'LUXURY HQ',c:'XXL',places:15}
]

function Building({b,onEnter}){
  const fins=useMemo(()=>Array.from({length:12}),[])
  const windows=useMemo(()=>Array.from({length:10}),[])
  return <group position={b.p} scale={b.s} onClick={()=>onEnter(b)}>
    {/* Solid foundation keeps every building visibly planted on the ground. */}
    <mesh position={[0,.08,0]} receiveShadow><boxGeometry args={[5.1,.16,3.9]}/><meshStandardMaterial color="#303a44" roughness={.55} metalness={.35}/></mesh>
    <mesh position={[0,1.9,0]} castShadow receiveShadow><boxGeometry args={[4.6,3.6,3.4]}/><meshStandardMaterial color="#1b2530" roughness={.38} metalness={.55}/></mesh>
    <mesh position={[0,.65,1.73]}><boxGeometry args={[4.2,1.3,.06]}/><meshPhysicalMaterial color="#18374b" transmission={.35} roughness={.12} metalness={.35}/></mesh>
    {fins.map((_,i)=><group key={i} position={[-2.02+i*.365,1.85,1.76]}><mesh><boxGeometry args={[.1,3.45,.12]}/><meshStandardMaterial color="#6f7880" metalness={.65} roughness={.3}/></mesh><mesh position={[0,0,.08]}><boxGeometry args={[.04,3.1,.03]}/><meshStandardMaterial color="#d7a64c" emissive="#d7a64c" emissiveIntensity={1.8}/></mesh></group>)}
    {windows.map((_,i)=><mesh key={i} position={[-1.55+(i%5)*.775,1.55,(i>4?-1.73:1.73)]}><boxGeometry args={[.52,.8,.04]}/><meshStandardMaterial color="#4f778a" emissive="#21495d" emissiveIntensity={.7}/></mesh>)}
    <mesh position={[0,3.68,0]}><boxGeometry args={[4.9,.18,3.65]}/><meshStandardMaterial color="#303b46" metalness={.5}/></mesh>
    <Html center position={[0,4.25,0]} distanceFactor={12}><button className="city-label" onClick={e=>{e.stopPropagation();onEnter(b)}}><b>{b.l}</b><span>{b.places} places · {b.c}</span></button></Html>
  </group>
}

function City({onEnter}){
  return <div className="city-core">
    <Canvas shadows camera={{position:[15,13,25],fov:42}}>
      <color attach="background" args={['#071727']}/>
      <ambientLight intensity={1.2}/><directionalLight position={[10,20,8]} intensity={2.5} castShadow/>
      <pointLight position={[2,7,1]} intensity={10} distance={45} color="#d7a64c"/>
      <Environment preset="city"/>
      <mesh rotation={[-Math.PI/2,0,0]} receiveShadow><planeGeometry args={[56,28]}/><meshStandardMaterial color="#101c27" roughness={.9}/></mesh>
      <gridHelper args={[54,28,'#243442','#111f2c']} position={[0,.03,0]}/>
      <mesh position={[0,.08,3]}><boxGeometry args={[54,.12,2.6]}/><meshStandardMaterial color="#1b2834"/></mesh>
      {buildings.map(b=><Building key={b.id} b={b} onEnter={onEnter}/>)}
      <OrbitControls enablePan enableDamping minDistance={7} maxDistance={45} maxPolarAngle={Math.PI/2.02}/>
    </Canvas>
    <div className="city-hud"><div><span>3D OFFICE</span><strong>AI COMPANY CITY</strong><small>Explore the five subscription offices</small></div><div className="hud-status"><i/>LIVE CITY</div></div>
    <div className="city-bottom"><span>FREE → GO → PLUS → PRO → LUXURY</span><button className="hud-button" onClick={()=>onEnter(buildings[0])}>ENTER FREE OFFICE</button></div>
  </div>
}

function AgentDialog({plan,onClose,onCreated}){
  const [category,setCategory]=useState('Development'); const [stage,setStage]=useState('suggest')
  const confirm=()=>stage==='suggest'?setStage('warning'):onCreated(category)
  return <div className="modal"><div className="modal-box agent-dialog"><button className="x" onClick={onClose}>×</button>{stage==='suggest'?<><span>DIRECTOR</span><h3>I understand what you want to accomplish.</h3><p>I recommend a <strong>{category}</strong> agent for this task. You can choose a different category.</p><select value={category} onChange={e=>setCategory(e.target.value)}>{categories.map(c=><option key={c}>{c}</option>)}</select><button className="pill primary wide" onClick={confirm}>Allow Director to create</button><button className="text-btn" onClick={onClose}>Cancel</button></>:<><span>FINAL CONFIRMATION</span><h3>Create {category} agent?</h3><p>Your <strong>{plan.id}</strong> plan has {plan.limit===Infinity?'unlimited':plan.limit} user-agent slots. This agent uses one slot.</p><p className="warning">This is the last confirmation. The category becomes permanent and cannot be changed later. Agree?</p><button className="pill primary wide" onClick={confirm}>Agree & create agent</button><button className="text-btn" onClick={onClose}>Cancel</button></>}</div></div>
}

function Office({building,plan,onExit,onBuy}){
  const [agents,setAgents]=useState([]); const [chat,setChat]=useState(''); const [showCreate,setShowCreate]=useState(false)
  const owned=plan.id===building.id || plan.id==='LUXURY' || (building.id==='FREE'&&plan.id==='FREE') || (building.id==='TRIAL'&&plan.id==='TRIAL')
  const remaining=plan.limit===Infinity?'∞':Math.max(0,plan.limit-agents.length)
  const send=()=>{if(!chat.trim())return;setChat('');setShowCreate(true)}
  const created=cat=>{setAgents(a=>[...a,{id:Date.now(),cat}]);setShowCreate(false)}
  return <div className="office-screen"><div className="office-top"><button className="pill ghost" onClick={onExit}>← City</button><div><b>{building.l}</b><small>{owned?'ACTIVE OFFICE':'PREVIEW · '+building.c+' OFFICE'} · {agents.length}/{remaining} user agents</small></div>{!owned?<button className="pill primary" onClick={()=>onBuy(building.id)}>Buy {building.id}</button>:<button className="pill primary" onClick={()=>setShowCreate(true)} disabled={remaining===0}>+ Create agent</button>}</div>
    <div className="office-canvas"><Canvas shadows camera={{position:[10,8,13],fov:48}}><color attach="background" args={['#d9d9d7']}/><ambientLight intensity={2}/><directionalLight position={[4,12,6]} intensity={3} castShadow/><Environment preset="city"/>
      <mesh rotation={[-Math.PI/2,0,0]} receiveShadow><planeGeometry args={[24,20]}/><meshStandardMaterial color="#d8d7d2" roughness={.8}/></mesh>
      <mesh position={[0,3,-9]}><boxGeometry args={[24,6,.15]}/><meshStandardMaterial color="#f1f0eb"/></mesh>
      <mesh position={[0,3,9]}><boxGeometry args={[24,6,.15]}/><meshStandardMaterial color="#f1f0eb"/></mesh>
      <mesh position={[-12,3,0]}><boxGeometry args={[.15,6,18]}/><meshStandardMaterial color="#f1f0eb"/></mesh>
      <group position={[7,2.7,-4.8]}><mesh><boxGeometry args={[6,.12,5.5]}/><meshStandardMaterial color="#f4f3ef"/></mesh><mesh position={[0,1.45,-2.7]}><boxGeometry args={[6,2.8,.08]}/><meshPhysicalMaterial color="#c9d0d2" transmission={.7} roughness={.12}/></mesh><mesh position={[-3,1.45,0]}><boxGeometry args={[.08,2.8,5.5]}/><meshPhysicalMaterial color="#c9d0d2" transmission={.7} roughness={.12}/></mesh><mesh position={[0,2.8,0]}><boxGeometry args={[6,.08,5.5]}/><meshStandardMaterial color="#ecebe7"/></mesh><Html position={[0,1.5,0]} center><div className="room-sign">DIRECTOR OFFICE</div></Html><mesh position={[0,.8,-1]}><boxGeometry args={[2,.15,1]}/><meshStandardMaterial color="#e7e5df"/></mesh><mesh position={[0,1.4,-1.15]}><boxGeometry args={[.8,1.1,.08]}/><meshStandardMaterial color="#171b20"/></mesh></group>
      <group>{Array.from({length:8}).map((_,i)=>{const x=-6+(i%4)*4;const z=2+Math.floor(i/4)*4;return <group key={i} position={[x,0,z]}><mesh position={[0,.75,0]}><boxGeometry args={[3,.12,1.25]}/><meshStandardMaterial color="#f1f0eb"/></mesh><mesh position={[0,1.3,0]}><boxGeometry args={[.85,.55,.05]}/><meshStandardMaterial color="#171b20"/></mesh><mesh position={[0,.45,.8]}><boxGeometry args={[.9,.08,.08]}/><meshStandardMaterial color="#24282c"/></mesh></group>})}</group>
      {agents.map((a,i)=><Html key={a.id} position={[-6+(i%4)*4,1.8,2+Math.floor(i/4)*4]} center><div className="agent-tag">{a.cat}<small>WORKING</small></div></Html>)}
      <OrbitControls enablePan enableDamping minDistance={4} maxDistance={28} maxPolarAngle={Math.PI/2.05}/>
    </Canvas><div className="office-brief"><span>WELCOME</span><strong>DIRECTOR</strong><p>“Здравствуйте. Что вы хотите сделать или создать?”</p>{!owned&&<button className="pill primary" onClick={()=>onBuy(building.id)}>Посмотреть условия {building.id}</button>}</div>
      <div className="office-chat"><div className="chat-title">DIRECTOR · WORK PLANNING</div><div className="chat-bubble">Я анализирую вашу цель, подбираю подходящих агентов и после работы проверяю результат.</div><div className="chat-row"><input value={chat} onChange={e=>setChat(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="Что вы хотите сделать?"/><button onClick={send}>Send</button></div></div>
    </div>{showCreate&&<AgentDialog plan={plan} onClose={()=>setShowCreate(false)} onCreated={created}/>}</div>
}

function App(){
  const [plan,setPlan]=useState(plans[0]); const [office,setOffice]=useState(null); const [showPlans,setShowPlans]=useState(false); const [message,setMessage]=useState('')
  const buy=async id=>{const p=plans.find(x=>x.id===id);if(!p||p.id==='FREE'||p.id==='TRIAL'){setPlan(p||plan);setOffice(buildings.find(b=>b.id===id)||buildings[0]);return} try{const r=await fetch('/api/create-checkout-session',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({plan:p.id})});const d=await r.json();if(d.url)window.location.href=d.url;else{setMessage(d.error||'Checkout is not configured yet.');setShowPlans(true)}}catch{setMessage('Could not start checkout.')}}
  if(office)return <Office building={office} plan={plan} onExit={()=>setOffice(null)} onBuy={buy}/>
  return <div className="app-core"><City onEnter={setOffice}/><div className="core-top"><div className="core-brand"><b>3D OFFICE</b><span>AI COMPANY</span></div><button className="pill" onClick={()=>setShowPlans(true)}>{plan.id} · {plan.limit===Infinity?'∞':plan.limit} agents</button></div>{showPlans&&<div className="modal"><div className="modal-box plans-modal"><button className="x" onClick={()=>setShowPlans(false)}>×</button><span>OFFICES & PLANS</span><h3>Choose the company space you need.</h3><div className="plan-list">{plans.map(p=><button key={p.id} className="plan-row" onClick={()=>{setShowPlans(false);buy(p.id)}}><b>{p.id}</b><span>{p.price} {p.period}</span><small>{p.limit===Infinity?'∞':p.limit} user agents · {p.office}</small></button>)}</div></div></div>}{message&&<div className="toast">{message}<button onClick={()=>setMessage('')}>×</button></div>}</div>
}

createRoot(document.getElementById('root')).render(<App/>)