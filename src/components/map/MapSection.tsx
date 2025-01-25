import { MapView } from './MapView';
import { MapControls } from './MapControls';
import { Club } from '@/types/club';

interface MapSectionProps {
  isListCollapsed: boolean;
  isLoaded: boolean;
  filteredClubs: Club[];
  selectedClub: Club | null;
  selectedDay: string;
  setSelectedDay: (day: string) => void;
  mapCenter: google.maps.LatLngLiteral;
  mapZoom: number;
  userLocation: google.maps.LatLngLiteral | null;
  directions: google.maps.DirectionsResult | null;
  onClubSelect: (club: Club) => void;
  locationManagement: any;
}

export function MapSection({
  isListCollapsed,
  isLoaded,
  filteredClubs,
  selectedClub,
  selectedDay,
  setSelectedDay,
  mapCenter,
  mapZoom,
  userLocation,
  directions,
  onClubSelect,
  locationManagement,
}: MapSectionProps) {
  return (
    <div className={`relative flex-grow transition-all duration-300 ${isListCollapsed ? 'ml-0' : 'ml-[400px]'}`}>
      <MapView
        isLoaded={isLoaded}
        clubs={filteredClubs}
        selectedClub={selectedClub}
        selectedDay={selectedDay}
        setSelectedDay={setSelectedDay}
        mapCenter={mapCenter}
        mapZoom={mapZoom}
        userLocation={userLocation}
        directions={directions}
        onClubSelect={onClubSelect}
        locationManagement={locationManagement}
      />
      <MapControls 
        onLocateUser={locationManagement.getUserLocation} 
        onShowGlobalLocationModal={() => locationManagement.setShowGlobalLocationModal(true)}
      />
    </div>
  );
}