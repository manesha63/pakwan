import express from 'express';
import { 
  createOrder, 
  updateOrderStatus, 
  getOrder, 
  getOrders,
  cancelOrder 
} from '../services/orderService.js';

const router = express.Router();

// Create new order
router.post('/', async (req, res) => {
  try {
    console.log('Received order request:', JSON.stringify(req.body, null, 2));
    const orderId = await createOrder(req.body);
    res.json({ orderId });
  } catch (error) {
    console.error('Error in order creation route:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get order by ID
router.get('/:orderId', async (req, res) => {
  try {
    const order = await getOrder(req.params.orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all orders (with optional filters)
router.get('/', async (req, res) => {
  try {
    const orders = await getOrders(req.query);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update order status
router.patch('/:orderId/status', async (req, res) => {
  try {
    const result = await updateOrderStatus(req.params.orderId, req.body.status);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cancel order
router.post('/:orderId/cancel', async (req, res) => {
  const orderId = req.params.orderId;
  
  try {
    // Set a timeout for the cancellation process
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Operation timed out')), 5000);
    });

    // Try to cancel the order with a timeout
    const result = await Promise.race([
      cancelOrder(orderId),
      timeoutPromise
    ]);

    res.json(result);
  } catch (error) {
    if (error.message === 'Operation timed out') {
      res.status(408).json({ 
        error: 'Request timeout',
        message: 'The cancellation request took too long to process'
      });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
});

export default router; 