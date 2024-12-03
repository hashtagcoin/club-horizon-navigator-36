import { FC, useRef } from 'react';
import { Club } from '@/types/club';
import { ClubMap } from './ClubMap';
import { ChatWindow } from '../chat/ChatWindow';
import { LocationModals } from '../location/LocationModals';
import { ClubDetailsPanel } from '../club/ClubDetailsPanel';

interface MapColumnProps {
  isLoaded: boolean;
  clubs: Club[];
  selectedClub: Club | null;
  selectedDay: string;
  setSelectedDay: (day: string) => void;
  mapCenter: google.maps.LatLngLiteral;
  mapZoom: number;
  userLocation: google.maps.LatLngLiteral | null;
  path: google.maps.LatLngLiteral[];
  onClubSelect: (club: Club) => void;
  locationManagement: any;
  chatManager: any;
}

export const MapColumn: FC<MapColumnProps> = ({
  isLoaded,
  clubs,
  selectedClub,
  selectedDay,
  setSelectedDay,
  mapCenter,
  mapZoom,
  userLocation,
  path,
  onClubSelect,
  locationManagement,
  chatManager
}) => {
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const messageOpacities = useRef<{ [key: string]: number }>({});

  return (
    <div className="w-1/2 flex flex-col p-1 overflow-hidden relative">
      <div className="absolute top-2 right-2 z-10 flex flex-col items-end space-y-2">
        <LocationModals {...locationManagement} />
        <ClubDetailsPanel
          selectedClub={selectedClub}
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
        />
      </div>
      
      <div className="bg-white rounded-lg shadow-lg p-2 mb-2 flex-grow">
        <ClubMap
          isLoaded={isLoaded}
          clubs={clubs}
          mapCenter={mapCenter}
          mapZoom={mapZoom}
          userLocation={userLocation}
          path={path}
          onClubSelect={onClubSelect}
        />
      </div>

      {chatManager.chatOpen && (
        <ChatWindow
          isGeneralChat={chatManager.isGeneralChat}
          chatClub={chatManager.chatClub}
          chatMessage={chatManager.chatMessage}
          setChatMessage={chatManager.setChatMessage}
          allMessages={chatManager.allMessages}
          onClose={() => chatManager.setChatOpen(false)}
          onSend={chatManager.sendMessage}
          clubs={clubs}
          messageOpacities={messageOpacities.current}
          chatScrollRef={chatScrollRef}
        />
      )}
    </div>
  );
};