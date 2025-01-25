import { useState } from 'react';
import { Club } from '@/types/club';
import { ClubMap } from './ClubMap';
import { LocationModals } from '../location/LocationModals';
import { ClubDetailsPanel } from '../club/ClubDetailsPanel';
import { Switch } from "@/components/ui/switch";
import { Eye, EyeOff } from "lucide-react";
import { useIsMobile } from '@/hooks/use-mobile';

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
  showClubDetails: boolean;
}

export function MapView({
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
  showClubDetails,
}: MapViewProps) {
  const [showAllClubs, setShowAllClubs] = useState(false);
  const isMobile = useIsMobile();

  const visibleClubs = showAllClubs ? clubs : (selectedClub ? [selectedClub] : []);

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col overflow-hidden relative z-0">
      <div className="absolute top-2 right-2 z-50 flex flex-col items-end space-y-2">
        <LocationModals {...locationManagement} />
        {showClubDetails && selectedClub && (
          <ClubDetailsPanel
            selectedClub={selectedClub}
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
          />
        )}
      </div>
      
      <div className={`absolute z-50 flex items-center gap-2 bg-white/90 p-2 rounded-lg shadow-md ${
        isMobile ? 'bottom-[200px] right-4' : 'bottom-[140px] left-4'
      }`}>
        {showAllClubs ? (
          <Eye className="h-4 w-4 text-primary" />
        ) : (
          <EyeOff className="h-4 w-4 text-muted-foreground" />
        )}
        <Switch
          checked={showAllClubs}
          onCheckedChange={setShowAllClubs}
          aria-label="Toggle all clubs visibility"
        />
      </div>
      
      <div className="flex-grow h-full relative pb-14">
        <ClubMap
          isLoaded={isLoaded}
          clubs={visibleClubs}
          selectedClub={selectedClub}
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