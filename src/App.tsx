import { Routes, Route } from 'react-router-dom'
import './App.css'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import UserProfile from './components/UserProfile'
import Home from './pages/Home'
import ItemDetail from './pages/ItemDetail'
import About from './pages/About'
import NotFound from './pages/NotFound'
import Contact from './pages/Contact'

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <header className="app-header">
          <h1>Shopping List App</h1>
          <UserProfile />
        </header>
        <main>
          <ProtectedRoute>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/item/:itemId" element={<ItemDetail />} />
              <Route path='/contact' element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ProtectedRoute>
        </main>
      </div>
    </AuthProvider>
  )
}

export default App
