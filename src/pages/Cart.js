import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../styles/Cart.css';

function Cart() {
  const { 
    items,
    removeItem, 
    updateQuantity,
    updateSpecialRequest,
    calculateTotal
  } = useCart();

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity > 0) {
      updateQuantity(itemId, newQuantity);
    } else {
      removeItem(itemId);
    }
  };

  const handleRemoveItem = (itemId) => {
    removeItem(itemId);
  };

  const handleSpecialRequest = (itemId, request) => {
    updateSpecialRequest(itemId, request);
  };

  const subtotal = calculateTotal();
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  if (!items || items.length === 0) {
    return (
      <div className="cart-container">
        <h1>Your Cart</h1>
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <Link to="/menu" className="continue-shopping">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1>Your Cart</h1>
      
      <div className="cart-items">
        {items.map(item => (
          <div key={item.id} className="cart-item">
            <div className="item-info">
              <h3>{item.name}</h3>
              {item.description && <p>{item.description}</p>}
              <div className="special-request">
                <textarea
                  placeholder="Any special requests? (e.g., spice level, allergies)"
                  value={item.specialRequest || ''}
                  onChange={(e) => handleSpecialRequest(item.id, e.target.value)}
                  rows="2"
                  maxLength="200"
                  className="special-request-input"
                />
              </div>
              <div className="price">${(item.price * item.quantity).toFixed(2)}</div>
            </div>
            
            <div className="item-actions">
              <div className="quantity-control">
                <button 
                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span>{item.quantity}</span>
                <button 
                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              <button 
                className="remove-item"
                onClick={() => handleRemoveItem(item.id)}
                aria-label={`Remove ${item.name} from cart`}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <h2>Order Summary</h2>
        <div className="summary-row">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span>Tax (10%)</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="summary-row total">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <Link to="/checkout" className="checkout-button">
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}

export default Cart; 