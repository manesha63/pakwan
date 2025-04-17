import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import MenuItem from '../components/MenuItem';
import '../styles/Menu.css';

const Menu = () => {
  const [menuCategories, setMenuCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [customization, setCustomization] = useState({
    quantity: 1,
    spiceLevel: 'medium',
    specialInstructions: '',
    isVegan: false
  });
  const { addItem } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const fetchMenu = async () => {
    try {
      console.log('Fetching menu data...');
      const db = getFirestore();
      const categoriesRef = collection(db, 'menu_categories');
      
      try {
        const categoriesSnapshot = await getDocs(categoriesRef);
        
        if (categoriesSnapshot.empty) {
          console.log('No menu categories found');
          setError('No menu items available. Please try again later.');
          return;
        }

        const categories = categoriesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        console.log(`Found ${categories.length} menu categories`);
        setMenuCategories(categories);
        setSelectedCategory(categories[0]?.id || null);
        setError(null);
      } catch (firestoreError) {
        console.error('Firestore error:', firestoreError);
        if (firestoreError.code === 'permission-denied') {
          console.error('Permission denied error. Please check Firestore rules.');
          setError('Unable to load menu. Please try again later.');
        } else {
          setError('Failed to load menu. Please try again later.');
        }
      }
    } catch (err) {
      console.error('Error in fetchMenu:', err);
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const sortCategories = (categories) => {
    const orderMap = {
      'APPETIZERS': 1,
      'BIRYANI': 2,
      'VEGETARIAN': 3,
      'CHICKEN SPECIALTIES': 4,
      'MEAT SPECIALTIES': 5,
      'TANDOORI (BBQ)': 6,
      'WRAPS': 7,
      'SIDES': 8,
      'NAAN (PER PIECE)': 9,
      'DESSERTS': 10,
      'DRINKS': 11
    };

    return [...categories].sort((a, b) => {
      const orderA = orderMap[a.name] || 100;
      const orderB = orderMap[b.name] || 100;
      return orderA - orderB;
    });
  };

  useEffect(() => {
    fetchMenu();
  }, []); // Menu should be public

  const canCustomizeSpiceLevel = (itemName, categoryName) => {
    const excludedCategories = [
      'NAAN (PER PIECE)',
      'APPETIZERS',
      'SIDES',
      'DRINKS'
    ];
    return !excludedCategories.includes(categoryName);
  };

  const isTikkaMasala = (itemName) => {
    return itemName.toLowerCase().includes('tikka masala');
  };

  const canBeVegan = (itemName) => {
    return itemName.toLowerCase() === 'vegetable biryani';
  };

  const isDefaultVegan = (itemName, categoryName) => {
    return categoryName === 'APPETIZERS';
  };

  const handleItemClick = (item) => {
    if (!currentUser) {
      navigate('/login', { state: { from: '/menu' } });
      return;
    }
    setSelectedItem(item);
    setCustomization({
      quantity: 1,
      spiceLevel: isTikkaMasala(item.name) ? 'mild' : 'medium',
      specialInstructions: '',
      isVegan: isDefaultVegan(item.name, currentCategory?.name)
    });
  };

  const handleAddToCart = () => {
    if (!selectedItem) return;
    
    const itemToAdd = {
      ...selectedItem,
      quantity: customization.quantity,
      spiceLevel: customization.spiceLevel,
      specialInstructions: customization.specialInstructions,
      isVegan: customization.isVegan
    };

    console.log(`Adding item to cart: ${itemToAdd.name}`);
    addItem(itemToAdd);
    setSelectedItem(null);
    setCustomization({
      quantity: 1,
      spiceLevel: 'medium',
      specialInstructions: '',
      isVegan: false
    });
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
    setCustomization({
      quantity: 1,
      spiceLevel: 'medium',
      specialInstructions: '',
      isVegan: false
    });
  };

  if (loading) {
    return (
      <div className="menu-loading">
        <div className="loading-spinner"></div>
        <p>Loading menu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="menu-error">
        <p>{error}</p>
        <button 
          className="retry-btn"
          onClick={fetchMenu}
        >
          Retry Loading Menu
        </button>
      </div>
    );
  }

  const currentCategory = menuCategories.find(cat => cat.id === selectedCategory);
  const menuItems = currentCategory?.items || [];

  return (
    <div className="menu-container">
      <div className="menu-header">
        <h1>Our Menu</h1>
      </div>

      <div className="category-tabs">
        {sortCategories(menuCategories).map(category => (
          <button
            key={category.id}
            className={`category-tab ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="menu-items">
        {menuItems.map(item => (
          <MenuItem
            key={item.id}
            item={{
              ...item,
              name: item.name,
              description: item.description,
              price: item.price,
              available: item.is_available,
              dietaryOptions: [
                ...(item.dietary_options || []),
                ...(isDefaultVegan(item.name, currentCategory?.name) ? ['Vegan'] : []),
                ...(canBeVegan(item.name) ? ['Can Be Made Vegan'] : [])
              ]
            }}
            onAddToCart={() => handleItemClick(item)}
          />
        ))}
      </div>

      {selectedItem && (
        <div className="customization-modal">
          <div className="modal-content">
            <h2>{selectedItem.name}</h2>
            <div className="customization-options">
              <div className="quantity-section">
                <label>Quantity:</label>
                <div className="quantity-controls">
                  <button 
                    onClick={() => setCustomization(prev => ({
                      ...prev, 
                      quantity: Math.max(1, prev.quantity - 1)
                    }))}
                  >
                    -
                  </button>
                  <span>{customization.quantity}</span>
                  <button 
                    onClick={() => setCustomization(prev => ({
                      ...prev, 
                      quantity: prev.quantity + 1
                    }))}
                  >
                    +
                  </button>
                </div>
              </div>

              {canCustomizeSpiceLevel(selectedItem.name, currentCategory?.name) && (
                <div className="spice-level-section">
                  <label>Spice Level:</label>
                  <select 
                    value={customization.spiceLevel}
                    onChange={(e) => setCustomization(prev => ({
                      ...prev,
                      spiceLevel: e.target.value
                    }))}
                  >
                    {isTikkaMasala(selectedItem.name) && (
                      <option value="mild">Mild</option>
                    )}
                    <option value="medium">Medium</option>
                    <option value="spicy">Spicy</option>
                    <option value="extra-spicy">Extra Spicy</option>
                  </select>
                </div>
              )}

              {canBeVegan(selectedItem.name) && (
                <div className="vegan-option-section">
                  <label className="vegan-checkbox-label">
                    <input
                      type="checkbox"
                      checked={customization.isVegan}
                      onChange={(e) => setCustomization(prev => ({
                        ...prev,
                        isVegan: e.target.checked
                      }))}
                    />
                    Make it Vegan
                  </label>
                  {customization.isVegan && (
                    <p className="vegan-note">
                      This item will be prepared following vegan guidelines.
                    </p>
                  )}
                </div>
              )}

              {!isDefaultVegan(selectedItem.name, currentCategory?.name) && (
                <div className="special-instructions-section">
                  <label>Special Instructions:</label>
                  <textarea
                    value={customization.specialInstructions}
                    onChange={(e) => setCustomization(prev => ({
                      ...prev,
                      specialInstructions: e.target.value
                    }))}
                    placeholder="Any special requests?"
                    maxLength={200}
                  />
                </div>
              )}
            </div>

            <div className="modal-actions">
              <button className="cancel-btn" onClick={handleCloseModal}>
                Cancel
              </button>
              <button className="add-to-cart-btn" onClick={handleAddToCart}>
                Add to Cart - ${(selectedItem.price * customization.quantity).toFixed(2)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;