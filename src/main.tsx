import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const editable = 'input, textarea, select, [contenteditable="true"]'

document.addEventListener('selectstart', (event) => {
  const target = event.target
  if (target instanceof Element && target.closest(editable)) return
  event.preventDefault()
})

document.addEventListener(
  'contextmenu',
  (event) => {
    const target = event.target
    if (target instanceof Element && target.closest(editable)) return
    event.preventDefault()
  },
  true,
)

document.addEventListener(
  'dragstart',
  (event) => {
    event.preventDefault()
  },
  true,
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
