import { useState, useEffect } from 'react';
import { locations } from '@/data/locations';

export const useLocationManagement = () => {
  const [currentCountry, setCurrentCountry] = useState("Australia");
  const [currentState, setCurrentState] = useState("New South Wales");
  const [currentSuburb, setCurrentSuburb] = useState("Sydney");
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showGlobalLocationModal, setShowGlobalLocationModal] = useState(false);
  const [mapCenter, setMapCenter] = useState(locations["Australia"]["New South Wales"]["Sydney"]);
  const [mapZoom, setMapZoom] = useState(14);

  useEffect(() => {
    if (locations[currentCountry] && locations[currentCountry][currentState] && locations[currentCountry][currentState][currentSuburb]) {
      setMapCenter(locations[currentCountry][currentState][currentSuburb]);
      setMapZoom(14);
    }
  }, [currentCountry, currentState, currentSuburb]);

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