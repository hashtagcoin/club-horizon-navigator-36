import { GoogleMap } from '@react-google-maps/api';
import { Club } from '@/types/club';
import { useState, useEffect } from 'react';
import { mapOptions } from './MapStyles';
import { MapMarkers } from './MapMarkers';
import { MapDirections } from './MapDirections';

interface ClubMapProps {
  isLoaded: boolean;
  clubs: Club[];
  selectedClub: Club | null;
  mapCenter: google.maps.LatLngLiteral;
  mapZoom: number;
  userLocation: google.maps.LatLngLiteral | null;
  directions: google.maps.DirectionsResult | null;
  onClubSelect: (club: Club) => void;
  calculatedBounds: google.maps.LatLngBounds | null;
}

export const ClubMap = ({
  isLoaded,
  clubs = [],
  selectedClub,
  mapCenter,
  mapZoom,
  userLocation,
  directions,
  onClubSelect,
  calculatedBounds
}: ClubMapProps) => {
  const [directionsResult, setDirectionsResult] = useState<google.maps.DirectionsResult | null>(null);
  const [bounds, setBounds] = useState<google.maps.LatLngBounds | null>(null);

  useEffect(() => {
    if (isLoaded && (clubs.length > 0 || userLocation)) {
      const newBounds = new google.maps.LatLngBounds();
      
      clubs.forEach(club => {
        newBounds.extend(club.position);
      });
      
      if (userLocation) {
        newBounds.extend(userLocation);
      }
      
      const latPadding = (newBounds.getNorthEast().lat() - newBounds.getSouthWest().lat()) * 0.1;
      const lngPadding = (newBounds.getNorthEast().lng() - newBounds.getSouthWest().lng()) * 0.1;
      
      newBounds.extend(new google.maps.LatLng(
        newBounds.getNorthEast().lat() + latPadding,
        newBounds.getNorthEast().lng() + lngPadding
      ));
      newBounds.extend(new google.maps.LatLng(
        newBounds.getSouthWest().lat() - latPadding,
        newBounds.getSouthWest().lng() - lngPadding
      ));
      
      setBounds(newBounds);
    }
  }, [isLoaded, clubs, userLocation]);

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
            setDirectionsResult(result);
          } else {
            console.error(`Error fetching directions: ${status}`);
          }
        }
      );
    }
  }, [isLoaded, userLocation, selectedClub]);

  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <GoogleMap
      mapContainerStyle={{ width: '100%', height: '100%', touchAction: 'none' }}
      center={mapCenter}
      zoom={mapZoom}
      options={mapOptions}
      onLoad={map => {
        if (bounds) {
          map.fitBounds(bounds);
        }
      }}
    >
      <MapMarkers
        clubs={clubs}
        selectedClub={selectedClub}
        userLocation={userLocation}
        mapCenter={mapCenter}
        onClubSelect={onClubSelect}
      />
      <MapDirections directionsResult={directionsResult} />
    </GoogleMap>
  );
};