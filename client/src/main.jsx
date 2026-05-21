import { BrowserRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'sonner'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
      <App />
      <Toaster toastOptions={{ style: { fontFamily: 'Poppins, sans-serif' } }} />
  </BrowserRouter>,
)
