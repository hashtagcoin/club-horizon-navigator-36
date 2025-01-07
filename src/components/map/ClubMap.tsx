import { useRef, useState, useCallback } from 'react';
import { GoogleMap, Marker, DirectionsRenderer } from '@react-google-maps/api';
import { Club } from '@/types/club';
import { darkMapStyle as mapStyles } from './mapStyles';
import { cn } from '@/lib/utils';

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

export function ClubMap({
  isLoaded,
  clubs,
  selectedClub,
  mapCenter,
  mapZoom,
  userLocation,
  directions,
  onClubSelect,
  calculatedBounds
}: ClubMapProps) {
  const mapRef = useRef<google.maps.Map | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const mapOptions: google.maps.MapOptions = {
    disableDefaultUI: true,
    zoomControl: true,
    zoomControlOptions: {
      position: google.maps.ControlPosition.RIGHT_BOTTOM
    },
    mapTypeControl: false,
    scaleControl: false,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: false,
    styles: mapStyles
  };

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    setMap(map);
    if (calculatedBounds) {
      map.fitBounds(calculatedBounds);
    }
  }, [calculatedBounds]);

  const onUnmount = useCallback(() => {
    mapRef.current = null;
    setMap(null);
  }, []);

  if (!isLoaded) return null;

  return (
    <div className="w-full h-full">
      <GoogleMap
        mapContainerClassName={cn(
          "w-full h-full",
          "map-container"
        )}
        center={mapCenter}
        zoom={mapZoom}
        options={mapOptions}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {clubs.map((club) => (
          <Marker
            key={club.id}
            position={club.position}
            onClick={() => onClubSelect(club)}
            icon={{
              url: selectedClub?.id === club.id
                ? '/marker-selected.svg'
                : '/marker.svg',
              scaledSize: new google.maps.Size(40, 40)
            }}
          />
        ))}

        {userLocation && (
          <Marker
            position={userLocation}
            icon={{
              url: '/user-location.svg',
              scaledSize: new google.maps.Size(24, 24)
            }}
          />
        )}

        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              suppressMarkers: true,
              polylineOptions: {
                strokeColor: '#000000',
                strokeWeight: 4
              }
            }}
          />
        )}
      </GoogleMap>
    </div>
  );
}