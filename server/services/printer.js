// Mock printer service
export const printer = {
  async init() {
    console.log('Mock: Printer initialized');
    return true;
  },
  
  async printOrder(orderId, orderData) {
    console.log('Mock: Would print order:', orderId);
    return true;
  },
  
  async printCancellation(orderId, orderData) {
    console.log('Mock: Would print cancellation for order:', orderId);
    return true;
  }
}; 