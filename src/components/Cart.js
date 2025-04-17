import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import '../styles/Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { items, updateItemQuantity, removeItem, total, updateSpecialRequest } = useCart();

  const handleCheckout = () => {
    if (currentUser) {
      navigate('/checkout');
    } else {
      navigate('/guest-checkout');
    }
  };

  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Your cart is empty</h2>
        <button onClick={() => navigate('/menu')} className="continue-shopping">
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      <div className="cart-items">
        {items.map((item) => (
          <div key={item.id} className="cart-item">
            <div className="item-info">
              <h3>{item.name}</h3>
              <p className="item-price">{item.price.toFixed(2)}</p>
              {item.customizations && (
                <div className="item-customizations">
                  {item.customizations.map((custom, index) => (
                    <span key={index}>{custom}</span>
                  ))}
                </div>
              )}
              <div className="special-request">
                <input
                  type="text"
                  placeholder="Add special request..."
                  value={item.specialRequest || ''}
                  onChange={(e) => updateSpecialRequest(item.id, e.target.value)}
                  className="special-request-input"
                />
              </div>
            </div>
            <div className="quantity-controls">
              <button 
                onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button 
                onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
              >
                +
              </button>
            </div>
            <button 
              className="remove-item"
              onClick={() => removeItem(item.id)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      
      <div className="cart-summary">
        <div className="cart-total">
          <h3>Total:</h3>
          <span>{total.toFixed(2)}</span>
        </div>
        
        <div className="checkout-options">
          <button 
            className="checkout-button"
            onClick={handleCheckout}
          >
            {currentUser ? 'Proceed to Checkout' : 'Continue as Guest'}
          </button>
          
          {!currentUser && (
            <button 
              className="login-button"
              onClick={() => navigate('/login')}
            >
              Login to Your Account
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart; 