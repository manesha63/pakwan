import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { collection, query, where, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const { userRole, adminLocation } = useAuth();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hours, setHours] = useState({
    monday: { open: '10:00', close: '22:00' },
    tuesday: { open: '10:00', close: '22:00' },
    wednesday: { open: '10:00', close: '22:00' },
    thursday: { open: '10:00', close: '22:00' },
    friday: { open: '10:00', close: '23:00' },
    saturday: { open: '10:00', close: '23:00' },
    sunday: { open: '10:00', close: '22:00' }
  });

  // Fetch orders
  useEffect(() => {
    if (!adminLocation) return;

    const ordersQuery = query(
      collection(db, 'orders'),
      where('locationId', '==', adminLocation),
      where('status', 'in', ['pending', 'preparing', 'ready'])
    );

    const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(ordersData);
      setLoading(false);
    }, (error) => {
      setError(error.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [adminLocation]);

  // Fetch menu items
  useEffect(() => {
    if (!adminLocation) return;

    const menuQuery = query(
      collection(db, 'menu'),
      where('locationId', '==', adminLocation)
    );

    const unsubscribe = onSnapshot(menuQuery, (snapshot) => {
      const menuData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMenuItems(menuData);
    }, (error) => {
      setError(error.message);
    });

    return () => unsubscribe();
  }, [adminLocation]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      setError(error.message);
    }
  };

  const handleAvailabilityChange = async (itemId, isAvailable) => {
    try {
      await updateDoc(doc(db, 'menu', itemId), {
        isAvailable,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      setError(error.message);
    }
  };

  const handleHoursChange = async (day, field, value) => {
    try {
      const newHours = { ...hours, [day]: { ...hours[day], [field]: value } };
      setHours(newHours);
      await updateDoc(doc(db, 'locations', adminLocation), {
        hours: newHours,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) {
    return <div className="admin-loading">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="admin-error">Error: {error}</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <div className="printer-status">
          Printer Status: <span className="connected">Connected</span>
        </div>
      </div>

      <div className="admin-tabs">
        <button 
          className={`tab ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </button>
        <button 
          className={`tab ${activeTab === 'menu' ? 'active' : ''}`}
          onClick={() => setActiveTab('menu')}
        >
          Menu Management
        </button>
        <button 
          className={`tab ${activeTab === 'hours' ? 'active' : ''}`}
          onClick={() => setActiveTab('hours')}
        >
          Operating Hours
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'orders' && (
          <div className="orders-section">
            {orders.length === 0 ? (
              <p>No active orders</p>
            ) : (
              orders.map(order => (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <h3>Order #{order.id.slice(-4)}</h3>
                    <span className={`status-badge ${order.status}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="order-details">
                    <p>Customer: {order.customerName}</p>
                    <p>Time: {new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="order-items">
                    <h4>Items:</h4>
                    <ul>
                      {order.items.map((item, index) => (
                        <li key={index}>
                          {item.quantity}x {item.name} - ${item.price}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="order-total">
                    Total: ${order.total.toFixed(2)}
                  </div>
                  <div className="order-actions">
                    {order.status === 'pending' && (
                      <>
                        <button 
                          className="accept-btn"
                          onClick={() => handleStatusChange(order.id, 'preparing')}
                        >
                          Accept Order
                        </button>
                        <button 
                          className="reject-btn"
                          onClick={() => handleStatusChange(order.id, 'cancelled')}
                        >
                          Reject Order
                        </button>
                      </>
                    )}
                    {order.status === 'preparing' && (
                      <button 
                        className="ready-btn"
                        onClick={() => handleStatusChange(order.id, 'ready')}
                      >
                        Mark as Ready
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'menu' && (
          <div className="menu-section">
            {menuItems.map(item => (
              <div key={item.id} className="menu-item">
                <div className="item-info">
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <span className="price">${item.price}</span>
                </div>
                <div className="availability-toggle">
                  <label>
                    <input
                      type="checkbox"
                      checked={item.isAvailable}
                      onChange={(e) => handleAvailabilityChange(item.id, e.target.checked)}
                    />
                    Available
                  </label>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'hours' && (
          <div className="hours-section">
            <h2>Operating Hours</h2>
            <div className="hours-form">
              {Object.entries(hours).map(([day, times]) => (
                <div key={day} className="day-row">
                  <span className="day-name">{day.charAt(0).toUpperCase() + day.slice(1)}</span>
                  <div className="time-inputs">
                    <input
                      type="time"
                      value={times.open}
                      onChange={(e) => handleHoursChange(day, 'open', e.target.value)}
                    />
                    <span>to</span>
                    <input
                      type="time"
                      value={times.close}
                      onChange={(e) => handleHoursChange(day, 'close', e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard; 