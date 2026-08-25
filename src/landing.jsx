import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import './landing.css'

const plans = [
  { id:'FREE', price:'$0', period:'forever', agents:'1 active agent', office:'S · 3 places', note:'AI Director + base AI company', cta:'Start free' },
  { id:'TRIAL', price:'$0', period:'14 days', agents:'5 active agents', office:'M · 5 places', note:'All roles · priority support', cta:'Start trial' },
  { id:'GO', price:'$4.99', period:'/ month', agents:'5 active agents', office:'M · 5 places', note:'+1 slot · analytics', cta:'Choose GO' },
  { id:'PLUS', price:'$12.99', period:'/ month', agents:'15 active agents', office:'L · 7 places', note:'API · white label · export', cta:'Choose PLUS' },
  { id:'PRO', price:'$29.99', period:'/ month', agents:'50 active agents', office:'XL · 10 places', note:'AI analytics · 24/7 priority', cta:'Choose PRO' },
  { id:'LUXURY', price:'$199.50', period:'lifetime', agents:'Unlimited agents', office:'XXL · 15+', note:'All future updates included', cta:'Choose LUXURY' },
]

function City(){
  const buildings=Array.from({length:18})
  return <div className="city" aria-label="AI Company City">
    <div className="skyline-back">{buildings.slice(0,9).map((_,i)=><div key={i} className="building back" style={{height:`${90+i*17}px`}}/>)}</div>
    <div className="road"><span/><span/><span/></div>
    <div className="skyline-front">{buildings.slice(9).map((_,i)=><div key={i} className={`building front b${i%4}`}><div className="windows">{Array.from({length:12}).map((_,j)=><i key={j}/>)}</div><div className="office-sign">AI OFFICE</div></div>)}</div>
    <div className="city-overlay"><span>VIRTUAL CITY</span><b>∞ AI OFFICES</b><small>One company. Many intelligent teams.</small></div>
  </div>
}

function App(){
 const [selected,setSelected]=useState(null), [loading,setLoading]=useState(false), [message,setMessage]=useState('')
 const choose=async plan=>{
   setSelected(plan); setMessage('')
   if(plan==='FREE'||plan==='TRIAL') return
   setLoading(true)
   try{
     const r=await fetch('/api/create-checkout-session',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({plan})})
     const data=await r.json()
     if(data.url) window.location.href=data.url
     else setMessage(data.error||'Stripe checkout is not configured yet.')
   }catch(e){setMessage('Could not start checkout. Please try again.')}
   finally{setLoading(false)}
 }
 return <>
  <nav><div className="brand"><span className="logo">O</span> OFFICE <em>AI COMPANY</em></div><div className="links"><a href="#city">City</a><a href="#process">How it works</a><a href="#pricing">Pricing</a></div><button className="login">Sign in</button></nav>
  <main>
   <section className="hero" id="city"><div className="hero-copy"><div className="eyebrow">THE ONLINE COMPANY <span/></div><h1>Your company,<br/><i>alive online.</i></h1><p>Turn an offline organization into a working AI company: a Director, intelligent agents, discussion rooms, offices, tasks and reports — all inside one living virtual city.</p><div className="hero-actions"><button className="primary" onClick={()=>choose('FREE')}>Create free company <span>↗</span></button><a className="secondary" href="#process">See the process</a></div><div className="proof"><span className="dot"/> AI Director is free to start · Agents are saved even when a plan ends</div></div><City/></section>
   <section className="office-strip"><div className="office-scene"><div className="glass director-room"><strong>AI DIRECTOR</strong><span>Strategy · control · reports</span></div><div className="glass room r1"><b>MARKETING</b><small>Working</small></div><div className="glass room r2"><b>ANALYST</b><small>Thinking</small></div><div className="glass room r3"><b>DEVELOPER</b><small>Working</small></div><div className="glass meeting"><b>DISCUSSION ROOM</b><span>Director + selected agents</span></div></div></section>
   <section className="process" id="process"><div className="section-label">01 / COMPANY PROCESS</div><div className="process-grid"><div><h2>User gives a goal.<br/><i>Director runs the company.</i></h2><p>The user stays in control. The AI Director analyzes the goal, proposes the right agents, gathers them in the Discussion Room, assigns work, checks results and returns a clear report.</p></div><div className="steps">{[['01','GOAL','User gives the Director a business task.'],['02','DISCUSSION','Director calls the right agents into the meeting room.'],['03','WORK','Agents leave for their offices and execute tasks.'],['04','REPORT','Director verifies the work and explains what went right or wrong.']].map(s=><article key={s[0]}><span>{s[0]}</span><b>{s[1]}</b><p>{s[2]}</p></article>)}</div></div></section>
   <section className="pricing" id="pricing"><div className="section-label">02 / PLANS</div><div className="pricing-head"><h2>Start free.<br/><i>Scale the company.</i></h2><p>Creating and saving agents is free. Your plan controls how many agents can be active and how large the virtual office can become.</p></div><div className="cards">{plans.map(p=><article className={`card ${p.id==='PRO'?'featured':''}`} key={p.id}><div className="card-top"><span>{p.id}</span>{p.id==='PRO'&&<label>POPULAR</label>}</div><div className="price">{p.price}<small>{p.period}</small></div><b>{p.agents}</b><p>{p.office}</p><p className="note">{p.note}</p><button onClick={()=>choose(p.id)} disabled={loading}>{loading&&selected===p.id?'Opening…':p.cta}</button><small className="save">Saved agents are never deleted.</small></article>)}</div></section>
   <section className="promise"><div><span>03 / PRODUCT RULE</span><h2>Nothing disappears<br/><i>when a plan ends.</i></h2></div><p>When a paid plan expires, agents, tasks and company data stay in the account. Agents above the new active limit become inactive. Subscribe again and eligible agents can return to work.</p></section>
  </main><footer><span>OFFICE · AI COMPANY</span><span>Virtual offices for intelligent teams</span></footer>
  {selected&&(selected==='FREE'||selected==='TRIAL')&&<div className="modal" onClick={()=>setSelected(null)}><div className="modal-box" onClick={e=>e.stopPropagation()}><button className="x" onClick={()=>setSelected(null)}>×</button><span>START {selected}</span><h3>{selected==='FREE'?'Create your AI company':'Start your 14-day trial'}</h3><p>{selected==='FREE'?'AI Director and your base company are free. No card required.':'Try the expanded team experience for 14 days.'}</p><button className="primary wide" onClick={()=>setSelected(null)}>Continue</button></div></div>}
  {message&&<div className="toast">{message}<button onClick={()=>setMessage('')}>×</button></div>}
 </>
}

createRoot(document.getElementById('root')).render(<App/>)
