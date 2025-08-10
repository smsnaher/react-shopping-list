import { Link, useLocation } from 'react-router-dom'
import { loadItemsFromStorage, getItemByIdFromList } from '../../data/items'
import './Breadcrumb.css'

interface BreadcrumbItem {
  path: string
  label: string
}

function Breadcrumb() {
  const location = useLocation()
  const pathnames = location.pathname.split('/').filter(x => x)

  // Don't show breadcrumbs on home page or 404 pages
  if (location.pathname === '/' || pathnames.includes('*')) {
    return null
  }

  // Load items from storage for breadcrumb labels
  const items = loadItemsFromStorage()

  // Define breadcrumb labels for different paths
  const breadcrumbLabels: { [key: string]: string } = {
    '': 'Home',
    'about': 'About',
    'contact': 'Contact',
    'item': 'Items'
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { path: '/', label: 'Home' }
  ]

  // Build breadcrumb trail
  let currentPath = ''
  pathnames.forEach((pathname, index) => {
    currentPath += `/${pathname}`
    
    // Special handling for item details
    if (pathname === 'item' && pathnames[index + 1]) {
      const itemId = pathnames[index + 1]
      
      // Add "Items" breadcrumb
      breadcrumbs.push({ path: currentPath, label: 'Items' })
      
      // Add specific item breadcrumb
      currentPath += `/${itemId}`
      const item = getItemByIdFromList(itemId, items)
      const itemLabel = item ? item.name : itemId.charAt(0).toUpperCase() + itemId.slice(1)
      breadcrumbs.push({ path: currentPath, label: itemLabel })
      
      return // Skip the next iteration since we handled both parts
    }
    
    // Skip if this is an item ID (already handled above)
    if (pathnames[index - 1] === 'item') {
      return
    }
    
    // Handle 404 or unknown routes
    if (!breadcrumbLabels[pathname] && !items.find(item => item.id === pathname)) {
      breadcrumbs.push({ path: currentPath, label: '404 - Not Found' })
      return
    }
    
    const label = breadcrumbLabels[pathname] || pathname.charAt(0).toUpperCase() + pathname.slice(1)
    breadcrumbs.push({ path: currentPath, label })
  })

  return (
    <nav className="breadcrumb">
      <ol className="breadcrumb-list">
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.path} className="breadcrumb-item">
            {index < breadcrumbs.length - 1 ? (
              <>
                <Link to={breadcrumb.path} className="breadcrumb-link">
                  {breadcrumb.label}
                </Link>
                <span className="breadcrumb-separator">›</span>
              </>
            ) : (
              <span className="breadcrumb-current">{breadcrumb.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export default Breadcrumb
