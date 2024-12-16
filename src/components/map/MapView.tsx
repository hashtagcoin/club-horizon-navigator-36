import { useState } from 'react';
import { Club } from '@/types/club';
import { ClubMap } from './ClubMap';
import { LocationModals } from '../location/LocationModals';
import { ClubDetailsPanel } from '../club/ClubDetailsPanel';
import { Toggle } from "@/components/ui/toggle";
import { MapIcon } from "lucide-react";

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
  const [showAllClubs, setShowAllClubs] = useState(true);

  const visibleClubs = showAllClubs ? clubs : (selectedClub ? [selectedClub] : []);

  return (
    <div className="h-full flex flex-col overflow-hidden relative z-0">
      <div className="absolute top-2 right-2 z-50 flex flex-col items-end space-y-2">
        <LocationModals {...locationManagement} />
        <ClubDetailsPanel
          selectedClub={selectedClub}
          selectedDay={detailsSelectedDay}
          setSelectedDay={setDetailsSelectedDay}
        />
      </div>
      
      <div className="absolute bottom-4 left-4 z-50">
        <Toggle
          pressed={showAllClubs}
          onPressedChange={setShowAllClubs}
          aria-label="Toggle all clubs visibility"
          className="bg-white shadow-md hover:bg-gray-100 data-[state=on]:bg-primary"
        >
          <MapIcon className="h-4 w-4" />
        </Toggle>
      </div>
      
      <div className="flex-grow h-full relative">
        <ClubMap
          isLoaded={isLoaded}
          clubs={visibleClubs}
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