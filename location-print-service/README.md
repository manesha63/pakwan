# Pakwan Print Service Setup Guide

This guide will help you set up the print service for your location's order printing system.

## Prerequisites

- Node.js 14 or higher installed
- npm (comes with Node.js)
- A compatible receipt printer (USB or Network)
- For USB printers: Vendor ID and Product ID
- For Network printers: IP address and port number
- Your location's API key

## Installation Steps

1. Clone or download this directory to your computer
2. Open a terminal/command prompt in the `location-print-service` directory
3. Run the installation script:
   ```bash
   node install.js
   ```
4. Follow the prompts to enter your printer information:
   - Choose printer type (USB/Network)
   - For USB printers: Enter Vendor ID and Product ID
   - For Network printers: Enter IP address and port
   - Enter your location's API key

The script will:
- Create a configuration file
- Install required dependencies
- Set up the print service to run automatically

## Testing the Printer

After installation, test your printer by running:
```bash
node test-printer.js
```

This will print a test receipt. If successful, you should see:
- A centered "Pakwan Print Service" header
- Current date and time
- A test message

## Troubleshooting

If the test print fails:

1. Check printer connection:
   - USB: Ensure printer is plugged in and powered on
   - Network: Verify IP address and port are correct
   
2. Verify configuration:
   - Check `.env` file for correct settings
   - For USB printers: Confirm Vendor ID and Product ID
   - For Network printers: Ping the printer IP address

3. Common issues:
   - "Device not found": Check USB connection or printer power
   - "Network error": Verify IP address and firewall settings
   - "Permission denied": Run with administrator/sudo privileges

## Support

If you encounter issues:
1. Check the error message in the terminal
2. Take a screenshot of any error messages
3. Contact technical support with:
   - Your location name
   - Error screenshots
   - Printer make and model
   - Connection type (USB/Network)

## Service Management

The print service runs automatically on system startup. To manage it manually:

```bash
# Start the service
sudo systemctl start pakwan-print

# Stop the service
sudo systemctl stop pakwan-print

# Check service status
sudo systemctl status pakwan-print

# View service logs
journalctl -u pakwan-print
``` 