import { GoogleMap, DirectionsRenderer } from '@react-google-maps/api';
import { Club } from '@/types/club';
import { useState, useEffect } from 'react';
import { MapMarkers } from './MapMarkers';
import { darkMapStyle } from './mapStyles';

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

  const mapOptions = {
    disableDefaultUI: true,
    zoomControl: true,
    zoomControlOptions: {
      position: google.maps.ControlPosition.LEFT_BOTTOM
    },
    streetViewControl: false,
    mapTypeControl: false,
    styles: darkMapStyle,
  };

  return (
    <GoogleMap
      mapContainerStyle={{ width: '100%', height: '100%' }}
      center={mapCenter}
      zoom={mapZoom}
      options={mapOptions}
      onLoad={map => {
        if (calculatedBounds) {
          map.fitBounds(calculatedBounds);
        }
      }}
    >
      <MapMarkers
        clubs={clubs}
        selectedClub={selectedClub}
        mapCenter={mapCenter}
        userLocation={userLocation}
        onClubSelect={onClubSelect}
      />

      {directionsResult && (
        <DirectionsRenderer
          directions={directionsResult}
          options={{
            suppressMarkers: true,
            polylineOptions: {
              strokeColor: "#4285F4",
              strokeOpacity: 0.8,
              strokeWeight: 4,
            },
          }}
        />
      )}
    </GoogleMap>
  );
};