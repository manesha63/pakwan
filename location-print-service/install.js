const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const chalk = require('chalk');

async function installDependencies() {
  console.log(chalk.blue('\nInstalling required packages...'));
  try {
    execSync('npm install dotenv escpos escpos-usb escpos-network inquirer chalk', { stdio: 'inherit' });
    console.log(chalk.green('✓ Dependencies installed successfully'));
  } catch (error) {
    console.error(chalk.red('Error installing dependencies:'), error);
    process.exit(1);
  }
}

async function setupPrinterConfig() {
  const questions = [
    {
      type: 'list',
      name: 'printerType',
      message: 'What type of printer are you using?',
      choices: ['USB', 'Network']
    }
  ];

  const { printerType } = await inquirer.prompt(questions);

  let config = {
    PRINTER_TYPE: printerType
  };

  if (printerType === 'USB') {
    const usbQuestions = [
      {
        type: 'input',
        name: 'vendorId',
        message: 'Enter the printer Vendor ID (e.g., 0x0483):',
        validate: input => /^0x[0-9A-Fa-f]{4}$/.test(input) || 'Please enter a valid Vendor ID (e.g., 0x0483)'
      },
      {
        type: 'input',
        name: 'productId',
        message: 'Enter the printer Product ID (e.g., 0x5740):',
        validate: input => /^0x[0-9A-Fa-f]{4}$/.test(input) || 'Please enter a valid Product ID (e.g., 0x5740)'
      }
    ];

    const usbAnswers = await inquirer.prompt(usbQuestions);
    config = {
      ...config,
      USB_VENDOR_ID: usbAnswers.vendorId,
      USB_PRODUCT_ID: usbAnswers.productId
    };
  } else {
    const networkQuestions = [
      {
        type: 'input',
        name: 'address',
        message: 'Enter the printer IP address:',
        validate: input => /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(input) || 'Please enter a valid IP address'
      },
      {
        type: 'input',
        name: 'port',
        message: 'Enter the printer port (default: 9100):',
        default: '9100',
        validate: input => !isNaN(input) && parseInt(input) > 0 && parseInt(input) <= 65535 || 'Please enter a valid port number'
      }
    ];

    const networkAnswers = await inquirer.prompt(networkQuestions);
    config = {
      ...config,
      PRINTER_IP: networkAnswers.address,
      PRINTER_PORT: networkAnswers.port
    };
  }

  // Get location API key
  const { apiKey } = await inquirer.prompt([
    {
      type: 'input',
      name: 'apiKey',
      message: 'Enter your location API key:',
      validate: input => input.length > 0 || 'API key is required'
    }
  ]);

  config.LOCATION_API_KEY = apiKey;

  // Create .env file
  const envContent = Object.entries(config)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  try {
    fs.writeFileSync(path.join(__dirname, '.env'), envContent);
    console.log(chalk.green('\n✓ Configuration saved successfully'));
  } catch (error) {
    console.error(chalk.red('\nError saving configuration:'), error);
    process.exit(1);
  }
}

async function setupSystemService() {
  if (process.platform !== 'win32') {
    const serviceContent = `[Unit]
Description=Pakwan Print Service
After=network.target

[Service]
ExecStart=/usr/bin/node ${path.join(__dirname, 'print-service.js')}
Restart=always
User=${process.env.USER}
Environment=NODE_ENV=production
WorkingDirectory=${__dirname}

[Install]
WantedBy=multi-user.target`;

    try {
      fs.writeFileSync('/etc/systemd/system/pakwan-print.service', serviceContent);
      execSync('sudo systemctl daemon-reload');
      execSync('sudo systemctl enable pakwan-print');
      execSync('sudo systemctl start pakwan-print');
      console.log(chalk.green('\n✓ System service installed and started'));
    } catch (error) {
      console.error(chalk.red('\nError setting up system service:'), error);
      console.log(chalk.yellow('You may need to set up the service manually.'));
    }
  } else {
    // Windows service setup using node-windows (to be implemented)
    console.log(chalk.yellow('\nWindows service setup will be implemented in a future update.'));
    console.log(chalk.yellow('For now, please run the print service manually using:'));
    console.log(chalk.blue('node print-service.js'));
  }
}

async function main() {
  console.log(chalk.blue.bold('\nPakwan Print Service Installation\n'));
  
  await installDependencies();
  await setupPrinterConfig();
  await setupSystemService();

  console.log(chalk.green.bold('\nInstallation complete!'));
  console.log(chalk.blue('\nTo test your printer, run:'));
  console.log(chalk.white('node test-printer.js'));
}

main().catch(error => {
  console.error(chalk.red('\nInstallation failed:'), error);
  process.exit(1);
}); 