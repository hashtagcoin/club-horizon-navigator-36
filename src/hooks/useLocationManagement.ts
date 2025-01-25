import { useState } from 'react';

export const useLocationManagement = () => {
  const [currentCountry, setCurrentCountry] = useState("");
  const [currentState, setCurrentState] = useState("");
  const [currentSuburb, setCurrentSuburb] = useState("");
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showGlobalLocationModal, setShowGlobalLocationModal] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: -33.8688, lng: 151.2093 }); // Default to Sydney coordinates
  const [mapZoom, setMapZoom] = useState(14);

  return {
    currentCountry,
    setCurrentCountry,
    currentState,
    setCurrentState,
    currentSuburb,
    setCurrentSuburb,
    showLocationModal,
    setShowLocationModal,
    showGlobalLocationModal,
    setShowGlobalLocationModal,
    mapCenter,
    setMapCenter,
    mapZoom,
    setMapZoom
  };
};