import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import '../styles/Navbar.css';

const Navbar = () => {
  const { currentUser, logout, userRole } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const cartItemCount = items ? items.reduce((total, item) => total + item.quantity, 0) : 0;

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
      <nav className={`navbar ${isOpen ? 'nav-open' : ''}`}>
        <div className="navbar-container">
          <button className="hamburger" onClick={toggleMenu}>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>

          <Link to="/" className="navbar-logo" onClick={closeMenu}>
            <span className="navbar-logo-text">Pakwan</span>
          </Link>

          <div className={`navbar-links ${isOpen ? 'show' : ''}`}>
            <Link to="/" className="navbar-link" onClick={closeMenu}>Home</Link>
            <Link to="/menu" className="navbar-link" onClick={closeMenu}>Menu</Link>
            <Link to="/locations" className="navbar-link" onClick={closeMenu}>Locations</Link>
            {currentUser ? (
              <>
                {userRole === 'locationAdmin' && (
                  <Link to="/restaurant" className="navbar-link" onClick={closeMenu}>
                    Restaurant Dashboard
                  </Link>
                )}
                {userRole === 'superAdmin' && (
                  <Link to="/admin" className="navbar-link" onClick={closeMenu}>
                    Admin Panel
                  </Link>
                )}
                <Link to="/account" className="navbar-link" onClick={closeMenu}>My Account</Link>
                <Link to="/cart" className="navbar-link" onClick={closeMenu}>
                  Cart {cartItemCount > 0 && <span className="cart-count">{cartItemCount}</span>}
                </Link>
                <button onClick={handleLogout} className="navbar-button">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="navbar-link" onClick={closeMenu}>Login</Link>
                <Link to="/signup" className="navbar-link" onClick={closeMenu}>Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </nav>
      {isOpen && <div className="overlay" onClick={closeMenu}></div>}
    </>
  );
};

export default Navbar;