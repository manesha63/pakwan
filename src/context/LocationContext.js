import React, { createContext, useContext, useState } from 'react';

const LocationContext = createContext();

export function useLocation() {
  return useContext(LocationContext);
}

export function LocationProvider({ children }) {
  const [selectedLocation, setSelectedLocation] = useState(() => {
    const saved = localStorage.getItem('selectedLocation');
    return saved ? JSON.parse(saved) : null;
  });

  const selectLocation = (location) => {
    setSelectedLocation(location);
    localStorage.setItem('selectedLocation', JSON.stringify(location));
  };

  const clearLocation = () => {
    setSelectedLocation(null);
    localStorage.removeItem('selectedLocation');
  };

  const value = {
    selectedLocation,
    selectLocation,
    clearLocation
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
} 