import React, { useState } from 'react';
import {
  testDatabaseSetup,
  fetchFromRealtimeDatabase,
  fetchFromFirestore,
  verifyDatabaseData,
  verifyFirestoreData,
  initializeMenuData
} from '../utils/firebaseUtils';
import { deleteAllUsers } from '../utils/adminUtils';
import AdminTests from './AdminTests';

const AdminPanel = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleTestAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const testResults = await testDatabaseSetup();
      setResults(testResults);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInitializeDatabase = async (type) => {
    setLoading(true);
    setError(null);
    try {
      await initializeMenuData(type);
      setResults({ message: `Successfully initialized ${type} database` });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyData = async () => {
    setLoading(true);
    setError(null);
    try {
      const verificationResults = await verifyDatabaseData();
      setResults(verificationResults);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyFirestore = async () => {
    setLoading(true);
    setError(null);
    try {
      const verificationResults = await verifyFirestoreData();
      setResults(verificationResults);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckDatabase = async (type) => {
    setLoading(true);
    setError(null);
    try {
      const data = type === 'realtime' 
        ? await fetchFromRealtimeDatabase()
        : await fetchFromFirestore();
      setResults({ [`${type}Data`]: data });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAllUsers = async () => {
    if (window.confirm('Are you sure you want to delete all users? This action cannot be undone.')) {
      setLoading(true);
      setError(null);
      try {
        await deleteAllUsers();
        setResults({ message: 'Successfully deleted all users' });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="admin-panel">
      <style>
        {`
          .admin-panel {
            padding: 20px;
            max-width: 800px;
            margin: 0 auto;
          }
          
          .admin-header {
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #eee;
          }
          
          .button-group {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 10px;
            margin-bottom: 20px;
          }
          
          .admin-button {
            padding: 10px 15px;
            border: none;
            border-radius: 4px;
            background-color: #007bff;
            color: white;
            cursor: pointer;
            transition: background-color 0.3s;
          }
          
          .admin-button:hover {
            background-color: #0056b3;
          }
          
          .admin-button:disabled {
            background-color: #cccccc;
            cursor: not-allowed;
          }
          
          .results-panel {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 4px;
            margin-top: 20px;
          }
          
          .error-message {
            color: #dc3545;
            padding: 10px;
            background-color: #f8d7da;
            border-radius: 4px;
            margin-top: 20px;
          }
          
          .success-message {
            color: #28a745;
            padding: 10px;
            background-color: #d4edda;
            border-radius: 4px;
            margin-top: 20px;
          }
          
          .loading-spinner {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 3px solid #f3f3f3;
            border-top: 3px solid #3498db;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-left: 10px;
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>

      <div className="admin-header">
        <h1>Admin Panel - Database Management</h1>
      </div>

      <AdminTests />

      <div className="button-group">
        <button 
          className="admin-button"
          onClick={handleTestAll}
          disabled={loading}
        >
          Test All Database Operations
        </button>

        <button 
          className="admin-button"
          onClick={() => handleInitializeDatabase('firestore')}
          disabled={loading}
        >
          Initialize Firestore
        </button>

        <button 
          className="admin-button"
          onClick={handleVerifyFirestore}
          disabled={loading}
        >
          Verify Firestore Data
        </button>

        <button 
          className="admin-button"
          onClick={() => handleCheckDatabase('firestore')}
          disabled={loading}
        >
          Check Firestore
        </button>

        <button 
          className="admin-button"
          onClick={() => handleInitializeDatabase('both')}
          disabled={loading}
        >
          Initialize Both Databases
        </button>

        <button 
          className="admin-button"
          onClick={() => handleInitializeDatabase('realtime')}
          disabled={loading}
        >
          Initialize Realtime DB
        </button>

        <button 
          className="admin-button"
          onClick={handleVerifyData}
          disabled={loading}
        >
          Verify All Data
        </button>

        <button 
          className="admin-button"
          onClick={() => handleCheckDatabase('realtime')}
          disabled={loading}
        >
          Check Realtime DB
        </button>

        <button 
          className="admin-button danger"
          onClick={handleDeleteAllUsers}
          disabled={loading}
          style={{
            backgroundColor: '#dc3545',
            marginTop: '20px'
          }}
        >
          Delete All Users
        </button>
      </div>

      {loading && (
        <div className="loading-spinner" />
      )}

      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
        </div>
      )}

      {results && !error && (
        <div className="results-panel">
          <h3>Results:</h3>
          <pre>
            {JSON.stringify(results, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default AdminPanel; 