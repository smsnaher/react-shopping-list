import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { FirestoreService } from '../services/firestore'
import {
    generateChildItemId,
    type ListItem,
    type ChildItem
} from '../data/items'
import ChildItemModal from '../components/modal/ChildItemModal'
import EditChildItemModal from '../components/modal/EditChildItemModal'

function ItemDetail() {
    const { itemId } = useParams<{ itemId: string }>()
    const { currentUser } = useAuth()
    const [item, setItem] = useState<ListItem | undefined>(undefined)
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [editingChildItem, setEditingChildItem] = useState<ChildItem | null>(null)

    // Load item from Firestore
    useEffect(() => {
        const loadItem = async () => {
            if (itemId && currentUser) {
                try {
                    setLoading(true)
                    const foundItem = await FirestoreService.getItemById(itemId, currentUser.uid)
                    setItem(foundItem || undefined)
                } catch (error) {
                    console.error('Error loading item:', error)
                    setItem(undefined)
                } finally {
                    setLoading(false)
                }
            } else {
                setLoading(false)
            }
        }

        loadItem()
    }, [itemId, currentUser])

    if (loading) {
        return (
            <div>
                <p>Loading...</p>
            </div>
        )
    }

    if (!item) {
        return (
            <div>
                <h1>Item not found</h1>
                <Link to="/">← Back to Shopping List</Link>
            </div>
        )
    }

    const handleNewChildList = () => {
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
    }

    const handleAddChildItem = async (title: string, price: number) => {
        if (!item || !currentUser || !itemId) return

        try {
            const newChildItem: ChildItem = {
                id: generateChildItemId(title),
                title,
                price
            }

            await FirestoreService.addChildItem(itemId, newChildItem, currentUser.uid)
            
            // Update local state
            setItem(prevItem => {
                if (!prevItem) return prevItem
                return {
                    ...prevItem,
                    childItems: [...(prevItem.childItems || []), newChildItem]
                }
            })
            
            console.log('Added child item:', newChildItem)
        } catch (error) {
            console.error('Error adding child item:', error)
            alert('Failed to add item. Please try again.')
        }
    }

    const handleDeleteChildItem = async (childItemId: string) => {
        if (!item || !currentUser || !itemId) return

        const userConfirmed = confirm("Are you sure you want to delete this item?")
        if (!userConfirmed) return

        try {
            await FirestoreService.removeChildItem(itemId, childItemId, currentUser.uid)
            
            // Update local state
            setItem(prevItem => {
                if (!prevItem) return prevItem
                return {
                    ...prevItem,
                    childItems: (prevItem.childItems || []).filter((child: ChildItem) => child.id !== childItemId)
                }
            })
            
            console.log('Deleted child item:', childItemId)
        } catch (error) {
            console.error('Error deleting child item:', error)
            alert('Failed to delete item. Please try again.')
        }
    }

    const handleEditChildItem = (childItem: ChildItem) => {
        setEditingChildItem(childItem)
        setIsEditModalOpen(true)
    }

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false)
        setEditingChildItem(null)
    }

    const handleUpdateChildItem = async (title: string, price: number) => {
        if (!item || !currentUser || !itemId || !editingChildItem) return

        try {
            // Optimistic update - update UI immediately
            const updatedChildItem = { ...editingChildItem, title, price }
            setItem(prevItem => {
                if (!prevItem) return prevItem
                return {
                    ...prevItem,
                    childItems: (prevItem.childItems || []).map((child: ChildItem) => 
                        child.id === editingChildItem.id ? updatedChildItem : child
                    )
                }
            })

            // Update in Firestore
            await FirestoreService.updateChildItem(itemId, editingChildItem.id, { title, price }, currentUser.uid)
            
            console.log('✅ Updated child item:', updatedChildItem)
        } catch (error) {
            // Revert optimistic update on error
            setItem(prevItem => {
                if (!prevItem) return prevItem
                return {
                    ...prevItem,
                    childItems: (prevItem.childItems || []).map((child: ChildItem) => 
                        child.id === editingChildItem.id ? editingChildItem : child
                    )
                }
            })
            console.error('Error updating child item:', error)
            alert('Failed to update item. Please try again.')
        }
    }

    const getTotalPrice = () => {
        if (!item?.childItems) return 0
        return item.childItems.reduce((total, childItem) => total + childItem.price, 0)
    }

    return (
        <div>
            <Link to="/">← Back to Shopping List</Link>

            <div className="header">
                <h1>{item.name}</h1>
                <button onClick={handleNewChildList}>+ Add a Child Item</button>
            </div>

            <div className="item-details">
                <p><strong>Quantity:</strong> {item.childItems?.length}</p>

                {item.childItems && item.childItems.length > 0 && (
                    <div className="total-section">
                        <p><strong>Total Price: ${getTotalPrice().toFixed(2)}</strong></p>
                    </div>
                )}
            </div>

            <div className="child-items-section">
                <h2>Child Items ({item.childItems?.length || 0})</h2>

                {item.childItems && item.childItems.length > 0 ? (
                    <ul className="child-items-list">
                        {item.childItems.map(childItem => (
                            <li key={childItem.id} className="child-item">
                                <div className="child-item-content">
                                    <div className="child-item-info">
                                        <h3>{childItem.title}</h3>
                                        <p className="price">${childItem.price.toFixed(2)}</p>
                                    </div>
                                    <div className="item-actions">
                                        <button
                                            onClick={() => handleEditChildItem(childItem)}
                                            className="edit-btn"
                                            title="Edit item"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            onClick={() => handleDeleteChildItem(childItem.id)}
                                            className="delete-btn"
                                            title="Delete item"
                                        >
                                            🗑
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="empty-child-items">
                        <p>No child items added yet.</p>
                        <button onClick={handleNewChildList} className="add-first-item-btn">
                            Add First Item
                        </button>
                    </div>
                )}
            </div>

            <ChildItemModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleAddChildItem}
                title="Add New Child Item"
            />

            <EditChildItemModal
                isOpen={isEditModalOpen}
                onClose={handleCloseEditModal}
                onSubmit={handleUpdateChildItem}
                title="Edit Child Item"
                initialTitle={editingChildItem?.title || ''}
                initialPrice={editingChildItem?.price || 0}
            />
        </div>
    )
}

export default ItemDetail
