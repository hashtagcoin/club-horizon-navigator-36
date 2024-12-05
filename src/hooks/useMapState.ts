import { useState, useEffect } from 'react';
import { Club } from '@/types/club';

export function useMapState(isLoaded: boolean, userLocation: google.maps.LatLngLiteral) {
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);

  useEffect(() => {
    if (isLoaded && userLocation && selectedClub) {
      const directionsService = new google.maps.DirectionsService();

      directionsService.route(
        {
          origin: userLocation,
          destination: selectedClub.position,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            setDirections(result);
          } else {
            console.error(`error fetching directions ${result}`);
          }
        }
      );
    }
  }, [isLoaded, userLocation, selectedClub]);

  return {
    selectedClub,
    setSelectedClub,
    directions
  };
}