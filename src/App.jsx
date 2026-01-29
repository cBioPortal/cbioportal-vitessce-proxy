import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

function App() {
  const [viewConfigs, setViewConfigs] = useState([])
  const [customConfig, setCustomConfig] = useState('')
  const [jsonUrl, setJsonUrl] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}view_configs/index.json`)
      .then((res) => res.json())
      .then(setViewConfigs)
      .catch(() => setViewConfigs([]))
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    setError(null)
    try {
      const parsed = JSON.parse(customConfig)
      sessionStorage.setItem('customVitessceConfig', JSON.stringify(parsed))
      navigate('/view?dataset=_custom')
    } catch (err) {
      setError('Invalid JSON: ' + err.message)
    }
  }

  const handleUrlSubmit = (e) => {
    e.preventDefault()
    if (jsonUrl.trim()) {
      navigate(`/view?json=${encodeURIComponent(jsonUrl.trim())}`)
    }
  }

  return (
    <div className="page">
      <section className="section">
        <h2>Available Datasets</h2>
        <ul>
          {viewConfigs.map((config) => (
            <li key={config.path}>
              <Link to={`/view?dataset=${config.path}`}>{config.name}</Link>
              {' '}
              <a
                href={`${import.meta.env.BASE_URL}view_configs/${config.path}.json`}
                target="_blank"
                rel="noopener noreferrer"
                className="json-link"
              >
                (json)
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="section">
        <h2>Custom Config</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            value={customConfig}
            onChange={(e) => setCustomConfig(e.target.value)}
            placeholder="Paste Vitessce JSON config here..."
            rows={10}
            style={{ maxWidth: '600px' }}
          />
          {error && <p className="error">{error}</p>}
          <div className="button-group">
            <button type="submit" className="primary">Load Config</button>
          </div>
        </form>
      </section>

      <section className="section">
        <h2>Load from URL</h2>
        <form onSubmit={handleUrlSubmit}>
          <input
            type="url"
            value={jsonUrl}
            onChange={(e) => setJsonUrl(e.target.value)}
            placeholder="https://example.com/config.json"
            style={{ maxWidth: '600px' }}
          />
          <div className="button-group">
            <button type="submit" className="primary">Load from URL</button>
            <button
              type="button"
              onClick={() => setJsonUrl(`${window.location.origin}${import.meta.env.BASE_URL}view_configs/spectrum_all_cells_csc_chunked_all_10.zarr.json`)}
            >
              Example
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default App
