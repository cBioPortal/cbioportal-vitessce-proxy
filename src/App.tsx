import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect, FormEvent } from 'react'

interface ViewConfig {
  path: string
  name: string
}

function App() {
  const [viewConfigs, setViewConfigs] = useState<ViewConfig[]>([])
  const [customConfig, setCustomConfig] = useState('')
  const [jsonUrl, setJsonUrl] = useState('')
  const [indexUrl, setIndexUrl] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [indexError, setIndexError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Try to load from sessionStorage first
    const storedIndexUrl = sessionStorage.getItem('remoteIndexUrl')
    if (storedIndexUrl) {
      setIndexUrl(storedIndexUrl)
      loadIndexFromUrl(storedIndexUrl)
    } else {
      // Fall back to local index.json if it exists
      fetch(`${import.meta.env.BASE_URL}view_configs/index.json`)
        .then((res) => {
          if (!res.ok) throw new Error('No local index found')
          return res.json()
        })
        .then(setViewConfigs)
        .catch(() => setViewConfigs([]))
    }
  }, [])

  const loadIndexFromUrl = (url: string) => {
    setIndexError(null)
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch index from: ${url}`)
        return res.json()
      })
      .then((data) => {
        setViewConfigs(data)
        sessionStorage.setItem('remoteIndexUrl', url)
      })
      .catch((err: Error) => {
        setIndexError(err.message)
        setViewConfigs([])
      })
  }

  const handleIndexSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (indexUrl.trim()) {
      loadIndexFromUrl(indexUrl.trim())
    }
  }

  const handleClearIndex = () => {
    sessionStorage.removeItem('remoteIndexUrl')
    setIndexUrl('')
    setViewConfigs([])
    setIndexError(null)
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    try {
      const parsed = JSON.parse(customConfig)
      sessionStorage.setItem('customVitessceConfig', JSON.stringify(parsed))
      navigate('/view?dataset=_custom')
    } catch (err) {
      setError('Invalid JSON: ' + (err instanceof Error ? err.message : String(err)))
    }
  }

  const handleUrlSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (jsonUrl.trim()) {
      navigate(`/view?config_url=${encodeURIComponent(jsonUrl.trim())}`)
    }
  }

  return (
    <div className="page">
      <section className="section">
        <h2>Configure Dataset Index</h2>
        <p className="text-muted">
          Provide a remote URL to an index.json file listing your available datasets.
        </p>
        <form onSubmit={handleIndexSubmit}>
          <input
            type="url"
            value={indexUrl}
            onChange={(e) => setIndexUrl(e.target.value)}
            placeholder="https://example.com/vitessce/index.json"
            style={{ maxWidth: '600px' }}
          />
          {indexError && <p className="error">{indexError}</p>}
          <div className="button-group">
            <button type="submit" className="primary">Load Index</button>
            {sessionStorage.getItem('remoteIndexUrl') && (
              <button type="button" onClick={handleClearIndex}>
                Clear Index
              </button>
            )}
          </div>
        </form>
      </section>

      {viewConfigs.length > 0 && (
        <section className="section">
          <h2>Available Datasets</h2>
          <ul>
            {viewConfigs.map((config) => (
              <li key={config.path}>
                <Link to={`/view?dataset=${config.path}`}>{config.name}</Link>
                {' '}
                <a
                  href={config.path}
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
      )}

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
          </div>
        </form>
      </section>
    </div>
  )
}

export default App
