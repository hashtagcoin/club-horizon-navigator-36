import { useState } from 'react';
import { Club } from '@/types/club';
import { LocationModals } from '../location/LocationModals';
import { ClubDetailsPanel } from '../club/ClubDetailsPanel';
import { MapControls } from './MapControls';
import { MapContainer } from './MapContainer';

interface MapViewProps {
  isLoaded: boolean;
  clubs: Club[];
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

export function MapView({
  isLoaded,
  clubs,
  selectedClub,
  selectedDay: listSelectedDay,
  setSelectedDay: setListSelectedDay,
  mapCenter,
  mapZoom,
  userLocation,
  directions,
  onClubSelect,
  locationManagement,
}: MapViewProps) {
  const [detailsSelectedDay, setDetailsSelectedDay] = useState(listSelectedDay);
  const [showAllClubs, setShowAllClubs] = useState(false);

  const visibleClubs = showAllClubs ? clubs : (selectedClub ? [selectedClub] : []);

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col overflow-hidden relative z-0">
      <div className="absolute top-2 right-2 z-50 flex flex-col items-end space-y-2">
        <LocationModals {...locationManagement} />
        <ClubDetailsPanel
          selectedClub={selectedClub}
          selectedDay={detailsSelectedDay}
          setSelectedDay={setDetailsSelectedDay}
        />
      </div>
      
      <MapControls 
        showAllClubs={showAllClubs}
        setShowAllClubs={setShowAllClubs}
      />
      
      <div className="flex-grow h-full relative pb-14">
        <MapContainer
          isLoaded={isLoaded}
          clubs={visibleClubs}
          selectedClub={selectedClub}
          mapCenter={mapCenter}
          mapZoom={mapZoom}
          userLocation={userLocation}
          directions={directions}
          onClubSelect={onClubSelect}
        />
      </div>
    </div>
  );
}