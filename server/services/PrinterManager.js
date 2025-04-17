const { db } = require('../config/firebase');
const axios = require('axios');

class PrinterManager {
  constructor() {
    this.setupOrderListener();
    this.cloudPrintEndpoints = {
      'fremont': process.env.FREMONT_PRINT_ENDPOINT,
      'hayward': process.env.HAYWARD_PRINT_ENDPOINT,
      'sf-ofarrell': process.env.SF_OFARRELL_PRINT_ENDPOINT,
      'sf-16th': process.env.SF_16TH_PRINT_ENDPOINT,
      'sf-ocean': process.env.SF_OCEAN_PRINT_ENDPOINT
    };
  }

  // Set up real-time order listener
  setupOrderListener() {
    db.collection('orders')
      .where('status', '==', 'new')
      .onSnapshot(async (snapshot) => {
        snapshot.docChanges().forEach(async (change) => {
          if (change.type === 'added') {
            const order = { id: change.doc.id, ...change.doc.data() };
            await this.sendOrderToPrinter(order);
          }
        });
      });
  }

  // Send order to cloud print service
  async sendOrderToPrinter(order) {
    try {
      const locationId = order.locationId;
      const printEndpoint = this.cloudPrintEndpoints[locationId];

      if (!printEndpoint) {
        throw new Error(`No print endpoint configured for location ${locationId}`);
      }

      // Send order to cloud print service
      const response = await axios.post(printEndpoint, {
        order: {
          id: order.id,
          items: order.items,
          customerName: order.customerName,
          total: order.total,
          specialInstructions: order.specialInstructions,
          timestamp: new Date().toISOString()
        }
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.PRINT_SERVICE_API_KEY}`
        }
      });

      if (response.data.success) {
        // Update order status in Firestore
        await db.collection('orders').doc(order.id).update({
          status: 'printing_completed',
          printedAt: new Date().toISOString()
        });
      } else {
        throw new Error('Print service returned error: ' + response.data.message);
      }

    } catch (error) {
      console.error(`Error sending order ${order.id} to printer:`, error);
      // Update order status to indicate printing error
      await db.collection('orders').doc(order.id).update({
        status: 'printing_error',
        printError: error.message
      });
      throw error;
    }
  }

  // Test printer connection
  async testPrinter(locationId) {
    try {
      const printEndpoint = this.cloudPrintEndpoints[locationId];
      
      if (!printEndpoint) {
        throw new Error(`No print endpoint configured for location ${locationId}`);
      }

      const response = await axios.post(`${printEndpoint}/test`, {
        message: 'Test Print',
        timestamp: new Date().toISOString()
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.PRINT_SERVICE_API_KEY}`
        }
      });

      return response.data.success;
    } catch (error) {
      console.error(`Error testing printer for location ${locationId}:`, error);
      throw error;
    }
  }
}

module.exports = new PrinterManager(); 