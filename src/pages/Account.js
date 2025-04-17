import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Account.css';

const Account = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('profile');

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  // Mock order history data
  const orders = [
    {
      id: '1234',
      date: '2024-02-20',
      items: [
        { name: 'Chicken Biryani', quantity: 2, price: 14.99 },
        { name: 'Naan', quantity: 3, price: 2.99 }
      ],
      total: 35.95,
      status: 'completed'
    },
    {
      id: '1235',
      date: '2024-02-18',
      items: [
        { name: 'Butter Chicken', quantity: 1, price: 13.99 },
        { name: 'Garlic Naan', quantity: 2, price: 3.49 }
      ],
      total: 20.97,
      status: 'pending'
    }
  ];

  return (
    <div className="account-container">
      <div className="account-header">
        <h1>My Account</h1>
      </div>

      <div className="account-content">
        <div className="account-sidebar">
          <div className="account-menu">
            <button 
              className={`account-menu-item ${activeSection === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveSection('profile')}
            >
              Profile
            </button>
            <button 
              className={`account-menu-item ${activeSection === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveSection('orders')}
            >
              Order History
            </button>
            <button 
              className={`account-menu-item ${activeSection === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveSection('settings')}
            >
              Settings
            </button>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        </div>

        <div className="account-main">
          {activeSection === 'profile' && (
            <div className="profile-section">
              <h2>Profile Information</h2>
              <div className="profile-info">
                <div className="info-group">
                  <span className="info-label">Email</span>
                  <span className="info-value">{currentUser.email}</span>
                </div>
                <div className="info-group">
                  <span className="info-label">Member Since</span>
                  <span className="info-value">
                    {new Date(currentUser.metadata.creationTime).toLocaleDateString()}
                  </span>
                </div>
                <button className="edit-button">Edit Profile</button>
              </div>
            </div>
          )}

          {activeSection === 'orders' && (
            <div className="order-history">
              <h2>Order History</h2>
              {orders.map(order => (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <span className="order-number">Order #{order.id}</span>
                    <span className="order-date">
                      {new Date(order.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="order-items">
                    {order.items.map((item, index) => (
                      <div key={index}>
                        {item.quantity}x {item.name} - ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    ))}
                  </div>
                  <div className="order-total">
                    Total: ${order.total.toFixed(2)}
                  </div>
                  <span className={`order-status status-${order.status}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          )}

          {activeSection === 'settings' && (
            <div className="profile-section">
              <h2>Account Settings</h2>
              <div className="profile-info">
                <div className="info-group">
                  <span className="info-label">Notification Preferences</span>
                  <button className="edit-button">Manage Notifications</button>
                </div>
                <div className="info-group">
                  <span className="info-label">Password</span>
                  <button className="edit-button">Change Password</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Account; 