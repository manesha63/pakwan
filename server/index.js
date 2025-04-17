import express from 'express';
import cors from 'cors';
import ordersRouter from './routes/orders.js';
import stripeRouter from './routes/stripe.js';

const app = express();
const port = process.env.PORT || 5001;

// Basic middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/api/test', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Routes
app.use('/api/orders', ordersRouter);
app.use('/api/stripe', stripeRouter);

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log('Available routes:');
  console.log('- GET /api/test');
  console.log('- POST /api/orders');
  console.log('- POST /api/stripe/create-payment-intent');
}); 