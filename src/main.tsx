import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, useSearchParams } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import VitessceViewer from './components/VitessceViewer.tsx'
import Header from './components/Header.tsx'
import Breadcrumb from './components/Breadcrumb.tsx'

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

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Layout />
    </BrowserRouter>
  </StrictMode>,
)
