import { FC } from 'react';
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
  directions: google.maps.DirectionsResult | null;
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
  directions,
  onClubSelect,
  locationManagement,
  chatManager
}) => {
  return (
    <div className="h-full flex flex-col overflow-hidden relative z-0">
      <div className="absolute top-2 right-2 z-50 flex flex-col items-end space-y-2">
        <LocationModals {...locationManagement} />
        <ClubDetailsPanel
          selectedClub={selectedClub}
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
        />
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
      </div>

      {chatManager.chatOpen && (
        <ChatWindow
          isGeneralChat={chatManager.isGeneralChat}
          chatClub={chatManager.activeClubChat}
          chatMessage={chatManager.chatMessage}
          setChatMessage={chatManager.setChatMessage}
          allMessages={chatManager.allMessages}
          onClose={() => chatManager.setChatOpen(false)}
          onSend={chatManager.sendMessage}
          clubs={clubs}
          messageOpacities={{}}
          chatScrollRef={null}
        />
      )}

      {clubs.map((club) => 
        chatManager.clubChats[club.id] && (
          <ChatWindow
            key={club.id}
            isGeneralChat={false}
            chatClub={club}
            chatMessage={chatManager.chatMessage}
            setChatMessage={chatManager.setChatMessage}
            allMessages={chatManager.getClubMessages(club.id)}
            onClose={() => chatManager.closeChat(club)}
            onSend={() => chatManager.sendMessage(club.id)}
            clubs={clubs}
            messageOpacities={{}}
            chatScrollRef={null}
          />
        )
      )}
    </div>
  );
};