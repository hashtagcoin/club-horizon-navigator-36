import { Marker } from '@react-google-maps/api';

interface UserLocationMarkerProps {
  position: google.maps.LatLngLiteral;
}

export const UserLocationMarker = ({ position }: UserLocationMarkerProps) => {
  return (
    <Marker
      position={position}
      icon={{
        path: google.maps.SymbolPath.CIRCLE,
        scale: 7,
        fillColor: '#4F46E5',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 2,
      }}
    />
  );
};