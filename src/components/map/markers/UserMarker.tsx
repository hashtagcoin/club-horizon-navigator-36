import { Marker } from '@react-google-maps/api';

interface UserMarkerProps {
  position: google.maps.LatLngLiteral;
}

export function UserMarker({ position }: UserMarkerProps) {
  return (
    <Marker
      position={position}
      icon={{
        path: google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: '#4285F4',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 2,
      }}
    />
  );
}