const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

const sendOrderConfirmation = async (order) => {
  const { customerEmail, customerName, orderId, pickupTime, items, total } = order;

  const formattedPickupTime = new Date(pickupTime).toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: customerEmail,
    subject: 'Order Confirmation - Pakwan Restaurant',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4CAF50;">Order Confirmed!</h2>
        <p>Hello ${customerName},</p>
        <p>Thank you for your order. Here are your order details:</p>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3 style="color: #333;">Order #${orderId}</h3>
          <p><strong>Pickup Time:</strong> ${formattedPickupTime}</p>
          
          <h4 style="color: #333; margin-top: 20px;">Order Items:</h4>
          <ul style="list-style: none; padding: 0;">
            ${items.map(item => `
              <li style="margin-bottom: 10px;">
                ${item.name} x ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}
              </li>
            `).join('')}
          </ul>
          
          <p style="font-weight: bold; margin-top: 20px;">
            Total: $${total.toFixed(2)}
          </p>
        </div>
        
        <p>Please arrive at the restaurant at your scheduled pickup time.</p>
        <p>If you have any questions, please contact us at ${process.env.RESTAURANT_PHONE}.</p>
        
        <p style="margin-top: 30px;">Thank you for choosing Pakwan Restaurant!</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Order confirmation email sent successfully');
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    throw error;
  }
};

module.exports = {
  sendOrderConfirmation
}; 