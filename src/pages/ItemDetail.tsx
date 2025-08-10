import { useParams, Link } from 'react-router-dom'
import { getItemById } from '../data/items'

function ItemDetail() {
    const { itemId } = useParams<{ itemId: string }>()
    const item = itemId ? getItemById(itemId) : undefined

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
