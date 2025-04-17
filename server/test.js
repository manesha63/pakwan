import fetch from 'node-fetch';

const testOrder = async () => {
  try {
    const orderData = {
      customerName: "Test Customer",
      customerEmail: "test@example.com",
      customerPhone: "+1234567890",
      items: [
        {
          id: "1",
          name: "Chicken Tikka Masala",
          price: 15.99,
          quantity: 2,
          specialRequest: "Spicy please"
        }
      ],
      subtotal: 31.98,
      tax: 2.88,
      total: 34.86,
      status: "pending",
      paymentStatus: "pending"
    };

    console.log('Sending order:', JSON.stringify(orderData, null, 2));
    
    const response = await fetch('http://localhost:5001/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    }).catch(error => {
      console.error('Network error:', error.message);
      throw new Error('Failed to connect to server. Make sure the server is running on port 5001.');
    });

    if (!response) {
      throw new Error('No response from server');
    }

    console.log('Response status:', response.status);
    
    const result = await response.json();
    console.log('Response body:', result);

    if (!response.ok) {
      throw new Error(`Server error: ${result.error || 'Unknown error'}`);
    }

    // Try to fetch the created order
    if (result.orderId) {
      console.log('Fetching created order...');
      const orderResponse = await fetch(`http://localhost:5001/api/orders/${result.orderId}`);
      const order = await orderResponse.json();
      console.log('Created order:', JSON.stringify(order, null, 2));
    }

    console.log('Test completed successfully!');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

testOrder(); 