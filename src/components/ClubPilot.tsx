import { useState, useEffect, useRef, useCallback } from 'react'
import { useJsApiLoader } from '@react-google-maps/api';
import { useSpring, animated } from '@react-spring/web'
import { useDrag } from '@use-gesture/react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Zap, Moon, MessageCircle, Smile } from 'lucide-react'
import { ClubMap } from './map/ClubMap'
import { ChatWindow } from './chat/ChatWindow'
import { UserProfile } from './user-profile'
import { ChatMessages, ChatMessage } from '@/types/club'
import { locations } from '@/data/locations';
import { ClubCard } from './ClubCard';
import { LocationControls } from './LocationControls';
import { ClubFilters } from './ClubFilters'
import { useClubData } from '@/hooks/useClubData'

export default function Component() {
  const [selectedClub, setSelectedClub] = useState(null)
  const [sortBy, setSortBy] = useState("usersAtClub")
  const [filterGenre, setFilterGenre] = useState("All")
  const [chatOpen, setChatOpen] = useState(false)
  const [chatClub, setChatClub] = useState(null)
  const [chatMessage, setChatMessage] = useState("")
  const [chatMessages, setChatMessages] = useState<ChatMessages>({})
  const [newMessageCounts, setNewMessageCounts] = useState<Record<number, number>>({})
  const [searchQuery, setSearchQuery] = useState("")
  const [isGeneralChat, setIsGeneralChat] = useState(false)
  const [showUserProfile, setShowUserProfile] = useState(false)
  const chatScrollRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const [messageOpacities, setMessageOpacities] = useState<Record<string, number>>({})
  const [showHighTraffic, setShowHighTraffic] = useState(false)
  const [sortByOpenLate, setSortByOpenLate] = useState(false)
  const [showSpecials, setShowSpecials] = useState(false)
  const [currentCountry, setCurrentCountry] = useState("Australia")
  const [currentState, setCurrentState] = useState("New South Wales")
  const [currentSuburb, setCurrentSuburb] = useState("Sydney")
  const [selectedDay, setSelectedDay] = useState('Monday')
  const [showLocationModal, setShowLocationModal] = useState(false)
  const [mapCenter, setMapCenter] = useState({ lat: -33.8688, lng: 151.2093 }) // Sydney coordinates
  const [mapZoom, setMapZoom] = useState(14)
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null)
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyC6Z3hNhhdT0Fqy_AXYl07JBRczMiTg8_0"
  })

  const { data: clubs = [], isLoading: isLoadingClubs } = useClubData();

  const mapOptions = {
    disableDefaultUI: true,
    zoomControl: true,
    streetViewControl: false,
    mapTypeControl: false,
  }

  const calculateDistance = (point1: google.maps.LatLngLiteral, point2: google.maps.LatLngLiteral): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (point2.lat - point1.lat) * Math.PI / 180;
    const dLon = (point2.lng - point1.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const openChat = (club) => {
    setChatClub(club)
    setChatOpen(true)
    setIsGeneralChat(false)
    if (!chatMessages[club.id]) {
      setChatMessages(prev => ({ ...prev, [club.id]: [] }))
    }
    setNewMessageCounts(prev => ({ ...prev, [club.id]: 0 }))
  }

  const toggleGeneralChat = () => {
    setChatOpen(prev => !prev)
    setIsGeneralChat(true)
    setChatClub(null)
  }

  const sendMessage = () => {
    if (chatMessage.trim() !== "") {
      const newMessage: ChatMessage = { sender: "You", text: chatMessage, timestamp: Date.now(), clubId: chatClub?.id || 'general' }
      if (isGeneralChat) {
        setChatMessages(prev => ({
          ...prev,
          general: [...(prev.general || []), newMessage]
        }))
      } else {
        setChatMessages(prev => ({
          ...prev,
          [chatClub.id]: [...prev[chatClub.id], newMessage]
        }))
      }
      setChatMessage("")
      // Simulate a response
      setTimeout(() => {
        const responseMessage: ChatMessage = { 
          sender: isGeneralChat ? "Club Pilot" : chatClub.name, 
          text: isGeneralChat ? "Welcome to the general chat! How can we assist you today?" : "Thanks for your message! The vibe is great tonight!", 
          timestamp: Date.now(),
          clubId: chatClub?.id || 'general'
        }
        if (isGeneralChat) {
          setChatMessages(prev => ({
            ...prev,
            general: [...(prev.general || []), responseMessage]
          }))
        } else {
          setChatMessages(prev => ({
            ...prev,
            [chatClub.id]: [...prev[chatClub.id], responseMessage]
          }))
          setNewMessageCounts(prev => ({ ...prev, [chatClub.id]: (prev[chatClub.id] || 0) + 1 }))
        }
      }, 1000)
    }
  }

  const updateMessageOpacity = useCallback((entries) => {
    entries.forEach(entry => {
      const messageId = entry.target.dataset.messageId
      const intersectionRatio = entry.intersectionRatio
      setMessageOpacities(prev => ({
        ...prev,
        [messageId]: Math.max(0.1, Math.min(1, intersectionRatio * 2))
      }))
    })
  }, [])

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setChatOpen(false)
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [])

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }

    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    observerRef.current = new IntersectionObserver(updateMessageOpacity, {
      root: chatScrollRef.current?.parentElement,
      threshold: Array.from({ length: 100 }, (_, i) => i / 100),
    })

    const messageElements = chatScrollRef.current?.querySelectorAll('.chat-message')
    messageElements?.forEach(el => observerRef.current.observe(el))

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [chatMessages, updateMessageOpacity])

  const allMessages = isGeneralChat
    ? Object.values(chatMessages).flat().sort((a, b) => a.timestamp - b.timestamp)
    : chatMessages[chatClub?.id] || []

  useEffect(() => {
    const today = new Date().toLocaleString('en-us', {weekday: 'long'});
    setSelectedDay(today);
  }, []);

  // Add new state for controlling the width of panels
  const [{ width }, api] = useSpring(() => ({ width: '50%' }))
  
  // Setup drag gesture for resizing
  const bind = useDrag(({ movement: [mx], down }) => {
    if (down) {
      const newWidth = Math.max(20, Math.min(80, 50 - (mx / window.innerWidth) * 100))
      api.start({ width: `${newWidth}%` })
    }
  }, {
    bounds: { left: -200, right: 200 },
    rubberband: true
  })

  const genres = Array.from(new Set(clubs.map(club => club.genre))).sort();

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

      {showUserProfile ? (
        <UserProfile onClose={() => setShowUserProfile(false)} />
      ) : (
        <>
          {/* Main Content */}
          <div className="flex flex-1 overflow-hidden">
            {/* Club Cards */}
            <animated.div 
              {...bind()}
              style={{ width, touchAction: 'none' }}
              className="flex flex-col p-1 overflow-hidden"
            >
              <ClubFilters
                sortBy={sortBy}
                setSortBy={setSortBy}
                filterGenre={filterGenre}
                setFilterGenre={setFilterGenre}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                genres={genres}
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
                            setMapCenter(club.position);
                            setMapZoom(16);
                          }}
                          onOpenChat={openChat}
                          newMessageCount={newMessageCounts[club.id] || 0}
                        />
                      ))
                  )}
                </div>
              </ScrollArea>
            </animated.div>

            {/* Map and Chat Column */}
            <animated.div 
              style={{ width: width.to(w => `calc(100% - ${w})`) }}
              className="flex flex-col p-1 overflow-hidden relative"
            >
              <div className="absolute top-2 right-2 z-10 flex flex-col items-end space-y-2">
                <LocationControls
                  currentCountry={currentCountry}
                  currentState={currentState}
                  currentSuburb={currentSuburb}
                  onCountryChange={setCurrentCountry}
                  onStateChange={setCurrentState}
                  onSuburbChange={setCurrentSuburb}
                />
              </div>
              
              {/* Google Map */}
              <div className="bg-white rounded-lg shadow-lg p-2 mb-2 flex-grow">
                {isLoaded ? (
                  <ClubMap
                    isLoaded={isLoaded}
                    clubs={clubs}
                    mapCenter={mapCenter}
                    mapZoom={mapZoom}
                    mapOptions={mapOptions}
                    userLocation={userLocation}
                    directions={directions}
                    onClubSelect={(club) => {
                      setSelectedClub(club)
                      setMapCenter(club.position)
                      setMapZoom(16)
                    }}
                  />
                ) : (
                  <div>Loading map...</div>
                )}
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
            </animated.div>
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
        </>
      )}
    </div>
  )
}
