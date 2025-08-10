import { Routes, Route } from 'react-router-dom'
import './App.css'
// import { Navigation, Breadcrumb } from './components/index'
import Home from './pages/Home'
import ItemDetail from './pages/ItemDetail'
import About from './pages/About'
import NotFound from './pages/NotFound'
import Contact from './pages/Contact'

function App() {
  return (
    <>
      {/* <Navigation /> */}
      {/* <Breadcrumb /> */}
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/item/:itemId" element={<ItemDetail />} />
          <Route path='/contact' element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  )
}

export default App
