import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Modal } from '../components/index'
import {
    generateItemId,
    loadItemsFromStorage,
    saveItemsToStorage,
    type Item
} from '../data/items'

const Home = () => {
    const [items, setItems] = useState<Item[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false)

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

    // Monitor modal state changes
    useEffect(() => {
        console.log('Modal state changed:', isModalOpen)
    }, [isModalOpen])

    const handleNewList = () => {
        setIsModalOpen(true);
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

    const handleDeleteItem = (itemId: string) => {
        const userConfirmed = confirm("Are you sure you want to delete this item?");
        if (!userConfirmed) return;

        setItems(prevItems => {

            const updatedItems = prevItems.filter(item => item.id !== itemId)
            return updatedItems
        })
        console.log('Deleted item:', itemId)
    }
    return (
        <div>
            <div className="header">
                <h3>Shopping List </h3>
                <button onClick={handleNewList}>+ Add a List</button>
            </div>

            <ul className="shopping-list">
                {items.map(item => (
                    <li key={item.id}>
                        <Link to={`/item/${item.id}`}>
                            <h2>{item.name}</h2>
                            <p>Quantity: {item.quantity}</p>
                        </Link>
                        <button onClick={() => handleDeleteItem(item.id)}>🗑</button>
                    </li>
                ))}
            </ul>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleCreateList}
                title="Add New List Item"
            />
        </div>
    )
}

export default Home


