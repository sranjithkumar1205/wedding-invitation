import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

document.addEventListener('selectstart', (event) => {
  const target = event.target
  if (target instanceof Element && target.closest('input, textarea, select, [contenteditable="true"]')) return
  event.preventDefault()
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
