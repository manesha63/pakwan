import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getFirestore, doc, updateDoc, collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import '../styles/LocationAdmin.css';

const LocationAdmin = () => {
  const { currentUser, adminLocation } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [hours, setHours] = useState({});
  const [loading, setLoading] = useState(true);
  const [printerStatus, setPrinterStatus] = useState('connected');
  const db = getFirestore();

  useEffect(() => {
    if (!currentUser || !adminLocation) {
      navigate('/login');
      return;
    }

    // Listen for real-time order updates
    const ordersQuery = query(
      collection(db, 'orders'),
      where('locationId', '==', adminLocation),
      orderBy('createdAt', 'desc')
    );

    const unsubscribeOrders = onSnapshot(ordersQuery, (snapshot) => {
      const newOrders = [];
      snapshot.forEach((doc) => {
        newOrders.push({ id: doc.id, ...doc.data() });
      });
      setOrders(newOrders);
    });

    // Fetch menu items for this location
    const menuQuery = query(
      collection(db, 'menu'),
      where('locationId', '==', adminLocation)
    );

    const unsubscribeMenu = onSnapshot(menuQuery, (snapshot) => {
      const items = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      setMenuItems(items);
    });

    // Fetch location hours
    const fetchHours = async () => {
      const locationDoc = await doc(db, 'locations', adminLocation);
      const unsubscribeHours = onSnapshot(locationDoc, (doc) => {
        if (doc.exists()) {
          setHours(doc.data().hours || {});
        }
      });
      return unsubscribeHours;
    };

    const setupHoursListener = async () => {
      const unsubscribeHours = await fetchHours();
      return unsubscribeHours;
    };

    setupHoursListener();
    setLoading(false);

    return () => {
      unsubscribeOrders();
      unsubscribeMenu();
    };
  }, [currentUser, adminLocation, navigate, db]);

  const updateItemAvailability = async (itemId, isAvailable) => {
    try {
      const itemRef = doc(db, 'menu', itemId);
      await updateDoc(itemRef, { available: isAvailable });
    } catch (error) {
      console.error('Error updating item availability:', error);
    }
  };

  const updateHours = async (newHours) => {
    try {
      const locationRef = doc(db, 'locations', adminLocation);
      await updateDoc(locationRef, { hours: newHours });
    } catch (error) {
      console.error('Error updating hours:', error);
    }
  };

  const handleOrderAction = async (orderId, action) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { 
        status: action,
        updatedAt: new Date().toISOString()
      });

      // Print order if accepted
      if (action === 'accepted') {
        printOrder(orderId);
      }
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const printOrder = async (orderId) => {
    // Implementation for printer connection will go here
    // This is a placeholder for the actual printer integration
    console.log(`Printing order ${orderId}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="location-admin">
      <div className="admin-header">
        <h1>Location Management</h1>
        <div className="printer-status">
          Printer Status: <span className={printerStatus}>{printerStatus}</span>
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
          Hours
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'orders' && (
          <div className="orders-section">
            <h2>Active Orders</h2>
            {orders.filter(order => order.status === 'pending').map(order => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <span>Order #{order.id}</span>
                  <span>{new Date(order.createdAt).toLocaleString()}</span>
                </div>
                <div className="order-items">
                  {order.items.map((item, index) => (
                    <div key={index} className="order-item">
                      <span>{item.quantity}x {item.name}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="order-total">
                  Total: ${order.total.toFixed(2)}
                </div>
                <div className="order-actions">
                  <button 
                    className="accept-btn"
                    onClick={() => handleOrderAction(order.id, 'accepted')}
                  >
                    Accept & Print
                  </button>
                  <button 
                    className="reject-btn"
                    onClick={() => handleOrderAction(order.id, 'rejected')}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'menu' && (
          <div className="menu-section">
            <h2>Menu Items</h2>
            {menuItems.map(item => (
              <div key={item.id} className="menu-item">
                <span>{item.name}</span>
                <label className="availability-toggle">
                  <input
                    type="checkbox"
                    checked={item.available}
                    onChange={(e) => updateItemAvailability(item.id, e.target.checked)}
                  />
                  Available
                </label>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'hours' && (
          <div className="hours-section">
            <h2>Operating Hours</h2>
            {/* Add form for updating hours */}
            {/* This will be implemented based on your hours data structure */}
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationAdmin; 