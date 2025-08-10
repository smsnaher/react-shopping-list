import { Link, useLocation } from 'react-router-dom'
import './Navigation.css'

function Navigation() {
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Shopping List', icon: '🛒' },
    { path: '/about', label: 'About', icon: 'ℹ️' },
    { path: '/contact', label: 'Contact', icon: '📧' },
  ]

  return (
    <nav className="navigation">
      <div className="nav-brand">
        <Link to="/">
          <h1>🛍️ My Shopping App</h1>
        </Link>
      </div>
      <ul className="nav-menu">
        {navItems.map(item => (
          <li key={item.path} className="nav-item">
            <Link 
              to={item.path} 
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-text">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Navigation
