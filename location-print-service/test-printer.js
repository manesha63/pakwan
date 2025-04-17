require('dotenv').config();
const escpos = require('escpos');
const chalk = require('chalk');

// Register USB adapter
escpos.USB = require('escpos-usb');
// Register Network adapter
escpos.Network = require('escpos-network');

async function getDevice() {
  if (process.env.PRINTER_TYPE === 'USB') {
    if (!process.env.USB_VENDOR_ID || !process.env.USB_PRODUCT_ID) {
      throw new Error('USB printer configuration missing. Please check your .env file.');
    }
    
    const device = new escpos.USB(
      parseInt(process.env.USB_VENDOR_ID, 16),
      parseInt(process.env.USB_PRODUCT_ID, 16)
    );
    return device;
  } else if (process.env.PRINTER_TYPE === 'Network') {
    if (!process.env.PRINTER_IP || !process.env.PRINTER_PORT) {
      throw new Error('Network printer configuration missing. Please check your .env file.');
    }
    
    const device = new escpos.Network(
      process.env.PRINTER_IP,
      process.env.PRINTER_PORT
    );
    return device;
  } else {
    throw new Error('Invalid printer type specified in .env file');
  }
}

async function printTestReceipt() {
  console.log(chalk.blue('Initializing printer test...'));
  
  try {
    const device = await getDevice();
    const options = { encoding: "GB18030" };
    const printer = new escpos.Printer(device, options);

    console.log(chalk.blue('Connecting to printer...'));
    
    device.open(function(error) {
      if (error) {
        console.error(chalk.red('Error connecting to printer:'), error);
        process.exit(1);
      }

      console.log(chalk.green('Connected to printer. Printing test receipt...'));

      printer
        .font('a')
        .align('ct')
        .style('b')
        .size(1, 1)
        .text('PAKWAN')
        .text('Print Test')
        .text('------------------------')
        .style('normal')
        .size(0, 0)
        .text(new Date().toLocaleString())
        .text('')
        .align('lt')
        .text('Printer Type: ' + process.env.PRINTER_TYPE)
        .text('Connection Details:')
        .text(process.env.PRINTER_TYPE === 'USB' 
          ? `USB (VID: ${process.env.USB_VENDOR_ID}, PID: ${process.env.USB_PRODUCT_ID})`
          : `Network (IP: ${process.env.PRINTER_IP}, Port: ${process.env.PRINTER_PORT})`)
        .text('')
        .text('Test Order:')
        .text('1x Butter Chicken    $15.99')
        .text('2x Naan              $ 7.98')
        .text('1x Mango Lassi       $ 4.99')
        .text('------------------------')
        .style('b')
        .text('Subtotal:           $28.96')
        .text('Tax (9.5%):         $ 2.75')
        .text('Total:              $31.71')
        .text('')
        .style('normal')
        .text('If you can read this,')
        .text('your printer is working!')
        .text('')
        .text('')
        .cut()
        .close();

      console.log(chalk.green('Test receipt sent to printer!'));
      console.log(chalk.blue('Please check your printer for the test receipt.'));
      console.log(chalk.blue('If the receipt printed correctly, your printer is set up properly.'));
    });
  } catch (error) {
    console.error(chalk.red('Error during printer test:'), error);
    console.log(chalk.yellow('\nTroubleshooting tips:'));
    console.log('1. Check that your printer is powered on and connected');
    console.log('2. Verify the printer settings in your .env file');
    console.log('3. Make sure you have the correct permissions to access the printer');
    console.log('\nIf the problem persists, please contact technical support.');
    process.exit(1);
  }
}

printTestReceipt(); 