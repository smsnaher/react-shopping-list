import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  generateItemId, 
  loadItemsFromStorage, 
  saveItemsToStorage, 
  type Item 
} from '../data/items'
import Modal from '../components/Modal'

const Home = () => {
    const [items, setItems] = useState<Item[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false)

    // Load items from localStorage on component mount
    useEffect(() => {
        const storedItems = loadItemsFromStorage()
        setItems(storedItems)
    }, [])

    // Save items to localStorage whenever items change
    useEffect(() => {
        if (items.length > 0) {
            saveItemsToStorage(items)
        }
    }, [items])

    const handleNewList = () => {
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
    }

    const handleCreateList = (itemName: string) => {
        const newItem: Item = {
            id: generateItemId(itemName),
            name: itemName,
            quantity: 1, // Default quantity
            description: `New item: ${itemName}`
        }
        
        setItems(prevItems => {
            const updatedItems = [...prevItems, newItem]
            return updatedItems
        })
        console.log('Added new item:', newItem)
    }

    return (
        <div>
            <div className="header">
                <h3>Shopping List </h3>
                <button onClick={handleNewList}>+ add item</button>
            </div>

            <ul className="shopping-list">
                {items.map(item => (
                    <li key={item.id}>
                        <Link to={`/item/${item.id}`}>
                            <h2>{item.name}</h2>
                            <p>Quantity: {item.quantity}</p>
                        </Link>
                    </li>
                ))}
            </ul>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleCreateList}
                title="Add New Item"
            />
        </div>
    )
}

export default Home


