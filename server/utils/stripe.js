import Stripe from 'stripe';

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

const processRefund = async (paymentIntentId, orderId) => {
  if (!stripe) {
    console.warn('Stripe not configured - skipping refund processing');
    return {
      success: false,
      error: 'Stripe not configured'
    };
  }

  try {
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId
    });

    return {
      success: true,
      refund
    };
  } catch (error) {
    console.error(`Error processing refund for order ${orderId}:`, error);
    return {
      success: false,
      error: error.message
    };
  }
};

export { processRefund }; 