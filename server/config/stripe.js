import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function createPaymentIntent({ amount, currency, orderId, metadata = {} }) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata: {
        orderId,
        ...metadata
      }
    });

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    };
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
}

export async function processRefund(paymentIntentId, orderId, amount = null) {
  try {
    const refundParams = {
      payment_intent: paymentIntentId,
      metadata: { orderId }
    };

    if (amount) {
      refundParams.amount = Math.round(amount * 100); // Convert to cents
    }

    const refund = await stripe.refunds.create(refundParams);

    return {
      refundId: refund.id,
      status: refund.status,
      amount: refund.amount / 100 // Convert back to dollars
    };
  } catch (error) {
    console.error('Error processing refund:', error);
    throw error;
  }
}

export function verifyWebhookSignature(payload, signature) {
  try {
    return stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error('Error verifying webhook signature:', error);
    throw error;
  }
}

export default stripe; 