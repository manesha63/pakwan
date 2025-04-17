import { db } from '../config/mockDb.js';
import { sendOrderReadyNotification } from './notificationService.js';
import { printer } from './printer.js';
import { processRefund } from '../utils/stripe.js';

const validateOrderData = (orderData) => {
  if (!orderData || typeof orderData !== 'object') {
    throw new Error('Invalid order data');
  }
  
  if (!orderData.customerName) {
    throw new Error('Customer name is required');
  }

  // Validate items array
  if (!orderData.items) {
    throw new Error('Order must contain items');
  }

  const items = Array.isArray(orderData.items) ? orderData.items : [orderData.items];
  
  if (items.length === 0) {
    throw new Error('Order must contain at least one item');
  }

  // Validate each item
  for (const item of items) {
    if (!item || typeof item !== 'object') {
      throw new Error('Invalid item in order');
    }
    if (!item.name) {
      throw new Error('Each item must have a name');
    }
    if (!item.quantity || isNaN(Number(item.quantity)) || Number(item.quantity) <= 0) {
      throw new Error('Each item must have a valid quantity');
    }
    if (!item.price || isNaN(Number(item.price)) || Number(item.price) < 0) {
      throw new Error('Each item must have a valid price');
    }
  }

  // Validate totals
  if (!orderData.subtotal || isNaN(Number(orderData.subtotal))) {
    throw new Error('Order must include a valid subtotal');
  }
  if (!orderData.total || isNaN(Number(orderData.total))) {
    throw new Error('Order must include a valid total');
  }
};

const createOrder = async (orderData) => {
  try {
    console.log('Creating order with data:', JSON.stringify(orderData, null, 2));

    // Validate order data
    validateOrderData(orderData);

    // Ensure items is an array and normalize numeric values
    const items = Array.isArray(orderData.items) ? orderData.items : [orderData.items];
    const normalizedItems = items.map(item => ({
      ...item,
      quantity: Number(item.quantity),
      price: Number(item.price)
    }));

    console.log('Normalized items:', JSON.stringify(normalizedItems, null, 2));

    // Create normalized order data
    const normalizedOrderData = {
      ...orderData,
      items: normalizedItems,
      subtotal: Number(orderData.subtotal),
      tax: orderData.tax ? Number(orderData.tax) : 0,
      total: Number(orderData.total),
      status: orderData.status || 'pending',
      paymentStatus: orderData.paymentStatus || 'pending',
      createdAt: orderData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    console.log('Normalized order data:', JSON.stringify(normalizedOrderData, null, 2));

    // Create order in mock DB
    const orderRef = await db.collection('orders').add(normalizedOrderData);
    console.log('Order created with ID:', orderRef.id);

    // Try to print order ticket
    try {
      await printer.printOrder(orderRef.id, {
        ...normalizedOrderData,
        orderNumber: orderRef.id.slice(-6),
        orderTime: new Date().toLocaleString()
      });
    } catch (error) {
      console.warn('Failed to print order:', error);
    }

    return orderRef.id;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

const updateOrderStatus = async (orderId, status) => {
  try {
    const orderRef = db.collection('orders').doc(orderId);
    const orderDoc = await orderRef.get();
    
    if (!orderDoc.exists) {
      throw new Error('Order not found');
    }

    const order = orderDoc.data();

    await orderRef.update({
      status,
      updatedAt: new Date().toISOString()
    });

    // Try to send notification if order is ready
    if (status === 'ready') {
      try {
        await sendOrderReadyNotification({
          id: orderId,
          ...order
        });
      } catch (error) {
        console.warn('Failed to send ready notification:', error);
      }
    }

    return {
      success: true,
      message: `Order status updated to ${status}`
    };
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

const getOrder = async (orderId) => {
  try {
    const orderDoc = await db.collection('orders').doc(orderId).get();
    if (!orderDoc.exists) {
      return null;
    }
    return { id: orderDoc.id, ...orderDoc.data() };
  } catch (error) {
    console.error('Error getting order:', error);
    throw error;
  }
};

const getOrders = async (filters = {}) => {
  try {
    let query = db.collection('orders');
    
    // Apply filters
    if (filters.status) {
      query = query.where('status', '==', filters.status);
    }
    if (filters.startDate && filters.endDate) {
      query = query.where('createdAt', '>=', filters.startDate)
                  .where('createdAt', '<=', filters.endDate);
    }
    
    const snapshot = await query.orderBy('createdAt', 'desc').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting orders:', error);
    throw error;
  }
};

const cancelOrder = async (orderId) => {
  try {
    const orderRef = db.collection('orders').doc(orderId);
    const orderDoc = await orderRef.get();
    
    if (!orderDoc.exists) {
      throw new Error('Order not found');
    }

    const order = orderDoc.data();

    // Check if order is within 5-minute window
    const orderTime = new Date(order.createdAt);
    const now = new Date();
    const timeDiff = (now - orderTime) / 1000 / 60; // Convert to minutes

    if (timeDiff > 5) {
      throw new Error('Orders can only be cancelled within 5 minutes of placement');
    }

    // Process refund if payment service is available
    let refundResult = null;
    if (order.paymentStatus === 'completed' && order.paymentIntentId) {
      try {
        refundResult = await processRefund(order.paymentIntentId, orderId);
      } catch (error) {
        console.warn('Refund processing failed:', error);
      }
    }

    // Update order status
    await orderRef.update({
      status: 'cancelled',
      paymentStatus: refundResult?.success ? 'refunded' : 'refund_pending',
      updatedAt: new Date().toISOString(),
      cancelledAt: new Date().toISOString()
    });

    // Try to print cancellation
    try {
      await printer(orderId, {
        orderId,
        orderNumber: orderId.slice(-6),
        cancelTime: new Date().toLocaleString(),
        refundAmount: order.total,
        customerName: order.customerName
      });
    } catch (error) {
      console.warn('Failed to print cancellation:', error);
    }

    return { 
      success: true,
      message: 'Order cancelled successfully',
      refundStatus: refundResult?.success ? 'processed' : 'pending'
    };
  } catch (error) {
    console.error('Error cancelling order:', error);
    throw error;
  }
};

export {
  createOrder,
  updateOrderStatus,
  getOrder,
  getOrders,
  cancelOrder
}; 