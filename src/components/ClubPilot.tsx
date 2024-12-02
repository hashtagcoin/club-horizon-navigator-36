import { useState, useEffect, useRef, useCallback } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, User, Zap, Moon, MessageCircle, Smile, X } from 'lucide-react';
import { ClubMap } from './map/ClubMap';
import { ChatWindow } from './chat/ChatWindow';
import { UserProfile } from './user-profile';
import { ClubCard } from './ClubCard';
import { ClubFilters } from './ClubFilters';
import { LocationModals } from './location/LocationModals';
import { ClubDetailsPanel } from './club/ClubDetailsPanel';
import { useLocationManagement } from '@/hooks/useLocationManagement';
import { useClubData } from '@/hooks/useClubData';

export default function ClubPilot() {
  const [selectedClub, setSelectedClub] = useState(null);
  const [sortBy, setSortBy] = useState("usersAtClub");
  const [filterGenre, setFilterGenre] = useState("All");
  const [chatOpen, setChatOpen] = useState(false);
  const [chatClub, setChatClub] = useState(null);
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState({});
  const [newMessageCounts, setNewMessageCounts] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [isGeneralChat, setIsGeneralChat] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const chatScrollRef = useRef(null);
  const observerRef = useRef(null);
  const [messageOpacities, setMessageOpacities] = useState({});
  const [showHighTraffic, setShowHighTraffic] = useState(false);
  const [sortByOpenLate, setSortByOpenLate] = useState(false);
  const [showSpecials, setShowSpecials] = useState(false);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [userLocation, setUserLocation] = useState(null);
  const [path, setPath] = useState([]);

  const locationManagement = useLocationManagement();
  const { data: clubs = [], isLoading: isLoadingClubs } = useClubData();

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyC6Z3hNhhdT0Fqy_AXYl07JBRczMiTg8_0"
  });

  const toggleGeneralChat = () => {
    setChatOpen(prev => !prev);
    setIsGeneralChat(true);
    setChatClub(null);
    if (!chatMessages.general) {
      setChatMessages(prev => ({ ...prev, general: [] }));
    }
  };

  const openChat = (club) => {
    setChatClub(club);
    setChatOpen(true);
    setIsGeneralChat(false);
    if (!chatMessages[club.id]) {
      setChatMessages(prev => ({ ...prev, [club.id]: [] }));
    }
    setNewMessageCounts(prev => ({ ...prev, [club.id]: 0 }));
  };

  const sendMessage = () => {
    if (chatMessage.trim() !== "") {
      const newMessage = { 
        sender: "You", 
        text: chatMessage, 
        timestamp: Date.now(), 
        clubId: chatClub?.id || 'general' 
      };
      
      if (isGeneralChat) {
        setChatMessages(prev => ({
          ...prev,
          general: [...(prev.general || []), newMessage]
        }));
      } else if (chatClub) {
        setChatMessages(prev => ({
          ...prev,
          [chatClub.id]: [...(prev[chatClub.id] || []), newMessage]
        }));
      }
      
      setChatMessage("");
      
      // Simulate a response
      setTimeout(() => {
        const responseMessage = { 
          sender: isGeneralChat ? "Club Pilot" : chatClub?.name, 
          text: isGeneralChat ? "Welcome to the general chat! How can we assist you today?" : "Thanks for your message! The vibe is great tonight!", 
          timestamp: Date.now(),
          clubId: chatClub?.id || 'general'
        };
        
        if (isGeneralChat) {
          setChatMessages(prev => ({
            ...prev,
            general: [...(prev.general || []), responseMessage]
          }));
        } else if (chatClub) {
          setChatMessages(prev => ({
            ...prev,
            [chatClub.id]: [...(prev[chatClub.id] || []), responseMessage]
          }));
          setNewMessageCounts(prev => ({ 
            ...prev, 
            [chatClub.id]: (prev[chatClub.id] || 0) + 1 
          }));
        }
      }, 1000);
    }
  };

  const allMessages = isGeneralChat
    ? (chatMessages.general || [])
    : (chatMessages[chatClub?.id || ''] || []);

  useEffect(() => {
    const today = new Date().toLocaleString('en-us', {weekday: 'long'});
    setSelectedDay(today);
  }, []);

  useEffect(() => {
    // Set a random club as the user's current location
    const randomClub = clubs[Math.floor(Math.random() * clubs.length)];
    setUserLocation(randomClub?.position);
  }, [clubs]);

  useEffect(() => {
    if (userLocation && selectedClub) {
      // Calculate path between user location and selected club
      const newPath = [
        userLocation,
        selectedClub.position
      ];
      setPath(newPath);
    }
  }, [userLocation, selectedClub]);

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
                clubs
                  .filter(club => filterGenre === "All" || club.genre === filterGenre)
                  .filter(club => club.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  .filter(club => !showHighTraffic || club.traffic === "High")
                  .map(club => (
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
                      onOpenChat={openChat}
                      newMessageCount={newMessageCounts[club.id] || 0}
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
          {chatOpen && (
            <ChatWindow
              isGeneralChat={isGeneralChat}
              chatClub={chatClub}
              chatMessage={chatMessage}
              setChatMessage={setChatMessage}
              allMessages={allMessages}
              messageOpacities={messageOpacities}
              chatScrollRef={chatScrollRef}
              onClose={() => setChatOpen(false)}
              onSend={sendMessage}
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
            variant={chatOpen && isGeneralChat ? "default" : "ghost"}
            className="flex flex-col items-center h-12 w-16"
            onClick={toggleGeneralChat}
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
