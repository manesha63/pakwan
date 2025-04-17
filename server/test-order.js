import fetch from 'node-fetch';

const testOrder = async () => {
  const orderData = {
    customerName: "Test Customer",
    phoneNumber: "1234567890",
    items: [
      {
        name: "Chicken Tikka Masala",
        quantity: 1,
        price: 15.99
      }
    ],
    subtotal: 15.99,
    tax: 1.44,
    total: 17.43
  };

  try {
    console.log('Sending order:', JSON.stringify(orderData, null, 2));
    
    const response = await fetch('http://localhost:5001/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    
    const result = await response.json();
    console.log('Response body:', result);

    if (result.error) {
      console.error('Server error:', result.error);
      return;
    }

    // Try to fetch the created order
    if (result.orderId) {
      console.log('Fetching created order...');
      const orderResponse = await fetch(`http://localhost:5001/api/orders/${result.orderId}`);
      const order = await orderResponse.json();
      console.log('Created order:', order);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

testOrder(); 