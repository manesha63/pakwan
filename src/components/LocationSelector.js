import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import '../styles/LocationSelector.css';

const LocationSelector = () => {
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [activeMarker, setActiveMarker] = useState(null);

  const locations = [
    {
      id: 1,
      name: "Pakwan San Francisco",
      address: "3180-82 16th Street, San Francisco, CA 94103",
      phone: "(415) 863-8900",
      position: { lat: 37.765175, lng: -122.424477 },
      hours: "11:00 AM - 11:00 PM"
    },
    {
      id: 2,
      name: "Pakwan Fremont",
      address: "41068 Fremont Blvd, Fremont, CA 94538",
      phone: "(510) 226-1000",
      position: { lat: 37.531862, lng: -121.985186 },
      hours: "11:00 AM - 10:00 PM"
    }
  ];

  const mapContainerStyle = {
    width: '100%',
    height: '400px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
  };

  const center = {
    lat: 37.648475,
    lng: -122.204826
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    localStorage.setItem('selectedLocation', JSON.stringify(location));
  };

  const handleOrderHere = () => {
    if (selectedLocation) {
      navigate('/menu');
    }
  };

  return (
    <div className="map-container">
      <h2 className="map-title">Our Locations</h2>
      <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={10}
        >
          {locations.map(location => (
            <Marker
              key={location.id}
              position={location.position}
              onClick={() => {
                setActiveMarker(location.id);
                handleLocationSelect(location);
              }}
            >
              {activeMarker === location.id && (
                <InfoWindow onCloseClick={() => setActiveMarker(null)}>
                  <div className="info-window">
                    <h4>{location.name}</h4>
                    <p>{location.address}</p>
                    <p>Phone: {location.phone}</p>
                    <p>Hours: {location.hours}</p>
                    <button 
                      className="order-here-btn"
                      onClick={handleOrderHere}
                    >
                      Order from this location
                    </button>
                  </div>
                </InfoWindow>
              )}
            </Marker>
          ))}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default LocationSelector; 