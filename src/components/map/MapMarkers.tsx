import { Marker } from '@react-google-maps/api';
import { Club } from '@/types/club';

interface MapMarkersProps {
  clubs: Club[];
  selectedClub: Club | null;
  userLocation: google.maps.LatLngLiteral | null;
  mapCenter: google.maps.LatLngLiteral;
  onClubSelect: (club: Club) => void;
}

export const MapMarkers = ({
  clubs,
  selectedClub,
  userLocation,
  mapCenter,
  onClubSelect,
}: MapMarkersProps) => {
  return (
    <>
      {clubs?.map((club) => (
        <Marker
          key={club.id}
          position={club.position}
          onClick={() => onClubSelect(club)}
          icon={club.position.lat === mapCenter.lat && club.position.lng === mapCenter.lng ? {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: '#FFD700',
            fillOpacity: 1,
            strokeColor: '#000000',
            strokeWeight: 2,
          } : undefined}
        />
      ))}

      {userLocation && (
        <Marker
          position={userLocation}
          icon={{
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: '#4285F4',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
          }}
        />
      )}
    </>
  );
};