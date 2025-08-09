import { Routes, Route } from 'react-router-dom'
import './App.css'
import ShoppingList from './components/ShoppingList'
import ItemDetail from './components/ItemDetail'
import PageAbout from './components/PageAbout'
import { Page404 } from './components/Page404'
import { Contact } from './components/Contact'

function App() {
  return (
    <>
      <div className="App">
        <Routes>
          <Route path="/" element={<ShoppingList />} />
          <Route path="/about" element={<PageAbout />} />
          <Route path="/item/:itemId" element={<ItemDetail />} />
          <Route path='/contact' element={<Contact />} />
          <Route path="*" element={<Page404 />} />
        </Routes>
      </div>
    </>
  )
}

export default App
