import nodemailer from 'nodemailer';
import twilio from 'twilio';

let transporter = null;
let twilioClient = null;

// Initialize services only if credentials are available
const initializeServices = () => {
  // Initialize nodemailer only if credentials are available
  if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  } else {
    console.warn('Email credentials not found - email notifications will be disabled');
  }

  // Initialize Twilio client only if credentials are available
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  } else {
    console.warn('Twilio credentials not found - SMS notifications will be disabled');
  }
};

// Initialize services on module load
initializeServices();

const sendSMS = async (to, message) => {
  if (!twilioClient) {
    console.warn('Twilio not configured - skipping SMS notification');
    return {
      success: false,
      error: 'Twilio not configured'
    };
  }

  try {
    const result = await twilioClient.messages.create({
      body: message,
      to,
      from: process.env.TWILIO_PHONE_NUMBER
    });

    return {
      success: true,
      result
    };
  } catch (error) {
    console.error('Error sending SMS:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const sendOrderReadyNotification = async (order) => {
  console.log('Mock: Would send notification for order:', order.id);
  return true;
};

export const sendCancellationConfirmation = async (order) => {
  try {
    let notifications = [];

    // Ensure items is an array
    const items = Array.isArray(order.items) ? order.items : [order.items];

    // Send email notification if configured
    if (transporter && order.customerEmail) {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: order.customerEmail,
          subject: 'Your Pakwan Order Has Been Cancelled',
          html: `
            <h2>Order Cancellation Confirmation</h2>
            <p>Dear ${order.customerName},</p>
            <p>Your order #${order.id} has been cancelled as requested.</p>
            <p>Order Details:</p>
            <ul>
              ${items.map(item => `
                <li>${item.quantity}x ${item.name}</li>
              `).join('')}
            </ul>
            <p>Refund amount: $${order.total.toFixed(2)}</p>
            <p>The refund will be processed within 3-5 business days.</p>
            <p>Thank you for choosing Pakwan!</p>
          `
        });
        notifications.push('email');
      } catch (error) {
        console.error('Failed to send email cancellation:', error);
      }
    }

    // Send SMS cancellation if configured
    if (twilioClient && order.customerPhone && process.env.TWILIO_PHONE_NUMBER) {
      try {
        const message = await twilioClient.messages.create({
          body: `Your Pakwan order #${order.id} has been cancelled. Refund of $${order.total.toFixed(2)} will be processed within 3-5 business days.`,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: order.customerPhone
        });
        console.log('SMS cancellation sent:', message.sid);
        notifications.push('sms');
      } catch (error) {
        console.error('Failed to send SMS cancellation:', error);
      }
    }

    return { 
      success: true,
      notifications: notifications.length ? notifications : ['none']
    };
  } catch (error) {
    console.error('Error in cancellation notification:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export { sendSMS }; 