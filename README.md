# 🍽️ Pakwan Restaurant Management System

A modern, full-stack restaurant management system built with Node.js and React. This system handles orders, payments, notifications, and kitchen operations efficiently.

> ⚠️ **Note**: This project is currently under active development. Some features are in progress or planned for future implementation.

## ✨ Current Features

- **📝 Order Management**
  - Create and track orders in real-time
  - Add special requests for menu items
  - Order status updates
  - Order cancellation with refund processing

- **💳 Payment Processing**
  - Secure payment handling with Stripe
  - Automatic refund processing
  - Payment status tracking

- **📨 Notification System**
  - Email notifications (in progress)
  - SMS notifications (in progress)
  - Order status updates
  - Order ready notifications

- **🖨️ Receipt Printing**
  - Thermal printer support
  - Customizable receipt formats
  - Order details and cancellation receipts

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js, ES Modules
- **Payment**: Stripe API
- **Notifications**: Nodemailer, Twilio
- **Printing**: node-thermal-printer
- **Development**: dotenv, morgan, cors, nodemon

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/pakwan.git
   cd pakwan
   ```

2. **Install dependencies**
   ```bash
   # Server dependencies
   cd server
   npm install

   # Client dependencies (when frontend is ready)
   cd ../client
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the server directory:
   ```env
   PORT=3000
   NODE_ENV=development

   # Stripe Keys
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

   # Email Config
   EMAIL_USER=your-restaurant@gmail.com
   EMAIL_PASSWORD=your_gmail_app_password

   # Twilio Config (Optional)
   TWILIO_ACCOUNT_SID=your_twilio_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_PHONE_NUMBER=your_twilio_phone
   ```

4. **Start Development Servers**
   ```bash
   # Start server
   cd server
   npm run dev

   # Start client (when frontend is ready)
   cd ../client
   npm start
   ```

## 🚀 Available API Endpoints

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:orderId` - Get order details
- `PATCH /api/orders/:orderId/status` - Update order status
- `POST /api/orders/:orderId/cancel` - Cancel order

### Payments
- `POST /api/stripe/create-payment-intent` - Create payment intent
- `POST /api/stripe/webhook` - Handle Stripe webhooks
- `POST /api/stripe/refund` - Process refund

## 🔒 Security Features

- Secure payment processing with Stripe
- Environment variables for sensitive data
- CORS configuration
- Input validation and sanitization
- Error handling and logging

## 🧪 Testing

```bash
cd server
npm test
```

## 🚧 Work in Progress

Check our [PROJECT_STATUS.md](PROJECT_STATUS.md) file for:
- Detailed status of all features
- Known issues
- Upcoming features
- Development roadmap

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

If you encounter any issues or have questions, please:
1. Check the [PROJECT_STATUS.md](PROJECT_STATUS.md) file for known issues
2. Open an issue in the GitHub repository
3. Provide as much detail as possible about your problem

---
Made with ❤️ for restaurant owners and staff
