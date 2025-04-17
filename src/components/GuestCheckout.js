import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { db } from '../config/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import '../styles/GuestCheckout.css';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

// Card validation error messages
const getCardErrorMessage = (error) => {
  switch (error.code) {
    case 'card_number_invalid':
      return 'Your card number is invalid.';
    case 'card_exp_month_invalid':
      return 'Your card expiration month is invalid.';
    case 'card_exp_year_invalid':
      return 'Your card expiration year is invalid.';
    case 'card_cvc_invalid':
      return 'Your card CVC is invalid.';
    case 'card_declined':
      return 'Your card was declined. Please try another card.';
    case 'expired_card':
      return 'Your card has expired. Please try another card.';
    case 'insufficient_funds':
      return 'Your card has insufficient funds.';
    case 'processing_error':
      return 'An error occurred while processing your card. Please try again.';
    default:
      return 'An error occurred while processing your payment. Please try again.';
  }
};

// Loading spinner component
const LoadingSpinner = () => (
  <div className="loading-overlay">
    <div className="loading-spinner"></div>
    <p>Processing your payment...</p>
  </div>
);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    pickupTime: '',
    specialInstructions: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      setError('Payment system is not ready. Please try again.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create order in Firestore first
      const orderData = {
        customerInfo,
        items,
        total,
        status: 'pending',
        createdAt: new Date().toISOString(),
        type: 'guest'
      };

      const orderRef = await addDoc(collection(db, 'orders'), orderData);
      
      // Create payment intent
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/stripe/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: orderRef.id,
          amount: total,
          currency: 'usd'
        }),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create payment intent');
      }

      const { clientSecret } = await response.json();

      // Confirm card payment
      const { error: paymentError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: customerInfo.name,
            email: customerInfo.email,
          },
        }
      });

      if (paymentError) {
        throw paymentError;
      }

      if (paymentIntent.status === 'succeeded') {
        clearCart();
        navigate(`/order-confirmation/${orderRef.id}`);
      }

    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message || 'An error occurred during payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      <div className="form-section">
        <h3>Contact Information</h3>
        <input
          type="text"
          name="name"
          value={customerInfo.name}
          onChange={handleInputChange}
          placeholder="Full Name"
          required
        />
        <input
          type="email"
          name="email"
          value={customerInfo.email}
          onChange={handleInputChange}
          placeholder="Email"
          required
        />
        <input
          type="tel"
          name="phone"
          value={customerInfo.phone}
          onChange={handleInputChange}
          placeholder="Phone Number"
          required
        />
      </div>

      <div className="form-section">
        <h3>Pickup Details</h3>
        <input
          type="datetime-local"
          name="pickupTime"
          value={customerInfo.pickupTime}
          onChange={handleInputChange}
          required
          min={new Date(Date.now() + 30 * 60000).toISOString().slice(0, 16)}
        />
        <textarea
          name="specialInstructions"
          value={customerInfo.specialInstructions}
          onChange={handleInputChange}
          placeholder="Special Instructions (Optional)"
        />
      </div>

      <div className="form-section">
        <h3>Payment Information</h3>
        <div className="card-element">
          <CardElement 
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <button 
        type="submit" 
        className="submit-button" 
        disabled={loading || !stripe}
      >
        {loading ? 'Processing...' : `Pay $${total.toFixed(2)}`}
      </button>
    </form>
  );
};

const GuestCheckout = () => {
  return (
    <Elements stripe={stripePromise}>
      <div className="guest-checkout">
        <h2>Guest Checkout</h2>
        <CheckoutForm />
      </div>
    </Elements>
  );
};

export default GuestCheckout; 