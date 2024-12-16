import { ClubMap } from './ClubMap';
import { LocationModals } from '../location/LocationModals';
import { ClubDetailsPanel } from '../club/ClubDetailsPanel';
import { Club } from '@/types/club';
import { useState, useEffect } from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { EyeOff } from "lucide-react";

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
  selectedDay,
  setSelectedDay,
  mapCenter,
  mapZoom,
  userLocation,
  directions,
  onClubSelect,
  locationManagement,
}: MapViewProps) {
  const [directionsResult, setDirectionsResult] = useState<google.maps.DirectionsResult | null>(null);
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);

  useEffect(() => {
    if (isLoaded && userLocation && selectedClub) {
      const directionsService = new google.maps.DirectionsService();

      directionsService.route(
        {
          origin: userLocation,
          destination: selectedClub.position,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            setDirectionsResult(result);
          } else {
            console.error(`Error fetching directions: ${status}`);
          }
        }
      );
    }
  }, [isLoaded, userLocation, selectedClub]);

  const displayedClubs = showSelectedOnly && selectedClub
    ? [selectedClub]
    : clubs;

  return (
    <div className="h-full flex flex-col overflow-hidden relative z-0">
      <div className="absolute top-2 right-2 z-[999] flex flex-col items-end space-y-2">
        <LocationModals {...locationManagement} />
        <ClubDetailsPanel
          selectedClub={selectedClub}
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
        />
      </div>
      
      <div className="flex-grow h-full relative">
        <ClubMap
          isLoaded={isLoaded}
          clubs={displayedClubs}
          mapCenter={mapCenter}
          mapZoom={mapZoom}
          userLocation={userLocation}
          directions={directionsResult}
          onClubSelect={onClubSelect}
        />
        <div className="absolute bottom-8 left-2 z-[999] bg-white/90 rounded-lg shadow-md flex items-center gap-1 p-1">
          <EyeOff className="h-3 w-3" />
          <Switch
            id="show-selected"
            checked={showSelectedOnly}
            onCheckedChange={setShowSelectedOnly}
            className="scale-75"
          />
        </div>
      </div>
    </div>
  );
}