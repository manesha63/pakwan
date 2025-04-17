import express from 'express';
import { createPaymentIntent, processRefund, verifyWebhookSignature } from '../config/stripe.js';
import { Order } from '../models/order.js';

const router = express.Router();

// Create a payment intent
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, orderId } = req.body;

    if (!amount || !orderId) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const { clientSecret, paymentIntentId } = await createPaymentIntent({
      amount,
      currency: 'usd',
      orderId
    });

    // Update order with payment intent ID
    await Order.findByIdAndUpdate(orderId, { paymentIntentId });

    res.json({ clientSecret });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: error.message });
  }
});

// Process refund
router.post('/refund', async (req, res) => {
  try {
    const { orderId, amount } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (!order.paymentIntentId) {
      return res.status(400).json({ error: 'No payment found for this order' });
    }

    // Check if refund is within allowed window (e.g., 24 hours)
    const refundWindow = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    const orderDate = new Date(order.createdAt).getTime();
    const now = Date.now();

    if (now - orderDate > refundWindow) {
      return res.status(400).json({ error: 'Refund window has expired' });
    }

    const refundResult = await processRefund(order.paymentIntentId, orderId, amount);

    // Update order status
    order.status = 'refunded';
    order.refundId = refundResult.refundId;
    await order.save();

    res.json(refundResult);
  } catch (error) {
    console.error('Error processing refund:', error);
    res.status(500).json({ error: error.message });
  }
});

// Handle Stripe webhooks
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const sig = req.headers['stripe-signature'];
    const event = verifyWebhookSignature(req.body, sig);

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        const orderId = paymentIntent.metadata.orderId;
        
        // Update order status
        await Order.findByIdAndUpdate(orderId, { status: 'paid' });
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        const failedOrderId = failedPayment.metadata.orderId;
        
        // Update order status
        await Order.findByIdAndUpdate(failedOrderId, { status: 'payment_failed' });
        break;
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({ error: error.message });
  }
});

export default router; 