import fetch from 'node-fetch';

const PORT = process.env.PORT || 3000;
const BASE_URL = `http://localhost:${PORT}`;

const testPaymentFlow = async () => {
  try {
    // 1. Create a test order
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

    console.log('Creating order:', JSON.stringify(orderData, null, 2));
    
    const orderResponse = await fetch(`${BASE_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    });

    if (!orderResponse.ok) {
      throw new Error(`Failed to create order: ${orderResponse.statusText}`);
    }

    const { orderId } = await orderResponse.json();
    console.log('Order created with ID:', orderId);

    // 2. Create a payment intent
    console.log('\nCreating payment intent...');
    const paymentResponse = await fetch(`${BASE_URL}/api/stripe/create-payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: orderData.total,
        orderId,
        currency: 'usd'
      })
    });

    if (!paymentResponse.ok) {
      throw new Error(`Failed to create payment intent: ${paymentResponse.statusText}`);
    }

    const { clientSecret } = await paymentResponse.json();
    console.log('Payment intent created with client secret:', clientSecret);

    // 3. Simulate successful payment (this would normally be done on the client side)
    console.log('\nPayment would be completed on the client side using:');
    console.log('Test card number: 4242 4242 4242 4242');
    console.log('Expiry: Any future date (e.g., 12/25)');
    console.log('CVC: Any 3 digits (e.g., 123)');

    // 4. Verify order status
    console.log('\nChecking order status...');
    const orderStatusResponse = await fetch(`${BASE_URL}/api/orders/${orderId}`);
    const order = await orderStatusResponse.json();
    console.log('Final order status:', JSON.stringify(order, null, 2));

  } catch (error) {
    console.error('Error in payment flow:', error.message);
    process.exit(1);
  }
};

testPaymentFlow(); 