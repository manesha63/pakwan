import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/OrderConfirmation.css';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, pickupTime } = location.state || {};

  if (!orderId) {
    return (
      <div className="confirmation-container">
        <h2>Order Not Found</h2>
        <p>We couldn't find your order details. Please contact support if you believe this is an error.</p>
        <button onClick={() => navigate('/')}>Return to Home</button>
      </div>
    );
  }

  return (
    <div className="confirmation-container">
      <h2>Order Confirmed!</h2>
      <div className="confirmation-details">
        <p>Thank you for your order!</p>
        <p>Your order number is: <strong>{orderId}</strong></p>
        <p>Please arrive for pickup at: <strong>{new Date(pickupTime).toLocaleString()}</strong></p>
      </div>
      <div className="confirmation-actions">
        <button onClick={() => navigate('/menu')}>Order Again</button>
        <button onClick={() => navigate('/')}>Return to Home</button>
      </div>
    </div>
  );
};

export default OrderConfirmation; 