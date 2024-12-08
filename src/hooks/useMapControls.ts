import { useState } from 'react';
import { Club } from '@/types/club';

export const useMapControls = (isLoaded: boolean, userLocation: google.maps.LatLngLiteral) => {
  const [mapCenter, setMapCenter] = useState(userLocation);
  const [mapZoom, setMapZoom] = useState(13);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);

  const handleClubSelect = (club: Club) => {
    setSelectedClub(club);
    setMapCenter(club.position);
    setMapZoom(16);
  };

  return {
    mapCenter,
    setMapCenter,
    mapZoom,
    setMapZoom,
    selectedClub,
    setSelectedClub,
    directions,
    setDirections,
    handleClubSelect
  };
};