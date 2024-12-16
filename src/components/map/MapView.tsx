import { useState } from 'react';
import { Club } from '@/types/club';
import { ClubMap } from './ClubMap';
import { ClubDetailsPanel } from '../club/ClubDetailsPanel';

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
  selectedDay: listSelectedDay,  // renamed to clarify it's from the list
  setSelectedDay: setListSelectedDay,  // we won't use this anymore
  mapCenter,
  mapZoom,
  userLocation,
  directions,
  onClubSelect,
  locationManagement,
}: MapViewProps) {
  // Add local state for the details panel selected day
  const [detailsSelectedDay, setDetailsSelectedDay] = useState(listSelectedDay);

  return (
    <div className="h-full flex flex-col overflow-hidden relative z-0">
      <div className="absolute top-2 right-2 z-[999] flex flex-col items-end space-y-2">
        <LocationModals {...locationManagement} />
        <ClubDetailsPanel
          selectedClub={selectedClub}
          selectedDay={detailsSelectedDay}
          setSelectedDay={setDetailsSelectedDay}
        />
      </div>
      
      <div className="flex-grow h-full relative">
        <ClubMap
          isLoaded={isLoaded}
          clubs={clubs}
          mapCenter={mapCenter}
          mapZoom={mapZoom}
          userLocation={userLocation}
          directions={directions}
          onClubSelect={onClubSelect}
          calculatedBounds={null}
        />
      </div>
    </div>
  );
}