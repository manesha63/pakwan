import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/UserProfile.css';

function UserProfile() {
  const { currentUser, logout } = useAuth();
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    try {
      setError('');
      setLoading(true);
      await logout();
    } catch (err) {
      setError('Failed to log out');
    }
    setLoading(false);
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>My Profile</h2>
        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}
        
        <div className="profile-info">
          <div className="profile-field">
            <label>Email:</label>
            <span>{currentUser.email}</span>
          </div>
          <div className="profile-field">
            <label>Account Created:</label>
            <span>{new Date(currentUser.metadata.creationTime).toLocaleDateString()}</span>
          </div>
          <div className="profile-field">
            <label>Last Sign In:</label>
            <span>{new Date(currentUser.metadata.lastSignInTime).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="profile-actions">
          <button 
            onClick={handleLogout} 
            disabled={loading} 
            className="logout-button"
          >
            {loading ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserProfile; 