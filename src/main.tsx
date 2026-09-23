import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { colors } from './core/theme/colors'
import { typography } from './core/theme/typography'
import './index.css'
import App from './App.tsx'

document.body.style.background = colors.background
document.body.style.fontFamily = typography.fontFamily

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)