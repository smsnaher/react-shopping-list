import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { loadItemsFromStorage, getItemByIdFromList, type Item } from '../data/items'

function ItemDetail() {
    const { itemId } = useParams<{ itemId: string }>()
    const [item, setItem] = useState<Item | undefined>(undefined)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (itemId) {
            const items = loadItemsFromStorage()
            const foundItem = getItemByIdFromList(itemId, items)
            setItem(foundItem)
        }
        setLoading(false)
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

    return (
        <div>
            <h1>{item.name}</h1>
            <div>
                <h2>Details</h2>
                <p><strong>Quantity:</strong> {item.quantity}</p>
                {item.description && (
                    <p><strong>Description:</strong> {item.description}</p>
                )}
            </div>
        </div>
    )
}

export default ItemDetail
