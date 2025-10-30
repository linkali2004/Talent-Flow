import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import Navbar from "../src/components/Navbar.jsx"
import ContextProvider from './libs/context.jsx'
import MirageHandler from './components/MirageHandler.jsx'
import { ToastContainer } from 'react-toastify'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ContextProvider>
      <MirageHandler></MirageHandler>
      <ToastContainer></ToastContainer>
    <BrowserRouter>
    <Navbar></Navbar>
    <App />
    </BrowserRouter>
    </ContextProvider>
  </StrictMode>,
)
