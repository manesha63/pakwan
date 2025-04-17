import React from 'react';
import '../styles/Menu.css';

const MenuItem = ({ item, onAddToCart }) => {
  const renderDietaryTag = (option) => {
    // Convert option to lowercase and remove spaces for className
    const baseClassName = option.toLowerCase().replace(/\s+/g, '-');
    let className = 'dietary-tag';

    // Add specific class based on the option
    if (baseClassName.includes('vegetarian')) {
      className += ' vegetarian';
    } else if (baseClassName === 'vegan') {
      className += ' vegan';
    } else if (baseClassName.includes('gluten-free')) {
      className += ' gluten-free';
    } else if (baseClassName.includes('can-be-made-vegan')) {
      className += ' can-be-made-vegan';
    }

    return (
      <span key={option} className={className}>
        {option}
      </span>
    );
  };

  return (
    <div className={`menu-item ${!item.available ? 'unavailable' : ''}`}>
      <div className="item-header">
        <h3>{item.name}</h3>
        <p className="description">{item.description}</p>
      </div>
      <div className="dietary-options">
        {item.dietaryOptions && item.dietaryOptions.map(option => renderDietaryTag(option))}
      </div>
      <div className="item-footer">
        <p className="price">{item.price.toFixed(2)}</p>
        <button 
          className="add-to-cart-btn"
          onClick={onAddToCart}
          disabled={!item.available}
        >
          {item.available ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
};

export default MenuItem; 