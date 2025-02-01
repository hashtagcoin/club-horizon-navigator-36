import { Marker } from '@react-google-maps/api';
import { Club } from '@/types/club';

interface ClubMarkerProps {
  club: Club;
  isSelected: boolean;
  onClick: () => void;
}

export function ClubMarker({ club, isSelected, onClick }: ClubMarkerProps) {
  return (
    <Marker
      position={club.position}
      onClick={onClick}
      icon={isSelected ? {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: '#FFD700',
        fillOpacity: 1,
        strokeColor: '#000000',
        strokeWeight: 2,
      } : undefined}
    />
  );
}