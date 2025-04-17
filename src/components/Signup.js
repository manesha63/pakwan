import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { locations } from '../data/locations';
import '../styles/Auth.css';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [locationId, setLocationId] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  // Admin registration codes for each location
  const ADMIN_CODES = {
    'fremont': 'ADMIN-FRE-2024',
    'hayward': 'ADMIN-HAY-2024',
    'sf-ofarrell': 'ADMIN-SFO-2024',
    'sf-16th': 'ADMIN-SF16-2024',
    'sf-ocean': 'ADMIN-SFOC-2024'
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    if (isAdmin) {
      if (!locationId) {
        return setError('Please select a location for admin access');
      }
      
      if (!adminCode) {
        return setError('Admin registration code is required');
      }
      
      if (adminCode !== ADMIN_CODES[locationId]) {
        return setError('Invalid admin registration code');
      }
    }

    try {
      setError('');
      setLoading(true);
      
      const role = isAdmin ? 'locationAdmin' : 'customer';
      await signup(email, password, role, locationId);
      
      // Redirect based on role
      if (isAdmin) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      let errorMessage = 'Failed to create an account: ';
      
      if (err.message.includes('auth/email-already-in-use')) {
        errorMessage += 'This email is already registered. Please use a different email or try resetting your password.';
      } else if (err.message.includes('already registered')) {
        errorMessage = err.message;
      } else if (err.message.includes('auth/weak-password')) {
        errorMessage += 'Password should be at least 6 characters long.';
      } else if (err.message.includes('auth/invalid-email')) {
        errorMessage += 'Please enter a valid email address.';
      } else {
        errorMessage += err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Sign Up</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={isAdmin}
                onChange={(e) => {
                  setIsAdmin(e.target.checked);
                  if (!e.target.checked) {
                    setLocationId('');
                    setAdminCode('');
                  }
                }}
              />
              Register as Location Admin
            </label>
          </div>
          {isAdmin && (
            <>
              <div className="form-group">
                <label>Select Location</label>
                <select
                  value={locationId}
                  onChange={(e) => setLocationId(e.target.value)}
                  required={isAdmin}
                  className="location-select"
                >
                  <option value="">Choose a location</option>
                  {locations.map(location => (
                    <option key={location.id} value={location.id}>
                      {location.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Admin Registration Code</label>
                <input
                  type="password"
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                  required={isAdmin}
                  placeholder="Enter admin registration code"
                  className="admin-code-input"
                />
              </div>
            </>
          )}
          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        <div className="auth-links">
          <Link to="/login">Already have an account? Log In</Link>
        </div>
      </div>
    </div>
  );
}

export default Signup; 