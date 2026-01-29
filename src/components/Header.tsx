import { Link } from 'react-router-dom'

function Header() {
  return (
    <header className="header">
      <Link to="/">
        <h1>cBioPortal Vitessce Proxy</h1>
      </Link>
    </header>
  )
}

export default Header
