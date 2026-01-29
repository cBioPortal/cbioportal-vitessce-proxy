import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, useSearchParams } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import VitessceViewer from './components/VitessceViewer.jsx'
import Header from './components/Header.jsx'
import Breadcrumb from './components/Breadcrumb.jsx'

// Detect if running in an iframe or if embed mode is requested via query param
const isInIframe = window.self !== window.top

function Layout() {
  const [searchParams] = useSearchParams()
  const embedMode = isInIframe || searchParams.get('embed') === 'true'

  return (
    <>
      {!embedMode && <Header />}
      {!embedMode && <Breadcrumb />}
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/view" element={<VitessceViewer />} />
      </Routes>
    </>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Layout />
    </BrowserRouter>
  </StrictMode>,
)
