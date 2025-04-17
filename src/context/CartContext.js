import React, { createContext, useReducer, useContext } from 'react';

// Initial state for the cart
const initialState = {
  items: [],
  total: 0
};

// Action types
const ADD_ITEM = 'ADD_ITEM';
const REMOVE_ITEM = 'REMOVE_ITEM';
const UPDATE_QUANTITY = 'UPDATE_QUANTITY';
const UPDATE_SPECIAL_REQUEST = 'UPDATE_SPECIAL_REQUEST';
const CLEAR_CART = 'CLEAR_CART';

// Reducer function to handle cart actions
const cartReducer = (state, action) => {
  switch (action.type) {
    case ADD_ITEM:
      const existingItemIndex = state.items.findIndex(
        item => item.id === action.payload.id
      );

      if (existingItemIndex >= 0) {
        const updatedItems = state.items.map((item, index) => {
          if (index === existingItemIndex) {
            return { ...item, quantity: item.quantity + 1 };
          }
          return item;
        });

        return {
          ...state,
          items: updatedItems,
          total: state.total + action.payload.price
        };
      }

      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
        total: state.total + action.payload.price
      };

    case REMOVE_ITEM:
      const itemToRemove = state.items.find(item => item.id === action.payload);
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
        total: state.total - (itemToRemove.price * itemToRemove.quantity)
      };

    case UPDATE_QUANTITY:
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
        total: calculateTotal(state.items, action.payload)
      };

    case UPDATE_SPECIAL_REQUEST:
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, specialRequest: action.payload.request }
            : item
        )
      };

    case CLEAR_CART:
      return initialState;

    default:
      return state;
  }
};

function calculateTotal(items, updatedItem) {
  return items.reduce((total, item) => {
    if (item.id === updatedItem.id) {
      return total + (item.price * updatedItem.quantity);
    }
    return total + (item.price * item.quantity);
  }, 0);
}

// Create context
const CartContext = createContext();

// Provider component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Add item to cart
  const addItem = (item) => {
    dispatch({ type: ADD_ITEM, payload: item });
  };

  // Remove item from cart
  const removeItem = (itemId) => {
    dispatch({ type: REMOVE_ITEM, payload: itemId });
  };

  // Update item quantity
  const updateQuantity = (itemId, quantity) => {
    dispatch({ type: UPDATE_QUANTITY, payload: { id: itemId, quantity } });
  };

  // Update special request
  const updateSpecialRequest = (itemId, request) => {
    dispatch({ type: UPDATE_SPECIAL_REQUEST, payload: { id: itemId, request } });
  };

  // Clear entire cart
  const clearCart = () => {
    dispatch({ type: CLEAR_CART });
  };

  // Calculate total price
  const calculateTotal = () => {
    return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Calculate total items
  const getTotalItems = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    items: state.items,
    total: state.total,
    dispatch,
    addItem,
    removeItem,
    updateQuantity,
    updateSpecialRequest,
    clearCart,
    calculateTotal,
    getTotalItems,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 