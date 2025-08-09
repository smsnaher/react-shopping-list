import { Link } from 'react-router-dom'
import { Header } from './Header'

interface Item {
    id: string
    name: string
    quantity: number
}

const items: Item[] = [
    { id: 'apples', name: 'Apples', quantity: 2 },
    { id: 'bananas', name: 'Bananas', quantity: 5 },
    { id: 'oranges', name: 'Oranges', quantity: 3 },
]

const ShoppingList = () => {
    return (
        <div>
            <Header title="Shopping List" />
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
        </div>
    )
}

export default ShoppingList


