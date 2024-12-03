import { useState, useEffect, useRef } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Search, User, Zap, Moon, MessageCircle, Smile } from 'lucide-react';
import { ClubMap } from './map/ClubMap';
import { ChatWindow } from './chat/ChatWindow';
import { UserProfile } from './user-profile';
import { ClubCard } from './ClubCard';
import { ClubFilters } from './ClubFilters';
import { LocationModals } from './location/LocationModals';
import { ClubDetailsPanel } from './club/ClubDetailsPanel';
import { useLocationManagement } from '@/hooks/useLocationManagement';
import { useClubData } from '@/hooks/useClubData';
import { ChatManager } from './chat/ChatManager';
import { sortClubs } from '@/utils/sortClubs';

export default function ClubPilot() {
  const [selectedClub, setSelectedClub] = useState(null);
  const [sortBy, setSortBy] = useState("usersAtClub");
  const [filterGenre, setFilterGenre] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showHighTraffic, setShowHighTraffic] = useState(false);
  const [sortByOpenLate, setSortByOpenLate] = useState(false);
  const [showSpecials, setShowSpecials] = useState(false);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [userLocation, setUserLocation] = useState(null);
  const [path, setPath] = useState([]);

  const locationManagement = useLocationManagement();
  const { data: clubs = [], isLoading: isLoadingClubs } = useClubData();
  const chatManager = ChatManager({ selectedClub });

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyC6Z3hNhhdT0Fqy_AXYl07JBRczMiTg8_0"
  });

  useEffect(() => {
    const today = new Date().toLocaleString('en-us', {weekday: 'long'});
    setSelectedDay(today);
  }, []);

  useEffect(() => {
    const randomClub = clubs[Math.floor(Math.random() * clubs.length)];
    setUserLocation(randomClub?.position);
  }, [clubs]);

  useEffect(() => {
    if (userLocation && selectedClub) {
      const newPath = [
        userLocation,
        selectedClub.position
      ];
      setPath(newPath);
    }
  }, [userLocation, selectedClub]);

  const filteredAndSortedClubs = () => {
    let filtered = clubs
      .filter(club => filterGenre === "All" || club.genre === filterGenre)
      .filter(club => club.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .filter(club => !showHighTraffic || club.traffic === "High")
      .filter(club => !showSpecials || club.hasSpecial);

    return sortClubs(filtered, sortBy);
  };

  if (showUserProfile) {
    return <UserProfile onClose={() => setShowUserProfile(false)} />;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100 text-sm">
      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground p-2 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <svg
            width="24"
            height="24"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-primary-foreground"
          >
            <rect x="6" y="8" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
            <path d="M6 14H26" stroke="currentColor" strokeWidth="2" />
            <circle cx="11" cy="19" r="2" fill="currentColor" />
            <circle cx="21" cy="19" r="2" fill="currentColor" />
          </svg>
          <span className="text-base font-bold">CLUB PILOT</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Club Cards */}
        <div className="w-1/2 flex flex-col p-1 overflow-hidden">
          <ClubFilters
            sortBy={sortBy}
            setSortBy={setSortBy}
            filterGenre={filterGenre}
            setFilterGenre={setFilterGenre}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            genres={Array.from(new Set(clubs.map(club => club.genre))).sort()}
          />
          <ScrollArea className="flex-grow">
            <div className="space-y-2 pr-2">
              {isLoadingClubs ? (
                <div>Loading clubs...</div>
              ) : (
                filteredAndSortedClubs().map(club => (
                  <ClubCard
                    key={club.id}
                    club={club}
                    selectedDay={selectedDay}
                    isSelected={selectedClub?.id === club.id}
                    onSelect={(club) => {
                      setSelectedClub(club);
                      locationManagement.setMapCenter(club.position);
                      locationManagement.setMapZoom(16);
                    }}
                    onOpenChat={chatManager.openChat}
                    newMessageCount={chatManager.newMessageCounts[club.id] || 0}
                  />
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Map and Chat Column */}
        <div className="w-1/2 flex flex-col p-1 overflow-hidden relative">
          <div className="absolute top-2 right-2 z-10 flex flex-col items-end space-y-2">
            <LocationModals {...locationManagement} />
            <ClubDetailsPanel
              selectedClub={selectedClub}
              selectedDay={selectedDay}
              setSelectedDay={setSelectedDay}
            />
          </div>
          
          {/* Google Map */}
          <div className="bg-white rounded-lg shadow-lg p-2 mb-2 flex-grow">
            <ClubMap
              isLoaded={isLoaded}
              clubs={clubs}
              mapCenter={locationManagement.mapCenter}
              mapZoom={locationManagement.mapZoom}
              userLocation={userLocation}
              path={path}
              onClubSelect={(club) => {
                setSelectedClub(club);
                locationManagement.setMapCenter(club.position);
                locationManagement.setMapZoom(16);
              }}
            />
          </div>

          {/* Chat Window */}
          {chatManager.chatOpen && (
            <ChatWindow
              isGeneralChat={chatManager.isGeneralChat}
              chatClub={chatManager.chatClub}
              chatMessage={chatManager.chatMessage}
              setChatMessage={chatManager.setChatMessage}
              allMessages={chatManager.allMessages}
              messageOpacities={chatManager.messageOpacities}
              chatScrollRef={chatManager.chatScrollRef}
              onClose={() => chatManager.setChatOpen(false)}
              onSend={chatManager.sendMessage}
              clubs={clubs}
            />
          )}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-primary text-primary-foreground p-2">
        <div className="flex justify-around">
          <Button
            variant={showHighTraffic ? "default" : "ghost"}
            className="flex flex-col items-center h-12 w-16"
            onClick={() => setShowHighTraffic(!showHighTraffic)}
          >
            <Zap className="h-5 w-5" />
            <span className="text-[0.6rem] mt-0.5">High Traffic</span>
          </Button>
          <Button
            variant={sortByOpenLate ? "default" : "ghost"}
            className="flex flex-col items-center h-12 w-16"
            onClick={() => setSortByOpenLate(!sortByOpenLate)}
          >
            <Moon className="h-5 w-5" />
            <span className="text-[0.6rem] mt-0.5">Open Late</span>
          </Button>
          <Button
            variant={chatManager.chatOpen && chatManager.isGeneralChat ? "default" : "ghost"}
            className="flex flex-col items-center h-12 w-16"
            onClick={chatManager.toggleGeneralChat}
          >
            <MessageCircle className="h-5 w-5" />
            <span className="text-[0.6rem] mt-0.5">Chat</span>
          </Button>
          <Button
            variant={showSpecials ? "default" : "ghost"}
            className="flex flex-col items-center h-12 w-16"
            onClick={() => setShowSpecials(!showSpecials)}
          >
            <Smile className="h-5 w-5" />
            <span className="text-[0.6rem] mt-0.5">Offers</span>
          </Button>
        </div>
      </div>
    </div>
  );
}