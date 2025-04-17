import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import '../styles/MenuManagement.css';

const MenuManagement = () => {
  const [menuData, setMenuData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateStatus, setUpdateStatus] = useState('');

  const fetchMenuData = async () => {
    try {
      const menuCollection = collection(db, 'menu_categories');
      const menuSnapshot = await getDocs(menuCollection);
      const menuItems = menuSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).sort((a, b) => a.name.localeCompare(b.name));
      setMenuData(menuItems);
      setError(null);
    } catch (err) {
      setError('Failed to fetch menu data');
      console.error('Error fetching menu data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuData();
  }, []);

  const toggleItemAvailability = async (categoryId, itemId, currentAvailability) => {
    try {
      const categoryRef = doc(db, 'menu_categories', categoryId);
      const category = menuData.find(cat => cat.id === categoryId);
      
      if (!category) {
        throw new Error('Category not found');
      }

      const updatedItems = category.items.map(item => 
        item.id === itemId 
          ? { ...item, is_available: !currentAvailability }
          : item
      );

      await updateDoc(categoryRef, {
        items: updatedItems
      });

      // Update local state
      setMenuData(prevData => 
        prevData.map(cat => 
          cat.id === categoryId 
            ? { ...cat, items: updatedItems }
            : cat
        )
      );

      setUpdateStatus(`Item availability updated successfully!`);
      setTimeout(() => setUpdateStatus(''), 3000);
    } catch (err) {
      console.error('Error updating item availability:', err);
      setError('Failed to update item availability');
    }
  };

  if (isLoading) {
    return <div className="menu-management-container">Loading menu data...</div>;
  }

  if (error) {
    return <div className="menu-management-container">Error: {error}</div>;
  }

  return (
    <div className="menu-management-container">
      {updateStatus && <div className="status-message">{updateStatus}</div>}

      <div className="menu-categories">
        {menuData.map(category => (
          <div key={category.id} className="category-section">
            <h2>{category.name}</h2>
            <div className="items-grid">
              {category.items?.map(item => (
                <div 
                  key={item.id} 
                  className={`menu-item ${!item.is_available ? 'unavailable' : ''}`}
                >
                  <h3>{item.name}</h3>
                  <p className="description">{item.description}</p>
                  <p className="price">${item.price.toFixed(2)}</p>
                  {item.dietary_options && item.dietary_options.length > 0 && (
                    <div className="dietary-options">
                      {item.dietary_options.map((option, index) => (
                        <span key={index} className="dietary-tag">{option}</span>
                      ))}
                    </div>
                  )}
                  <button
                    className={`availability-toggle ${item.is_available ? 'available' : 'unavailable'}`}
                    onClick={() => toggleItemAvailability(category.id, item.id, item.is_available)}
                  >
                    {item.is_available ? 'Mark as Unavailable' : 'Mark as Available'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuManagement; 