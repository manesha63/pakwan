import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import PrinterService from '../services/PrinterService';
import '../styles/PrinterConfig.css';

const PrinterConfig = () => {
  const { adminLocation } = useAuth();
  const [printerConfig, setPrinterConfig] = useState({
    type: 'network', // or 'usb'
    address: '',
    port: 9100,
    vendorId: '',
    productId: '',
    name: '',
    model: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    loadPrinterConfig();
  }, [adminLocation]);

  const loadPrinterConfig = async () => {
    try {
      const config = await PrinterService.getPrinterConfig(adminLocation);
      if (config) {
        setPrinterConfig(config);
      }
      setLoading(false);
    } catch (error) {
      setError('Error loading printer configuration');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPrinterConfig(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    try {
      await PrinterService.savePrinterConfig(adminLocation, printerConfig);
      setSuccess('Printer configuration saved successfully');
      
      // Test the printer connection
      await PrinterService.testPrinter(adminLocation);
    } catch (error) {
      setError('Error saving printer configuration: ' + error.message);
    }
  };

  if (loading) {
    return <div>Loading printer configuration...</div>;
  }

  return (
    <div className="printer-config">
      <h2>Printer Configuration</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Printer Type</label>
          <select
            name="type"
            value={printerConfig.type}
            onChange={handleInputChange}
            required
          >
            <option value="network">Network Printer</option>
            <option value="usb">USB Printer</option>
          </select>
        </div>

        {printerConfig.type === 'network' && (
          <>
            <div className="form-group">
              <label>IP Address</label>
              <input
                type="text"
                name="address"
                value={printerConfig.address}
                onChange={handleInputChange}
                placeholder="192.168.1.100"
                required
              />
            </div>
            <div className="form-group">
              <label>Port</label>
              <input
                type="number"
                name="port"
                value={printerConfig.port}
                onChange={handleInputChange}
                placeholder="9100"
                required
              />
            </div>
          </>
        )}

        {printerConfig.type === 'usb' && (
          <>
            <div className="form-group">
              <label>Vendor ID</label>
              <input
                type="text"
                name="vendorId"
                value={printerConfig.vendorId}
                onChange={handleInputChange}
                placeholder="0x0483"
                required
              />
            </div>
            <div className="form-group">
              <label>Product ID</label>
              <input
                type="text"
                name="productId"
                value={printerConfig.productId}
                onChange={handleInputChange}
                placeholder="0x5740"
                required
              />
            </div>
          </>
        )}

        <div className="form-group">
          <label>Printer Name</label>
          <input
            type="text"
            name="name"
            value={printerConfig.name}
            onChange={handleInputChange}
            placeholder="Kitchen Printer 1"
            required
          />
        </div>

        <div className="form-group">
          <label>Printer Model</label>
          <input
            type="text"
            name="model"
            value={printerConfig.model}
            onChange={handleInputChange}
            placeholder="EPSON TM-T88V"
            required
          />
        </div>

        <div className="button-group">
          <button type="submit" className="save-button">
            Save Configuration
          </button>
          <button
            type="button"
            className="test-button"
            onClick={() => PrinterService.testPrinter(adminLocation)}
          >
            Test Printer
          </button>
        </div>
      </form>
    </div>
  );
};

export default PrinterConfig; 