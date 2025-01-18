import { Marker } from '@react-google-maps/api';
import { Club } from '@/types/club';

interface ClubMarkerProps {
  club: Club;
  isSelected: boolean;
  onClick: () => void;
}

export const ClubMarker = ({ club, isSelected, onClick }: ClubMarkerProps) => {
  return (
    <Marker
      position={club.position}
      onClick={onClick}
      icon={{
        url: isSelected ? '/selected-marker.png' : '/marker.png',
        scaledSize: new google.maps.Size(30, 30),
      }}
      title={club.name}
    />
  );
};