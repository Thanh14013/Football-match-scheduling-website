import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { SupabaseProvider } from './contexts/SupabaseContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SupabaseProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </SupabaseProvider>
  </React.StrictMode>,
)