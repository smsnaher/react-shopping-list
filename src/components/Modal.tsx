import { useState } from 'react'
import './Modal.css'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (listName: string) => void
  title: string
}

const Modal = ({ isOpen, onClose, onSubmit, title }: ModalProps) => {
  const [listName, setListName] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (listName.trim()) {
      onSubmit(listName.trim())
      setListName('')
      onClose()
    }
  }

  const handleClose = () => {
    setListName('')
    onClose()
  }

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
            <label htmlFor="listName">List Name:</label>
            <input
              type="text"
              id="listName"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              placeholder="Enter list name"
              autoFocus
              required
            />
          </div>
          
          <div className="modal-actions">
            <button type="button" onClick={handleClose} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              Create List
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Modal
