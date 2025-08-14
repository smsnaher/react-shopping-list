import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Modal } from '../components/index'
import EditModal from '../components/modal/EditModal'
import { useAuth } from '../contexts/AuthContext'
import { FirestoreService } from '../services/firestore'
import type { ListItem } from '../data/items'

const Home = () => {
    const { currentUser } = useAuth()
    const [items, setItems] = useState<ListItem[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [editingItem, setEditingItem] = useState<ListItem | null>(null)
    const [loading, setLoading] = useState(true)
    const [initialLoad, setInitialLoad] = useState(true)
    const unsubscribeRef = useRef<(() => void) | null>(null)

    // Load items with caching and real-time updates
    useEffect(() => {
        if (!currentUser) {
            setItems([])
            setLoading(false)
            setInitialLoad(false)
            return
        }

        const loadItems = async () => {
            try {
                // Use cache for faster initial load
                const userItems = await FirestoreService.getUserItems(currentUser.uid, true)
                setItems(userItems)
                setInitialLoad(false)
                
                // Set up real-time listener for live updates
                unsubscribeRef.current = FirestoreService.setupRealtimeListener(
                    currentUser.uid, 
                    (updatedItems) => {
                        setItems(updatedItems)
                        console.log('📡 Received real-time update')
                    }
                )
            } catch (error) {
                console.error('Error loading items:', error)
            } finally {
                setLoading(false)
            }
        }

        // Preload data for instant loading
        if (initialLoad) {
            FirestoreService.preloadUserData(currentUser.uid)
        }

        loadItems()

        // Cleanup listener on unmount
        return () => {
            if (unsubscribeRef.current) {
                unsubscribeRef.current()
            }
        }
    }, [currentUser, initialLoad])

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

            // Optimistic update - add to UI immediately
            const tempId = `temp-${Date.now()}`
            const optimisticItem = { ...newItem, id: tempId }
            setItems(prevItems => [optimisticItem, ...prevItems])

            // Create in Firestore
            const itemId = await FirestoreService.createItem(newItem, currentUser.uid)
            
            // Replace temporary item with real one
            setItems(prevItems => 
                prevItems.map(item => 
                    item.id === tempId ? { ...item, id: itemId } : item
                )
            )
            
            console.log('✅ Added new item:', { ...newItem, id: itemId })
        } catch (error) {
            // Remove optimistic update on error
            setItems(prevItems => prevItems.filter(item => !item.id.startsWith('temp-')))
            console.error('Error creating item:', error)
            alert('Failed to create item. Please try again.')
        }
    }

    const handleDeleteItem = async (itemId: string) => {
        if (!currentUser) return

        const userConfirmed = confirm("Are you sure you want to delete this item?")
        if (!userConfirmed) return

        // Store the item before deleting for potential rollback
        const itemToDelete = items.find(item => item.id === itemId)

        try {
            // Optimistic update - remove from UI immediately
            setItems(prevItems => prevItems.filter(item => item.id !== itemId))

            // Delete from Firestore
            await FirestoreService.deleteItem(itemId, currentUser.uid)
            
            console.log('✅ Deleted item:', itemId)
        } catch (error) {
            // Restore item on error
            if (itemToDelete) {
                setItems(prevItems => [itemToDelete, ...prevItems])
            }
            console.error('Error deleting item:', error)
            alert('Failed to delete item. Please try again.')
        }
    }

    const handleEditItem = (item: ListItem) => {
        setEditingItem(item)
        setIsEditModalOpen(true)
    }

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false)
        setEditingItem(null)
    }

    const handleUpdateItem = async (name: string, description: string) => {
        if (!currentUser || !editingItem) return

        try {
            // Optimistic update - update UI immediately
            const updatedItem = { ...editingItem, name, description }
            setItems(prevItems => 
                prevItems.map(item => 
                    item.id === editingItem.id ? updatedItem : item
                )
            )

            // Update in Firestore
            await FirestoreService.updateItem(editingItem.id, { name, description })
            
            console.log('✅ Updated item:', updatedItem)
        } catch (error) {
            // Revert optimistic update on error
            setItems(prevItems => 
                prevItems.map(item => 
                    item.id === editingItem.id ? editingItem : item
                )
            )
            console.error('Error updating item:', error)
            alert('Failed to update item. Please try again.')
        }
    }
    return (
        <div>
            <div className="header">
                <h3>Shopping List </h3>
                <button onClick={handleNewList}>+ Add a List</button>
            </div>

            {loading && initialLoad ? (
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    padding: '3rem',
                    color: '#666'
                }}>
                    <div style={{ marginRight: '0.5rem' }}>⏳</div>
                    Loading your shopping lists...
                </div>
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
                                    {item.description && (
                                        <p style={{ fontSize: '0.9rem', color: '#666' }}>
                                            {item.description}
                                        </p>
                                    )}
                                </Link>
                                <div className="item-actions">
                                    <button 
                                        onClick={(e) => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                            handleEditItem(item)
                                        }}
                                        className="edit-btn"
                                        title="Edit item"
                                    >
                                        ✏️
                                    </button>
                                    <button 
                                        onClick={(e) => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                            handleDeleteItem(item.id)
                                        }}
                                        className="delete-btn"
                                        title="Delete item"
                                    >
                                        🗑
                                    </button>
                                </div>
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

            <EditModal
                isOpen={isEditModalOpen}
                onClose={handleCloseEditModal}
                onSubmit={handleUpdateItem}
                title="Edit List Item"
                initialName={editingItem?.name || ''}
                initialDescription={editingItem?.description || ''}
            />
        </div>
    )
}

export default Home


