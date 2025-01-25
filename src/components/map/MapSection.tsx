import { FC } from 'react';
import { Club } from '@/types/club';
import { ClubMap } from './ClubMap';
import { ChatWindow } from '../chat/ChatWindow';
import { LocationModals } from '../location/LocationModals';
import { ClubDetailsPanel } from '../club/ClubDetailsPanel';
import { MapControls } from './MapControls';

interface MapSectionProps {
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
  isListCollapsed: boolean;
  showClubDetails?: boolean;
}

export const MapSection: FC<MapSectionProps> = ({
  isLoaded,
  clubs,
  selectedClub,
  selectedDay,
  setSelectedDay,
  mapCenter,
  mapZoom,
  userLocation,
  directions,
  onClubSelect,
  locationManagement,
  isListCollapsed,
  showClubDetails = true
}) => {
  return (
    <div className="h-full flex flex-col overflow-hidden relative z-0">
      <div className="absolute top-2 right-2 z-50 flex flex-col items-end space-y-2">
        <LocationModals {...locationManagement} />
        {selectedClub && showClubDetails && (
          <ClubDetailsPanel
            selectedClub={selectedClub}
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
          />
        )}
      </div>
      
      <div className="flex-grow h-full">
        <ClubMap
          isLoaded={isLoaded}
          clubs={clubs}
          selectedClub={selectedClub}
          mapCenter={mapCenter}
          mapZoom={mapZoom}
          userLocation={userLocation}
          directions={directions}
          onClubSelect={onClubSelect}
          calculatedBounds={null}
        />
        <MapControls
          showAllClubs={true}
          toggleShowAllClubs={() => {}}
          onZoomIn={() => {}}
          onZoomOut={() => {}}
        />
      </div>
    </div>
  );
};