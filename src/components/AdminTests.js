import React, { useState } from 'react';
import { testAdminFunctions } from '../utils/adminTest';
import '../styles/AdminTests.css';

const AdminTests = () => {
  const [testResults, setTestResults] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState(null);

  const runTests = async () => {
    setIsRunning(true);
    setError(null);
    try {
      const success = await testAdminFunctions();
      setTestResults(success);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="admin-tests">
      <h2>Admin Function Tests</h2>
      <p>Run this test to verify all admin functions are working correctly.</p>
      
      <button 
        className="test-button"
        onClick={runTests}
        disabled={isRunning}
      >
        {isRunning ? 'Running Tests...' : 'Run Tests'}
      </button>

      {error && (
        <div className="error-message">
          <h3>Error</h3>
          <p>{error}</p>
        </div>
      )}

      {testResults !== null && (
        <div className={`results-message ${testResults ? 'success' : 'failure'}`}>
          <h3>Test Results</h3>
          <p>
            {testResults 
              ? 'All admin functions are working correctly!'
              : 'Some admin functions failed. Check the console for details.'}
          </p>
        </div>
      )}

      <div className="test-details">
        <h3>Tests Performed:</h3>
        <ol>
          <li>Authentication</li>
          <li>Database Access</li>
          <li>Location Data</li>
          <li>Menu Data</li>
          <li>User Management</li>
          <li>Order Management</li>
          <li>Menu Management</li>
          <li>Location Management</li>
          <li>Printer Status</li>
          <li>Admin Permissions</li>
        </ol>
      </div>
    </div>
  );
};

export default AdminTests; 