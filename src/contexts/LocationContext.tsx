import { createContext, useContext, useState, ReactNode } from 'react';

interface LocationContextType {
  mapCenter: google.maps.LatLngLiteral;
  setMapCenter: (center: google.maps.LatLngLiteral) => void;
  mapZoom: number;
  setMapZoom: (zoom: number) => void;
  userLocation: google.maps.LatLngLiteral | null;
  setUserLocation: (location: google.maps.LatLngLiteral | null) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [mapCenter, setMapCenter] = useState<google.maps.LatLngLiteral>({ lat: -33.8688, lng: 151.2093 });
  const [mapZoom, setMapZoom] = useState(13);
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);

  return (
    <LocationContext.Provider value={{
      mapCenter,
      setMapCenter,
      mapZoom,
      setMapZoom,
      userLocation,
      setUserLocation,
    }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocationContext() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocationContext must be used within a LocationProvider');
  }
  return context;
}