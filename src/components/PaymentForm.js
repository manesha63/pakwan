import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { processPayment } from '../utils/stripe';
import '../styles/PaymentForm.css';

const PaymentForm = ({ amount, orderId, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (!stripe || !elements) {
      setError('Payment system is not ready. Please try again.');
      setLoading(false);
      return;
    }

    try {
      // Get Stripe payment intent
      const { clientSecret } = await processPayment(amount, orderId);

      // Confirm payment with card details
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: 'Customer Name',
          },
        },
      });

      if (result.error) {
        // Handle specific error cases
        switch (result.error.code) {
          case 'card_declined':
            setError('Your card was declined. Please try another card.');
            break;
          case 'expired_card':
            setError('Your card has expired. Please try another card.');
            break;
          case 'incorrect_cvc':
            setError('The security code is incorrect. Please check and try again.');
            break;
          case 'processing_error':
            setError('An error occurred while processing your card. Please try again.');
            break;
          case 'insufficient_funds':
            setError('Insufficient funds in your account. Please try another card.');
            break;
          default:
            setError(result.error.message || 'Payment failed. Please try again.');
        }
        onError(result.error.message);
      } else {
        // Payment successful
        onSuccess(result.paymentIntent);
      }
    } catch (err) {
      console.error('Payment processing error:', err);
      setError('Unable to process payment. Please try again later.');
      onError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <div className="card-element-container">
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
            hidePostalCode: true // Since we're in India
          }}
        />
      </div>
      
      {error && <div className="payment-error">{error}</div>}
      
      <button 
        type="submit" 
        disabled={!stripe || loading}
        className="pay-button"
      >
        {loading ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
      </button>

      <div className="payment-info">
        <p>✓ Secure payment processed by Stripe</p>
        <p>✓ Your card details are encrypted</p>
      </div>
    </form>
  );
};

export default PaymentForm; 