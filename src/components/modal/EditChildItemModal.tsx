import React, { useState, useEffect } from 'react';
import './EditModal.css';

interface EditChildItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, price: number) => void;
  title: string;
  initialTitle?: string;
  initialPrice?: number;
}

const EditChildItemModal: React.FC<EditChildItemModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  title, 
  initialTitle = '', 
  initialPrice = 0 
}) => {
  const [itemTitle, setItemTitle] = useState(initialTitle);
  const [price, setPrice] = useState(initialPrice.toString());

  useEffect(() => {
    if (isOpen) {
      setItemTitle(initialTitle);
      setPrice(initialPrice.toString());
    }
  }, [isOpen, initialTitle, initialPrice]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const priceValue = parseFloat(price);
    
    if (itemTitle.trim() && !isNaN(priceValue) && priceValue >= 0) {
      onSubmit(itemTitle.trim(), priceValue);
      onClose();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty string or valid number format
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setPrice(value);
    }
  };

  if (!isOpen) return null;

  const priceValue = parseFloat(price);
  const isValidPrice = !isNaN(priceValue) && priceValue >= 0;
  const isFormValid = itemTitle.trim() && isValidPrice;

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>{title}</h2>
          <button 
            className="modal-close-btn" 
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="child-item-title">Item Name:</label>
            <input
              id="child-item-title"
              type="text"
              value={itemTitle}
              onChange={(e) => setItemTitle(e.target.value)}
              placeholder="Enter item name"
              required
              autoFocus
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="child-item-price">Price:</label>
            <div style={{ position: 'relative' }}>
              <span style={{ 
                position: 'absolute', 
                left: '12px', 
                top: '50%', 
                transform: 'translateY(-50%)',
                color: '#6b7280',
                pointerEvents: 'none'
              }}>
                $
              </span>
              <input
                id="child-item-price"
                type="text"
                value={price}
                onChange={handlePriceChange}
                placeholder="0.00"
                style={{ paddingLeft: '30px' }}
                required
              />
            </div>
            {price && !isValidPrice && (
              <p style={{ 
                color: '#ef4444', 
                fontSize: '0.875rem', 
                marginTop: '0.25rem',
                marginBottom: 0 
              }}>
                Please enter a valid price
              </p>
            )}
          </div>
          
          <div className="modal-actions">
            <button 
              type="button" 
              className="btn-cancel"
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-submit"
              disabled={!isFormValid}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditChildItemModal;
