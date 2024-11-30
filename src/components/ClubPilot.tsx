import { useState, useEffect, useRef, useCallback } from 'react'
import { useJsApiLoader } from '@react-google-maps/api';
import { useSpring, animated } from '@react-spring/web'
import { useDrag } from '@use-gesture/react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Clock, Music, Users, MessageCircle, Search, User, Zap, Moon, Smile, X, Globe, MapPin } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { ClubMap } from './map/ClubMap'
import { ChatWindow } from './chat/ChatWindow'
import { UserProfile } from './user-profile'
import { Club, ChatMessages, ChatMessage } from '@/types/club'

// Helper function to get random traffic
const getRandomTraffic = () => {
  const traffics = ["Low", "Medium", "High"] as const
  return traffics[Math.floor(Math.random() * traffics.length)]
}

// Helper function to determine if a club has a special offer
const hasSpecialOffer = () => Math.random() < 0.3 // 30% chance of having a special offer

// Mock data for clubs with randomized traffic and special offers
const clubs: Club[] = [
  { 
    id: 1, 
    name: "Neon Dreams", 
    address: "123 Electric Avenue, Neon District",
    traffic: getRandomTraffic(), 
    openingHours: {
      Monday: "10 PM - 4 AM",
      Tuesday: "10 PM - 4 AM",
      Wednesday: "10 PM - 4 AM",
      Thursday: "10 PM - 5 AM",
      Friday: "10 PM - 6 AM",
      Saturday: "10 PM - 6 AM",
      Sunday: "9 PM - 3 AM"
    },
    position: { lat: -8.6478, lng: 115.1385 }, usersAtClub: 87, hasSpecial: hasSpecialOffer(), genre: "Electronic" 
  },
  { 
    id: 2, 
    name: "Jazz Lounge", 
    address: "456 Smooth Street, Melody Quarter",
    traffic: getRandomTraffic(), 
    openingHours: {
      Monday: "8 PM - 2 AM",
      Tuesday: "8 PM - 2 AM",
      Wednesday: "8 PM - 2 AM",
      Thursday: "8 PM - 2 AM",
      Friday: "8 PM - 3 AM",
      Saturday: "8 PM - 3 AM",
      Sunday: "7 PM - 1 AM"
    },
    position: { lat: -8.6528, lng: 115.1361 }, usersAtClub: 45, hasSpecial: hasSpecialOffer(), genre: "Jazz" 
  },
  { 
    id: 3, 
    name: "Hip-Hop Haven", 
    address: "789 Beat Boulevard, Rhythm City",
    traffic: getRandomTraffic(), 
    openingHours: {
      Monday: "9 PM - 3 AM",
      Tuesday: "9 PM - 3 AM",
      Wednesday: "9 PM - 3 AM",
      Thursday: "9 PM - 4 AM",
      Friday: "9 PM - 5 AM",
      Saturday: "9 PM - 5 AM",
      Sunday: "8 PM - 2 AM"
    },
    position: { lat: -8.6558, lng: 115.1321 }, usersAtClub: 32, hasSpecial: hasSpecialOffer(), genre: "Hip-Hop" 
  },
  { 
    id: 4, 
    name: "Rock Revolution", 
    address: "321 Guitar Lane, Rockville",
    traffic: getRandomTraffic(), 
    openingHours: {
      Monday: "7 PM - 1 AM",
      Tuesday: "7 PM - 1 AM",
      Wednesday: "7 PM - 1 AM",
      Thursday: "7 PM - 2 AM",
      Friday: "7 PM - 3 AM",
      Saturday: "7 PM - 3 AM",
      Sunday: "6 PM - 12 AM"
    },
    position: { lat: -8.6498, lng: 115.1401 }, usersAtClub: 56, hasSpecial: hasSpecialOffer(), genre: "Rock" 
  },
  { 
    id: 5, 
    name: "Salsa Nights", 
    address: "555 Spicy Road, Latin Quarter",
    traffic: getRandomTraffic(), 
    openingHours: {
      Monday: "9 PM - 3 AM",
      Tuesday: "9 PM - 3 AM",
      Wednesday: "9 PM - 3 AM",
      Thursday: "9 PM - 4 AM",
      Friday: "9 PM - 5 AM",
      Saturday: "9 PM - 5 AM",
      Sunday: "8 PM - 2 AM"
    },
    position: { lat: -8.6518, lng: 115.1371 }, usersAtClub: 78, hasSpecial: hasSpecialOffer(), genre: "Salsa" 
  },
]

