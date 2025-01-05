import { useState, useEffect } from 'react';
import { Club } from '@/types/club';
import { ClubMap } from './ClubMap';
import { LocationModals } from '../location/LocationModals';
import { ClubDetailsPanel } from '../club/ClubDetailsPanel';
import { Switch } from "@/components/ui/switch";
import { Eye, EyeOff } from "lucide-react";

interface MapViewProps {
  isLoaded: boolean;
  clubs: Club[];
  selectedClubs: Club[];
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
  selectedClubs,
  selectedDay,
  setSelectedDay,
  mapCenter,
  mapZoom,
  userLocation,
  directions,
  onClubSelect,
  locationManagement,
}: MapViewProps) {
  const [showAllClubs, setShowAllClubs] = useState(true);

  useEffect(() => {
    setShowAllClubs(true);
  }, [mapCenter]);

  const visibleClubs = showAllClubs ? clubs : selectedClubs;

  return (
    <div className="h-full flex flex-col overflow-hidden relative z-0">
      <div className="absolute top-2 right-2 z-50 flex flex-col items-end space-y-2">
        <LocationModals {...locationManagement} />
        {selectedClubs.map(club => (
          <ClubDetailsPanel
            key={club.id}
            selectedClub={club}
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
          />
        ))}
      </div>
      
      <div className="absolute bottom-4 left-4 z-50 flex items-center gap-2 bg-white/90 p-2 rounded-lg shadow-md">
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