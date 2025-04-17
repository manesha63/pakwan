import ThermalPrinter from 'node-thermal-printer';
const { printer: Printer, types: PrinterTypes } = ThermalPrinter;

let printer = null;
let printerInitialized = false;

const initializePrinter = async () => {
  if (printerInitialized) return printer;
  
  try {
    printer = new Printer({
      type: PrinterTypes.EPSON,
      interface: process.env.PRINTER_INTERFACE || 'tcp://localhost:9100',
      options: {
        timeout: 3000
      },
      width: 48,
      characterSet: 'PC437_USA',
      removeSpecialCharacters: false,
      lineCharacter: '-'
    });

    // Test if printer is connected
    const isConnected = await printer.isPrinterConnected();
    if (!isConnected) {
      console.warn('Printer not connected. Orders will still be processed but receipts will not print.');
      printer = null;
    } else {
      console.log('Printer initialized successfully');
    }
  } catch (error) {
    console.error('Error initializing printer:', error);
    printer = null;
  }

  printerInitialized = true;
  return printer;
};

const getPrinter = () => printer;

const formatCurrency = (amount) => {
  return `$${Number(amount).toFixed(2)}`;
};

const printDivider = async () => {
  if (!printer) return;
  await printer.drawLine();
};

export const printOrder = async (orderId, orderData) => {
  console.log('Mock: Would print order:', orderId);
  return true;
};

export const printCancellation = async (orderId, orderData) => {
  console.log('Mock: Would print cancellation for order:', orderId);
  return true;
};

export {
  initializePrinter,
  getPrinter,
  printOrder,
  printCancellation
}; 