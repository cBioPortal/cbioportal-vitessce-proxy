import { useSearchParams, Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Vitessce } from '@vitessce/dev'

function VitessceViewer() {
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const dataset = searchParams.get('dataset')
  const jsonUrl = searchParams.get('json')
  const isEmbedMode = searchParams.get('embed') === 'true'
  const [config, setConfig] = useState(null)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setConfig(null)
    setError(null)

    if (jsonUrl) {
      fetch(jsonUrl)
        .then((res) => {
          if (!res.ok) throw new Error(`Failed to fetch config from: ${jsonUrl}`)
          return res.json()
        })
        .then(setConfig)
        .catch((err) => setError(err.message))
    } else if (dataset === '_custom') {
      const stored = sessionStorage.getItem('customVitessceConfig')
      if (stored) {
        try {
          setConfig(JSON.parse(stored))
        } catch {
          setError('Invalid stored config')
        }
      } else {
        setError('No custom config found')
      }
    } else if (dataset) {
      fetch(`/view_configs/${dataset}.json`)
        .then((res) => {
          if (!res.ok) throw new Error(`Config not found: ${dataset}`)
          return res.json()
        })
        .then(setConfig)
        .catch((err) => setError(err.message))
    }
  }, [dataset, jsonUrl])

  if (!dataset && !jsonUrl) {
    return (
      <div className="page">
        <p>No dataset specified. Please select a dataset from the <Link to="/">home page</Link>.</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page">
        <h2>Error</h2>
        <p>{error}</p>
        <Link to="/">← Back to home</Link>
      </div>
    )
  }

  if (!config) {
    return <div className="page">Loading...</div>
  }

  // Build embed URL (current URL + embed=true)
  const canEmbed = dataset !== '_custom'
  const embedUrl = canEmbed
    ? `${window.location.origin}${location.pathname}${location.search}${location.search ? '&' : '?'}embed=true`
    : null

  return (
    <div className="page-full">
      {!isEmbedMode && embedUrl && (
        <div className="embed-box">
          <p>Want to embed this view? Use this URL:</p>
          <div className="input-group">
            <input
              type="text"
              readOnly
              value={embedUrl}
              onClick={(e) => e.target.select()}
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(embedUrl)
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)
              }}
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      )}
      <Vitessce
        config={config}
        height={800}
        theme='light'
        debug={true}
      />
    </div>
  )
}

export default VitessceViewer
