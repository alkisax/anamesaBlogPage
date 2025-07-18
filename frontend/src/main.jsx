import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

const bgColor = import.meta.env.VITE_BLOG_BG_COLOR
// console.log('VITE_BLOG_BG_COLOR:', bgColor)
document.documentElement.style.setProperty('--bg-color', bgColor);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
