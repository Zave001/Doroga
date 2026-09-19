import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Landing } from './Landing.tsx'

const isToolRoute = window.location.pathname.replace(/\/+$/, '') === '/app'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isToolRoute ? <App /> : <Landing />}
  </StrictMode>,
)
