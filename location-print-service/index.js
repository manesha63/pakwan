const express = require('express');
const bodyParser = require('body-parser');
const escpos = require('escpos');
escpos.USB = require('escpos-usb');
escpos.Network = require('escpos-network');

const app = express();
app.use(bodyParser.json());

// Load printer configuration from environment variables
const PRINTER_CONFIG = {
  type: process.env.PRINTER_TYPE || 'network',
  address: process.env.PRINTER_ADDRESS,
  port: parseInt(process.env.PRINTER_PORT) || 9100,
  vendorId: process.env.PRINTER_VENDOR_ID,
  productId: process.env.PRINTER_PRODUCT_ID
};

// Initialize printer
let printer;
function initializePrinter() {
  try {
    let device;
    if (PRINTER_CONFIG.type === 'usb') {
      device = new escpos.USB(PRINTER_CONFIG.vendorId, PRINTER_CONFIG.productId);
    } else {
      device = new escpos.Network(PRINTER_CONFIG.address, PRINTER_CONFIG.port);
    }
    printer = new escpos.Printer(device);
    console.log('Printer initialized successfully');
    return true;
  } catch (error) {
    console.error('Failed to initialize printer:', error);
    return false;
  }
}

// Authentication middleware
const authenticateRequest = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${process.env.PRINT_SERVICE_API_KEY}`) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  next();
};

// Print order endpoint
app.post('/print', authenticateRequest, async (req, res) => {
  try {
    const { order } = req.body;
    
    if (!printer && !initializePrinter()) {
      throw new Error('Printer not available');
    }

    printer.align('center')
      .style('b')
      .size(2, 2)
      .text('NEW ORDER')
      .size(1, 1)
      .text('--------------------------------')
      .align('left')
      .style('normal')
      .text(`Order #: ${order.id}`)
      .text(`Time: ${new Date(order.timestamp).toLocaleString()}`)
      .text(`Customer: ${order.customerName}`)
      .text('--------------------------------')
      .style('b')
      .text('ITEMS:')
      .style('normal');

    order.items.forEach(item => {
      printer.text(`${item.quantity}x ${item.name}`)
        .text(`   ${item.specialInstructions || 'No special instructions'}`);
    });

    printer.text('--------------------------------')
      .style('b')
      .text(`Total: $${order.total.toFixed(2)}`)
      .text('--------------------------------')
      .cut()
      .execute();

    res.json({ success: true });
  } catch (error) {
    console.error('Error printing order:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Test print endpoint
app.post('/test', authenticateRequest, async (req, res) => {
  try {
    if (!printer && !initializePrinter()) {
      throw new Error('Printer not available');
    }

    printer.align('center')
      .text('Test Print')
      .text('Printer is working correctly')
      .text(new Date().toLocaleString())
      .cut()
      .execute();

    res.json({ success: true });
  } catch (error) {
    console.error('Error during test print:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Print service running on port ${PORT}`);
  initializePrinter();
}); 