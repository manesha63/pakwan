import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from '../context/LocationContext';
import '../styles/Locations.css';
import { locations } from '../data/locations';

const Locations = () => {
  const navigate = useNavigate();
  const { selectLocation } = useLocation();
  const [nearestLocation, setNearestLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          // Set default nearest location if can't get user location
          setNearestLocation(locations[0]);
        }
      );
    } else {
      // Set default nearest location if geolocation not supported
      setNearestLocation(locations[0]);
    }
  }, []);

  useEffect(() => {
    if (userLocation) {
      // Calculate nearest location
      const nearest = locations.reduce((closest, location) => {
        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          location.coordinates.lat,
          location.coordinates.lng
        );
        return distance < closest.distance ? { location, distance } : closest;
      }, { location: locations[0], distance: Infinity });

      setNearestLocation(nearest.location);
    }
  }, [userLocation]);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const handleSelectLocation = (location) => {
    selectLocation(location);
    navigate('/menu');
  };

  return (
    <div className="locations-container">
      <div className="locations-header">
        <h1>Choose Your Location</h1>
      </div>

      {nearestLocation && (
        <div className="nearest-location">
          <h2>Nearest Location to You:</h2>
          <div className="location-name">{nearestLocation.name}</div>
          <div className="location-address">{nearestLocation.address}</div>
          <div className="location-phone">Phone: {nearestLocation.phone}</div>
          <button 
            className="select-location-button"
            onClick={() => handleSelectLocation(nearestLocation)}
          >
            Select This Location
          </button>
        </div>
      )}

      <div className="all-locations">
        <h2>All Locations</h2>
        <div className="locations-grid">
          {locations.map(location => (
            <div key={location.id} className="location-card">
              <h3>{location.name}</h3>
              <div className="location-address">{location.address}</div>
              <div className="location-phone">Phone: {location.phone}</div>
              
              <div className="hours-section">
                {location.hours.open ? (
                  <>
                    <h4>Hours:</h4>
                    <div className="hours-text">{location.hours.open.days}</div>
                    <div className="hours-text">{location.hours.open.time}</div>
                  </>
                ) : (
                  <>
                    <h4>Lunch:</h4>
                    <div className="hours-text">{location.hours.lunch.days}</div>
                    <div className="hours-text">{location.hours.lunch.time}</div>
                    
                    <h4>Dinner:</h4>
                    <div className="hours-text">Weekdays: {location.hours.dinner.weekdays}</div>
                    <div className="hours-text">Weekends: {location.hours.dinner.weekends}</div>
                    {location.hours.dinner.closed && (
                      <div className="hours-text">Closed: {location.hours.dinner.closed}</div>
                    )}
                  </>
                )}
              </div>
              
              <button 
                className="select-location-button"
                onClick={() => handleSelectLocation(location)}
              >
                Select This Location
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Locations; 