import { useEffect, useState } from 'react';
import { GoogleMap } from '@react-google-maps/api';
import { Club } from '@/types/club';
import { ClubMarker } from './ClubMarker';
import { UserLocationMarker } from './UserLocationMarker';
import { DirectionsRenderer } from '@react-google-maps/api';

interface MapContainerProps {
  isLoaded: boolean;
  clubs: Club[];
  selectedClub: Club | null;
  mapCenter: google.maps.LatLngLiteral;
  mapZoom: number;
  userLocation: google.maps.LatLngLiteral | null;
  directions: google.maps.DirectionsResult | null;
  onClubSelect: (club: Club) => void;
}

export const MapContainer = ({
  isLoaded,
  clubs,
  selectedClub,
  mapCenter,
  mapZoom,
  userLocation,
  directions,
  onClubSelect,
}: MapContainerProps) => {
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
      
      const padding = { top: 100, right: 50, bottom: 50, left: 400 };
      const ne = newBounds.getNorthEast();
      const sw = newBounds.getSouthWest();
      
      const latPadding = (ne.lat() - sw.lat()) * 0.1;
      const lngPadding = (ne.lng() - sw.lng()) * 0.1;
      
      newBounds.extend(new google.maps.LatLng(
        ne.lat() + latPadding,
        ne.lng() + lngPadding
      ));
      newBounds.extend(new google.maps.LatLng(
        sw.lat() - latPadding,
        sw.lng() - lngPadding
      ));
      
      setBounds(newBounds);
    }
  }, [isLoaded, clubs, userLocation]);

  const mapOptions = {
    disableDefaultUI: true,
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: false,
    styles: [
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }],
      },
    ],
  };

  return (
    <GoogleMap
      mapContainerStyle={{ width: '100%', height: '100%' }}
      center={mapCenter}
      zoom={mapZoom}
      options={mapOptions}
      onLoad={map => {
        if (bounds) {
          map.fitBounds(bounds);
        }
      }}
    >
      {userLocation && <UserLocationMarker position={userLocation} />}
      
      {clubs.map((club) => (
        <ClubMarker
          key={club.id}
          club={club}
          isSelected={selectedClub?.id === club.id}
          onClick={() => onClubSelect(club)}
        />
      ))}

      {directions && (
        <DirectionsRenderer
          directions={directions}
          options={{
            suppressMarkers: true,
            polylineOptions: {
              strokeColor: '#4F46E5',
              strokeWeight: 4,
            },
          }}
        />
      )}
    </GoogleMap>
  );
};