// Mock data for locations with coordinates
const locations = {
  "Indonesia": {
    "Bali": {
      "Kuta": { lat: -8.7180, lng: 115.1707 },
      "Seminyak": { lat: -8.6897, lng: 115.1628 },
      "Ubud": { lat: -8.5069, lng: 115.2625 },
      "Canggu": { lat: -8.6478, lng: 115.1385 },
      "Uluwatu": { lat: -8.8291, lng: 115.0849 },
    },
  },
}

export default function Component() {
  const [selectedClub, setSelectedClub] = useState<Club | null>(null)
  const [sortBy, setSortBy] = useState("usersAtClub")
  const [filterGenre, setFilterGenre] = useState("All")
  const [chatOpen, setChatOpen] = useState(false)
  const [chatClub, setChatClub] = useState<Club | null>(null)
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
  const [currentCountry, setCurrentCountry] = useState("Indonesia")
  const [currentState, setCurrentState] = useState("Bali")
  const [currentSuburb, setCurrentSuburb] = useState("Kuta")
  const [selectedDay, setSelectedDay] = useState('Monday')
  const [showLocationModal, setShowLocationModal] = useState(false)
  const [showGlobalLocationModal, setShowGlobalLocationModal] = useState(false)
  const [mapCenter, setMapCenter] = useState(locations["Indonesia"]["Bali"]["Kuta"])
  const [mapZoom, setMapZoom] = useState(14)
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null)
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyC6Z3hNhhdT0Fqy_AXYl07JBRczMiTg8_0"
  })

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
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const sortedAndFilteredClubs = clubs
    .filter(club => filterGenre === "All" || club.genre === filterGenre)
    .filter(club => club.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(club => !showHighTraffic || club.traffic === "High")
    .sort((a, b) => {
      if (sortByOpenLate) {
        return b.openingHours[selectedDay].split(' - ')[1].localeCompare(a.openingHours[selectedDay].split(' - ')[1])
      }
      switch (sortBy) {
        case "usersAtClub":
          return b.usersAtClub - a.usersAtClub
        case "traffic":
          const trafficOrder = { "High": 3, "Medium": 2, "Low": 1 }
          return trafficOrder[b.traffic] - trafficOrder[a.traffic]
        case "alphabetical":
          return a.name.localeCompare(b.name)
        case "genre":
          return a.genre.localeCompare(b.genre)
        case "openingHours":
          return a.openingHours[selectedDay].localeCompare(b.openingHours[selectedDay])
        default:
          return 0
      }
    })

  const openChat = (club: Club) => {
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

  useEffect(() => {
    if (locations[currentCountry] && locations[currentCountry][currentState] && locations[currentCountry][currentState][currentSuburb]) {
      setMapCenter(locations[currentCountry][currentState][currentSuburb])
      setMapZoom(14)
    }
  }, [currentCountry, currentState, currentSuburb])

  useEffect(() => {
    // Set a random club as the user's current location
    const randomClub = clubs[Math.floor(Math.random() * clubs.length)]
    setUserLocation(randomClub.position)
  }, [])

  useEffect(() => {
    if (userLocation && selectedClub) {
      // Calculate path between user location and selected club
      const directionsService = new google.maps.DirectionsService();
      
      directionsService.route(
        {
          origin: userLocation,
          destination: selectedClub.position,
          travelMode: google.maps.TravelMode.WALKING
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            setDirections(result);
          } else {
            console.error(`error fetching directions ${result}`);
            setDirections(null);
          }
        }
      );
    } else {
      setDirections(null);
    }
  }, [userLocation, selectedClub, isLoaded]);

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
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search clubs..."
              className="pl-7 w-48 h-7 text-xs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setShowUserProfile(true)}>
            <User className="h-4 w-4" />
            <span className="sr-only">User profile</span>
          </Button>
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
              <div className="mb-2 flex justify-between">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px] h-7 text-xs">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usersAtClub">Sort by Users at Club</SelectItem>
                    <SelectItem value="traffic">Sort by Traffic</SelectItem>
                    <SelectItem value="alphabetical">Sort Alphabetically</SelectItem>
                    <SelectItem value="genre">Sort by Genre</SelectItem>
                    <SelectItem value="openingHours">Sort by Opening Hours</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterGenre} onValueChange={setFilterGenre}>
                  <SelectTrigger className="w-[180px] h-7 text-xs">
                    <SelectValue placeholder="Filter by Genre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Genres</SelectItem>
                    {Array.from(new Set(clubs.map(club => club.genre))).sort().map(genre => (
                      <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <ScrollArea className="flex-grow">
                <div className="space-y-2 pr-2">
                  {sortedAndFilteredClubs.map(club => (
                    <Card
                      key={club.id}
                      className={`cursor-pointer relative ${selectedClub?.id === club.id ? 'border-primary' : ''}`}
                      onClick={() => {
                        setSelectedClub(club)
                        setMapCenter(club.position)
                        setMapZoom(16)
                      }}
                    >
                      <CardHeader className="flex justify-between items-start p-2">
                        <CardTitle className="text-left text-base">{club.name}</CardTitle>
                        <div className="flex flex-col items-end space-y-1">
                          <div className="flex items-center space-x-0.5" aria-label={`${club.traffic} Traffic`}>
                            <User className={`h-4 w-4 ${club.traffic === 'High' || club.traffic === 'Medium' || club.traffic === 'Low' ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
                            <User className={`h-4 w-4 ${club.traffic === 'High' || club.traffic === 'Medium' ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
                            <User className={`h-4 w-4 ${club.traffic === 'High' ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
                          </div>
                          {userLocation && (
                            <span className="text-xs font-medium">
                              {calculateDistance(userLocation, club.position).toFixed(1)}km
                            </span>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0 px-2 pb-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1">
                            <Music className="h-3 w-3" />
                            <span className="text-xs">{club.genre}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1 mt-1">
                          <Clock className="h-3 w-3" />
                          <span className="text-xs">{club.openingHours[selectedDay]}</span>
                          {club.hasSpecial && (
                            <Smile className="h-4 w-4 text-yellow-500 ml-1" />
                          )}
                        </div>
                        <div className="absolute bottom-1 right-2 flex items-center space-x-1">
                          <span className="text-xs font-medium text-foreground">{club.usersAtClub}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            className="relative h-6 w-6 p-0"
                            onClick={(e) => { e.stopPropagation(); openChat(club); }}
                          >
                            <MessageCircle className="h-3 w-3" />
                            {newMessageCounts[club.id] > 0 && (
                              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[0.6rem] rounded-full w-3 h-3 flex items-center justify-center">
                                {newMessageCounts[club.id]}
                              </span>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </animated.div>

            {/* Map and Chat Column */}
            <animated.div 
              style={{ width: width.to(w => `calc(100% - ${w})`) }}
              className="flex flex-col p-1 overflow-hidden relative"
            >
              <div className="absolute top-2 right-2 z-10 flex flex-col items-end space-y-2">
                <Dialog open={showLocationModal} onOpenChange={setShowLocationModal}>
                  <DialogTrigger asChild>
                    <h2 className="text-2xl font-bold text-primary cursor-pointer bg-white rounded-lg px-3 py-1 shadow-sm inline-block">
                      {currentSuburb}
                    </h2>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Select Suburb</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <Select value={currentSuburb} onValueChange={setCurrentSuburb}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select suburb" />
                        </SelectTrigger>
                        <SelectContent>
                          {locations[currentCountry] && locations[currentCountry][currentState] && 
                            Object.keys(locations[currentCountry][currentState]).map((suburb) => (
                              <SelectItem key={suburb} value={suburb}>{suburb}</SelectItem>
                            ))
                          }
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-between items-center">
                      <Button onClick={() => setShowLocationModal(false)}>Close</Button>
                      <Button onClick={() => setShowGlobalLocationModal(true)} variant="outline">
                        <Globe className="h-4 w-4 mr-2" />
                        Change Location
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                {selectedClub && (
                  <div className="mt-2 bg-white p-2 rounded-lg shadow-md w-full">
                    <div className="flex items-center justify-between w-full">
                      <h3 className="text-base font-semibold text-black">{selectedClub.name}</h3>
                      <div className="flex items-center space-x-0.5" aria-label={`${selectedClub.traffic} Traffic`}>
                        <User className={`h-4 w-4 ${selectedClub.traffic === 'High' || selectedClub.traffic === 'Medium' || selectedClub.traffic === 'Low' ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
                        <User className={`h-4 w-4 ${selectedClub.traffic === 'High' || selectedClub.traffic === 'Medium' ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
                        <User className={`h-4 w-4 ${selectedClub.traffic === 'High' ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 mt-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{selectedClub.address}</span>
                    </div>
                    <div className="flex space-x-0.5 mt-1 w-full">
                      {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
                        <Button
                          key={day}
                          variant={selectedDay === ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][index] ? "default" : "outline"}
                          size="sm"
                          className="h-6 text-xs px-1.5"
                          onClick={() => setSelectedDay(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][index])}
                        >
                          {day}
                        </Button>
                      ))}
                    </div>
                    <p className="mt-1 text-xs font-medium w-full text-left">
                      Open: {selectedClub.openingHours[selectedDay]}
                    </p>
                  </div>
                )}
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

          {/* Specials Screen */}
          {showSpecials && (
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
              <div className="fixed inset-x-2 top-4 bottom-2 bg-background rounded-lg shadow-lg overflow-auto">
                <div className="sticky top-0 bg-background p-2 flex justify-between items-center border-b">
                  <h2 className="text-lg font-bold">Special Offers</h2>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setShowSpecials(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <div className="p-2">
                  <p className="text-xs text-muted-foreground mb-2">Here are the latest special offers from our partner clubs:</p>
                  {clubs.filter(club => club.hasSpecial).map(club => (
                    <div key={club.id} className="flex items-center mb-2">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={`${club.name} Avatar`} />
                        <AvatarFallback>{club.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-sm font-medium">{club.name}</h3>
                        <p className="text-xs text-muted-foreground">{club.genre} - {club.openingHours[selectedDay]}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Global Location Modal */}
          <Dialog open={showGlobalLocationModal} onOpenChange={setShowGlobalLocationModal}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Change Location</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Select value={currentCountry} onValueChange={setCurrentCountry}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(locations).map((country) => (
                      <SelectItem key={country} value={country}>{country}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={currentState} onValueChange={setCurrentState}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations[currentCountry] && Object.keys(locations[currentCountry]).map((state) => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={currentSuburb} onValueChange={setCurrentSuburb}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select suburb" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations[currentCountry] && locations[currentCountry][currentState] && 
                      Object.keys(locations[currentCountry][currentState]).map((suburb) => (
                        <SelectItem key={suburb} value={suburb}>{suburb}</SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={() => setShowGlobalLocationModal(false)}>Close</Button>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  )
}
