import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';
import Story from '../components/Story';
import LocationSelector from '../components/LocationSelector';

function Home() {
  const navigate = useNavigate();

  const handleOrderNow = () => {
    navigate('/locations');
  };

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Pakwan Restaurant</h1>
        <h2>Authentic Indian & Pakistani Cuisine</h2>
        <button className="order-btn" onClick={handleOrderNow}>Order Pickup Now</button>
      </div>
      
      <LocationSelector />
      
      <Story />
    </div>
  );
}

export default Home; 