import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

export const processPayment = async (amount, orderId) => {
  try {
    const stripe = await stripePromise;
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        amount,
        orderId,
        currency: 'inr'
      }),
    });

    const { clientSecret } = await response.json();
    return { stripe, clientSecret };
  } catch (error) {
    console.error('Payment processing error:', error);
    throw error;
  }
};

export const processRefund = async (paymentIntentId, orderId) => {
  try {
    const response = await fetch('/api/process-refund', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        paymentIntentId,
        orderId
      }),
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Refund processing error:', error);
    throw error;
  }
}; 