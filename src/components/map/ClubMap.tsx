import { GoogleMap, Marker, Polyline } from '@react-google-maps/api';
import { Club } from '@/types/club';

interface ClubMapProps {
  isLoaded: boolean;
  clubs: Club[];
  mapCenter: google.maps.LatLngLiteral;
  mapZoom: number;
  userLocation: google.maps.LatLngLiteral | null;
  path: google.maps.LatLngLiteral[];
  onClubSelect: (club: Club) => void;
}

export const ClubMap = ({
  isLoaded,
  clubs,
  mapCenter,
  mapZoom,
  userLocation,
  path,
  onClubSelect
}: ClubMapProps) => {
  if (!isLoaded) return <div>Loading map...</div>;

  const mapOptions = {
    disableDefaultUI: true,
    zoomControl: true,
    streetViewControl: false,
    mapTypeControl: false,
  };

  return (
    <GoogleMap
      mapContainerStyle={{ width: '100%', height: '100%' }}
      center={mapCenter}
      zoom={mapZoom}
      options={mapOptions}
    >
      {clubs.map((club) => (
        <Marker
          key={club.id}
          position={club.position}
          onClick={() => onClubSelect(club)}
        />
      ))}
      {userLocation && (
        <Marker
          position={userLocation}
          icon={{
            path: google.maps.SymbolPath.CIRCLE,
            scale: 7,
            fillColor: "#4285F4",
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: "#FFFFFF",
          }}
        />
      )}
      {path.length > 0 && (
        <Polyline
          path={path}
          options={{
            strokeColor: "#4285F4",
            strokeOpacity: 1,
            strokeWeight: 3,
          }}
        />
      )}
    </GoogleMap>
  );
};