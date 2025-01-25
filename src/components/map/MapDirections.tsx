import { DirectionsRenderer } from '@react-google-maps/api';

interface MapDirectionsProps {
  directionsResult: google.maps.DirectionsResult | null;
}

export const MapDirections = ({ directionsResult }: MapDirectionsProps) => {
  if (!directionsResult) return null;

  return (
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
  );
};