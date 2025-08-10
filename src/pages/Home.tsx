import { useState } from 'react'
import { Link } from 'react-router-dom'
import { items } from '../data/items'
import Modal from '../components/Modal'

const Home = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)

    const handleNewList = () => {
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
    }

    const handleCreateList = (listName: string) => {
        // For now, just log the list name - you can implement actual list creation logic later
        console.log('Creating new list:', listName)
        // TODO: Add logic to create a new list with the provided name
    }

    return (
        <div>
            <div className="header">
                <h3>Shopping List </h3>
                <button onClick={handleNewList}>+ new list</button>
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
                title="Create New Shopping List"
            />
        </div>
    )
}

export default Home


