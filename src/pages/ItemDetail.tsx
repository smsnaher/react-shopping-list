import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { 
  loadItemsFromStorage, 
  getItemByIdFromList, 
  addChildItemToItem,
  removeChildItemFromItem,
  generateChildItemId,
  type Item,
  type ChildItem 
} from '../data/items'
import ChildItemModal from '../components/modal/ChildItemModal'

function ItemDetail() {
    const { itemId } = useParams<{ itemId: string }>()
    const [item, setItem] = useState<Item | undefined>(undefined)
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const loadItem = () => {
        if (itemId) {
            const items = loadItemsFromStorage()
            const foundItem = getItemByIdFromList(itemId, items)
            setItem(foundItem)
        }
        setLoading(false)
    }

    useEffect(() => {
        console.log(itemId);
        
        loadItem()
    }, [itemId])

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

    const handleAddChildItem = (title: string, price: number) => {
        if (!item) return

        const newChildItem: ChildItem = {
            id: generateChildItemId(title),
            title,
            price
        }

        const updatedItem = addChildItemToItem(item.id, newChildItem)
        if (updatedItem) {
            setItem(updatedItem)
            console.log('Added child item:', newChildItem)
        }
    }

    const handleDeleteChildItem = (childItemId: string) => {
        if (!item) return

        const userConfirmed = confirm("Are you sure you want to delete this item?")
        if (!userConfirmed) return

        const updatedItem = removeChildItemFromItem(item.id, childItemId)
        if (updatedItem) {
            setItem(updatedItem)
            console.log('Deleted child item:', childItemId)
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
                <p><strong>Quantity:</strong> {item.quantity}</p>
                {item.description && (
                    <p><strong>Description:</strong> {item.description}</p>
                )}
                
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
                                    <button 
                                        onClick={() => handleDeleteChildItem(childItem.id)}
                                        className="delete-btn"
                                        title="Delete item"
                                    >
                                        🗑
                                    </button>
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
        </div>
    )
}

export default ItemDetail
