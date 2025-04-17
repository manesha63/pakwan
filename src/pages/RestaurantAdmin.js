import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../config/firebase';
import { collection, query, where, onSnapshot, doc, updateDoc, getDoc } from 'firebase/firestore';
import MenuManagement from '../pages/MenuManagement';
import '../styles/RestaurantAdmin.css';

function RestaurantAdmin() {
  const { currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('current');
  const [currentOrders, setCurrentOrders] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [printerStatus, setPrinterStatus] = useState('Connected');
  const [hours, setHours] = useState({
    monday: { open: '10:00', close: '22:00' },
    tuesday: { open: '10:00', close: '22:00' },
    wednesday: { open: '10:00', close: '22:00' },
    thursday: { open: '10:00', close: '22:00' },
    friday: { open: '10:00', close: '23:00' },
    saturday: { open: '10:00', close: '23:00' },
    sunday: { open: '10:00', close: '22:00' }
  });

  // Fetch location hours
  useEffect(() => {
    const fetchHours = async () => {
      try {
        const locationRef = doc(db, 'locations', currentUser.locationId);
        const locationDoc = await getDoc(locationRef);
        if (locationDoc.exists() && locationDoc.data().hours) {
          setHours(locationDoc.data().hours);
        }
      } catch (error) {
        console.error('Error fetching hours:', error);
      }
    };
    fetchHours();
  }, [currentUser.locationId]);

  // Fetch current orders
  useEffect(() => {
    const ordersRef = collection(db, 'orders');
    const currentOrdersQuery = query(
      ordersRef,
      where('locationId', '==', currentUser.locationId),
      where('status', 'in', ['pending', 'preparing'])
    );

    const unsubscribe = onSnapshot(currentOrdersQuery, (snapshot) => {
      const orders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate()
      }));
      setCurrentOrders(orders);
    });

    return () => unsubscribe();
  }, [currentUser.locationId]);

  // Fetch order history
  useEffect(() => {
    const ordersRef = collection(db, 'orders');
    const historyQuery = query(
      ordersRef,
      where('locationId', '==', currentUser.locationId),
      where('status', 'in', ['completed', 'cancelled'])
    );

    const unsubscribe = onSnapshot(historyQuery, (snapshot) => {
      const orders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate()
      }));
      setOrderHistory(orders);
    });

    return () => unsubscribe();
  }, [currentUser.locationId]);

  // Update hours
  const updateHours = async (day, type, value) => {
    try {
      const newHours = {
        ...hours,
        [day]: { ...hours[day], [type]: value }
      };
      setHours(newHours);
      
      const locationRef = doc(db, 'locations', currentUser.locationId);
      await updateDoc(locationRef, {
        hours: newHours
      });
    } catch (error) {
      console.error('Error updating hours:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const renderCurrentOrders = () => (
    <div className="orders-section">
      <h2>Current Orders</h2>
      <div className="orders-grid">
        {currentOrders.map(order => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <span className="order-number">Order #{order.id.slice(-6)}</span>
              <span className="status-badge">{order.status}</span>
            </div>
            <div className="order-items">
              {order.items.map((item, index) => (
                <div key={index} className="order-item">
                  {item.quantity}x {item.name}
                </div>
              ))}
            </div>
            <div className="order-total">
              Total: ${order.total.toFixed(2)}
            </div>
            <div className="order-time">
              {order.timestamp?.toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderOrderHistory = () => (
    <div className="orders-section">
      <h2>Order History</h2>
      <div className="orders-grid">
        {orderHistory.map(order => (
          <div key={order.id} className="order-card history">
            <div className="order-header">
              <span className="order-number">Order #{order.id.slice(-6)}</span>
              <span className={`status-badge ${order.status}`}>{order.status}</span>
            </div>
            <div className="order-items">
              {order.items.map((item, index) => (
                <div key={index} className="order-item">
                  {item.quantity}x {item.name}
                </div>
              ))}
            </div>
            <div className="order-total">
              Total: ${order.total.toFixed(2)}
            </div>
            <div className="order-time">
              {order.timestamp?.toLocaleDateString()} {order.timestamp?.toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderHours = () => (
    <div className="hours-section">
      <h2>Operating Hours</h2>
      <div className="hours-grid">
        {Object.entries(hours).map(([day, times]) => (
          <div key={day} className="hours-row">
            <span className="day-name">{day.charAt(0).toUpperCase() + day.slice(1)}</span>
            <div className="time-inputs">
              <input
                type="time"
                value={times.open}
                onChange={(e) => updateHours(day, 'open', e.target.value)}
              />
              <span>to</span>
              <input
                type="time"
                value={times.close}
                onChange={(e) => updateHours(day, 'close', e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="restaurant-admin">
      <div className="admin-header">
        <h1>Restaurant Dashboard</h1>
        <div className="header-actions">
          <div className="printer-status">
            Printer Status: <span className="connected">{printerStatus}</span>
          </div>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </div>

      <div className="admin-tabs">
        <button
          className={`tab ${activeTab === 'current' ? 'active' : ''}`}
          onClick={() => setActiveTab('current')}
        >
          Current Orders
        </button>
        <button
          className={`tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          Order History
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
          Hours
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'current' && renderCurrentOrders()}
        {activeTab === 'history' && renderOrderHistory()}
        {activeTab === 'menu' && <MenuManagement />}
        {activeTab === 'hours' && renderHours()}
      </div>
    </div>
  );
}

export default RestaurantAdmin; 