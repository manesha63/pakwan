import React, { useState, useEffect } from 'react';
import { cancelOrder } from '../services/orderService';
import '../styles/OrderActions.css';

const OrderActions = ({ order }) => {
  const [canCancel, setCanCancel] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkCancellationWindow = () => {
      const orderTime = new Date(order.createdAt);
      const now = new Date();
      const diffInMinutes = (now - orderTime) / 1000 / 60;
      const remainingTime = Math.max(5 - diffInMinutes, 0);
      
      setTimeLeft(Math.floor(remainingTime));
      setCanCancel(remainingTime > 0);
    };

    checkCancellationWindow();
    const timer = setInterval(checkCancellationWindow, 10000); // Check every 10 seconds

    return () => clearInterval(timer);
  }, [order]);

  const handleCancel = async () => {
    if (!canCancel) return;

    setLoading(true);
    setError(null);

    try {
      await cancelOrder(order.id);
      // You can add a success callback here if needed
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!canCancel) {
    return (
      <div className="order-actions">
        <p className="cancellation-expired">
          Cancellation window has expired
        </p>
      </div>
    );
  }

  return (
    <div className="order-actions">
      <p className="time-remaining">
        Time remaining to cancel: {timeLeft} minutes
      </p>
      
      <button 
        onClick={handleCancel}
        disabled={loading || !canCancel}
        className="cancel-button"
      >
        {loading ? 'Cancelling...' : 'Cancel Order'}
      </button>

      {error && (
        <p className="error-message">
          {error}
        </p>
      )}
    </div>
  );
};

export default OrderActions; 