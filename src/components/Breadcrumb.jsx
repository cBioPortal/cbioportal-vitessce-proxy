import { Link, useLocation, useSearchParams } from 'react-router-dom'

function Breadcrumb() {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const pathSegments = location.pathname.split('/').filter(Boolean)
  const dataset = searchParams.get('dataset')
  const jsonUrl = searchParams.get('json')

  // Don't show breadcrumb on home page
  if (pathSegments.length === 0) {
    return null
  }

  // Build display segments from path + dataset/json query param
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1)

  const displaySegments = pathSegments.map((segment) => capitalize(decodeURIComponent(segment)))
  if (jsonUrl) {
    displaySegments.push('External Config')
  } else if (dataset) {
    displaySegments.push(dataset)
  }

  return (
    <nav className="breadcrumb">
      <Link to="/">Home</Link>
      {displaySegments.map((segment) => (
        <span key={segment}>
          <span className="separator">/</span>
          <span>{segment}</span>
        </span>
      ))}
    </nav>
  )
}

export default Breadcrumb
