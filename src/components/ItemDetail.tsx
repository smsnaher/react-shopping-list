import { useParams, Link } from 'react-router-dom'
import { Header } from './Header'

interface Item {
    id: string
    name: string
    quantity: number
    description?: string
}

const items: Item[] = [
    { id: 'apples', name: 'Apples', quantity: 2, description: 'Fresh red apples, perfect for snacking or baking.' },
    { id: 'bananas', name: 'Bananas', quantity: 5, description: 'Ripe yellow bananas, great for smoothies and breakfast.' },
    { id: 'oranges', name: 'Oranges', quantity: 3, description: 'Juicy oranges packed with vitamin C.' },
]

function ItemDetail() {
    const { itemId } = useParams<{ itemId: string }>()
    const item = items.find(item => item.id === itemId)

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
            <Header title={item.name} />
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
