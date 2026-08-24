import React from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

function OfficeVisual() {
  return (
    <div className="office-wrap" aria-label="3D-style AI office visualization">
      <div className="glow" />
      <div className="office">
        <div className="ceiling" />
        <div className="back-wall">
          <div className="window"><span /></div>
          <div className="director-screen">AI<br /><strong>DIRECTOR</strong></div>
        </div>
        <div className="floor" />
        <div className="desk desk-main"><span className="screen" /><span className="leg" /><span className="leg right" /></div>
        <div className="chair" />
        <div className="desk desk-side"><span className="screen small" /></div>
        <div className="plant"><i /><i /><i /><i /></div>
        <div className="orb">AI</div>
      </div>
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
          <div className="micro"><span className="status" /> Built to operate, not just demonstrate.</div>
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
