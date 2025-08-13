import { use, useEffect, useState } from 'react'
import './Modal.css'

interface ChildItemModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (title: string, price: number) => void
  title: string
}

const ChildItemModal = ({ isOpen, onClose, onSubmit, title }: ChildItemModalProps) => {
  const [itemTitle, setItemTitle] = useState('')
  const [itemPrice, setItemPrice] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (itemTitle.trim() && itemPrice.trim()) {
      const price = parseFloat(itemPrice)
      if (!isNaN(price) && price >= 0) {
        onSubmit(itemTitle.trim(), price)
        setItemTitle('')
        setItemPrice('')
        onClose()
      } else {
        alert('Please enter a valid price')
      }
    }
  }

  const handleClose = () => {
    setItemTitle('')
    setItemPrice('')
    onClose()
  }

  // Log the modal state and title for debugging
  useEffect(() => {
    // console.log(`Modal isOpen: ${isOpen}, title: ${title}`);
    
  }, [])

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={handleClose}>
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="itemTitle">Item Title:</label>
            <input
              type="text"
              id="itemTitle"
              value={itemTitle}
              onChange={(e) => setItemTitle(e.target.value)}
              placeholder="Enter item title"
              autoFocus
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="itemPrice">Price:</label>
            <input
              type="number"
              id="itemPrice"
              value={itemPrice}
              onChange={(e) => setItemPrice(e.target.value)}
              placeholder="Enter price"
              min="0"
              step="0.01"
              required
            />
          </div>
          
          <div className="modal-actions">
            <button type="button" onClick={handleClose} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              Add Item
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ChildItemModal
