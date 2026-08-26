import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './landing.jsx'
import './cityEnhancements.js'
import './cityControls.css'

const root = document.getElementById('root')
createRoot(root).render(<App />)
