import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Modal } from '../components/index'
import { useAuth } from '../contexts/AuthContext'
import { FirestoreService } from '../services/firestore'
import type { Item } from '../data/items'

const Home = () => {
    const { currentUser } = useAuth()
    const [items, setItems] = useState<Item[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [loading, setLoading] = useState(true)

    // Load items from Firestore when user is available
    useEffect(() => {
        const loadItems = async () => {
            if (currentUser) {
                try {
                    setLoading(true)
                    const userItems = await FirestoreService.getUserItems(currentUser.uid)
                    setItems(userItems)
                } catch (error) {
                    console.error('Error loading items:', error)
                } finally {
                    setLoading(false)
                }
            } else {
                setItems([])
                setLoading(false)
            }
        }

        loadItems()
    }, [currentUser])

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

    const handleCreateList = async (itemName: string) => {
        if (!currentUser) return

        try {
            const newItem = {
                name: itemName,
                quantity: 1,
                description: `New item: ${itemName}`,
                childItems: []
            }

            const itemId = await FirestoreService.createItem(newItem, currentUser.uid)
            
            // Add the new item to local state with the Firestore-generated ID
            setItems(prevItems => [
                { ...newItem, id: itemId },
                ...prevItems
            ])
            
            console.log('Added new item:', { ...newItem, id: itemId })
        } catch (error) {
            console.error('Error creating item:', error)
            alert('Failed to create item. Please try again.')
        }
    }

    const handleDeleteItem = async (itemId: string) => {
        if (!currentUser) return

        const userConfirmed = confirm("Are you sure you want to delete this item?")
        if (!userConfirmed) return

        try {
            await FirestoreService.deleteItem(itemId, currentUser.uid)
            
            // Remove from local state
            setItems(prevItems => prevItems.filter(item => item.id !== itemId))
            console.log('Deleted item:', itemId)
        } catch (error) {
            console.error('Error deleting item:', error)
            alert('Failed to delete item. Please try again.')
        }
    }
    return (
        <div>
            <div className="header">
                <h3>Shopping List </h3>
                <button onClick={handleNewList}>+ Add a List</button>
            </div>

            {loading ? (
                <div>Loading your shopping lists...</div>
            ) : (
                <ul className="shopping-list">
                    {items.length === 0 ? (
                        <li style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                            No shopping lists yet. Create your first one!
                        </li>
                    ) : (
                        items.map(item => (
                            <li key={item.id}>
                                <Link to={`/item/${item.id}`}>
                                    <h2>{item.name}</h2>
                                    <p>Items: {item.childItems?.length || 0}</p>
                                </Link>
                                <button onClick={() => handleDeleteItem(item.id)}>🗑</button>
                            </li>
                        ))
                    )}
                </ul>
            )}

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


