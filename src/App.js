import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LocationProvider } from './context/LocationContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Locations from './pages/Locations';
import Account from './pages/Account';
import Cart from './pages/Cart';
import Login from './components/Login';
import Signup from './components/Signup';
import ForgotPassword from './components/ForgotPassword';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import AdminPanel from './components/AdminPanel';
import RestaurantAdmin from './pages/RestaurantAdmin';
import GuestCheckout from './components/GuestCheckout';
import './styles/Global.css';
import './styles/Navbar.css';
import './styles/Menu.css';
import './styles/Cart.css';
import './styles/Checkout.css';
import './styles/Locations.css';

// Protected Route component
function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
}

// Admin Route component
function AdminRoute({ children }) {
  const { currentUser, userRole } = useAuth();
  return currentUser && (userRole === 'locationAdmin' || userRole === 'superAdmin') 
    ? children 
    : <Navigate to="/login" />;
}

// Restaurant Admin Route component
function RestaurantAdminRoute({ children }) {
  const { currentUser, userRole } = useAuth();
  return currentUser && userRole === 'locationAdmin' 
    ? children 
    : <Navigate to="/login" />;
}

// Admin Layout component
function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
      {children}
    </div>
  );
}

// Regular Layout component
function RegularLayout({ children }) {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <LocationProvider>
            <Routes>
              {/* Admin Routes */}
              <Route path="/restaurant/*" element={
                <RestaurantAdminRoute>
                  <AdminLayout>
                    <RestaurantAdmin />
                  </AdminLayout>
                </RestaurantAdminRoute>
              } />
              <Route path="/admin/*" element={
                <AdminRoute>
                  <AdminLayout>
                    <AdminPanel />
                  </AdminLayout>
                </AdminRoute>
              } />

              {/* Regular Routes */}
              <Route path="/*" element={
                <RegularLayout>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/menu" element={<Menu />} />
                    <Route path="/locations" element={<Locations />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/account" element={
                      <ProtectedRoute>
                        <Account />
                      </ProtectedRoute>
                    } />
                    <Route path="/cart" element={
                      <ProtectedRoute>
                        <Cart />
                      </ProtectedRoute>
                    } />
                    <Route path="/checkout" element={
                      <ProtectedRoute>
                        <Checkout />
                      </ProtectedRoute>
                    } />
                    <Route path="/guest-checkout" element={<GuestCheckout />} />
                    <Route path="/order-confirmation" element={<OrderConfirmation />} />
                  </Routes>
                </RegularLayout>
              } />
            </Routes>
          </LocationProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
