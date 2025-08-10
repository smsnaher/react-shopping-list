import { useState } from 'react'
import './Modal.css'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (itemName: string) => void
  title: string
}

const Modal = ({ isOpen, onClose, onSubmit, title }: ModalProps) => {
  const [itemName, setItemName] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (itemName.trim()) {
      onSubmit(itemName.trim())
      setItemName('')
      onClose()
    }
  }

  const handleClose = () => {
    setItemName('')
    onClose()
  }

  if (!isOpen) return null

  // Determine labels based on title
  const isAddingItem = title.toLowerCase().includes('item')
  const inputLabel = isAddingItem ? 'Item Name:' : 'List Name:'
  const placeholder = isAddingItem ? 'Enter item name' : 'Enter list name'
  const submitButtonText = isAddingItem ? 'Add Item' : 'Create List'

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
            <label htmlFor="itemName">{inputLabel}</label>
            <input
              type="text"
              id="itemName"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder={placeholder}
              autoFocus
              required
            />
          </div>
          
          <div className="modal-actions">
            <button type="button" onClick={handleClose} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              {submitButtonText}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Modal
