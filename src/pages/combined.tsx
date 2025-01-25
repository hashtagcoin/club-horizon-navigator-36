import { useState, useEffect, useRef } from 'react';
import { useJsApiLoader, GoogleMap, Marker, DirectionsRenderer, Libraries } from '@react-google-maps/api';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useSpring, animated } from '@react-spring/web';
import { Search, User, MessageCircle } from 'lucide-react';

// Types
interface Club {
  id: number;
  name: string;
  address: string;
  position: {
    lat: number;
    lng: number;
  };
  traffic: 'Low' | 'Medium' | 'High';
  openingHours: {
    [key: string]: string;
  };
  genre: string;
  usersAtClub: number;
  hasSpecial: boolean;
}

// Constants
const libraries: Libraries = ['places', 'geometry'];
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const CombinedApp = () => {
  // State
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [selectedDay, setSelectedDay] = useState(DAYS[0]);
  const [mapCenter, setMapCenter] = useState({ lat: -33.8688, lng: 151.2093 });
  const [mapZoom, setMapZoom] = useState(13);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("closest");
  const [filterGenre, setFilterGenre] = useState<string[]>([]);
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [messages, setMessages] = useState<Array<{ sender: string; text: string }>>([]);
  const { toast } = useToast();

  // Google Maps
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyC6Z3hNhhdT0Fqy_AXYl07JBRczMiTg8_0",
    libraries
  });

  // Fetch clubs data
  const { data: clubs = [], isLoading } = useQuery({
    queryKey: ['clubs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Clublist_Australia')
        .select('*');
      
      if (error) throw error;
      
      return data.map((club: any) => ({
        id: club.id || Math.random(),
        name: club.name || 'Unknown Club',
        address: club.address || 'Address not available',
        position: {
          lat: club.latitude || -33.8688,
          lng: club.longitude || 151.2093
        },
        traffic: club.traffic || 'Low',
        openingHours: {
          Monday: `${club.monday_hours_open || 'Closed'} - ${club.monday_hours_close || 'Closed'}`,
          Tuesday: `${club.tuesday_hours_open || 'Closed'} - ${club.tuesday_hours_close || 'Closed'}`,
          Wednesday: `${club.wednesday_hours_open || 'Closed'} - ${club.wednesday_hours_close || 'Closed'}`,
          Thursday: `${club.thursday_hours_open || 'Closed'} - ${club.thursday_hours_close || 'Closed'}`,
          Friday: `${club.friday_hours_open || 'Closed'} - ${club.friday_hours_close || 'Closed'}`,
          Saturday: `${club.saturday_hours_open || 'Closed'} - ${club.saturday_hours_close || 'Closed'}`,
          Sunday: `${club.sunday_hours_open || 'Closed'} - ${club.sunday_hours_close || 'Closed'}`
        },
        genre: club.venue_type || 'Various',
        usersAtClub: Math.floor(Math.random() * 100),
        hasSpecial: Math.random() < 0.3
      }));
    }
  });

  // Filter and sort clubs
  const filteredClubs = clubs.filter(club => {
    if (filterGenre.length > 0 && !filterGenre.includes(club.genre)) return false;
    if (searchQuery && !club.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'alphabetical':
        return a.name.localeCompare(b.name);
      case 'traffic':
        const trafficOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
        return (trafficOrder[b.traffic] || 0) - (trafficOrder[a.traffic] || 0);
      default:
        return 0;
    }
  });

  // Chat functionality
  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      setMessages([...messages, { sender: 'You', text: chatMessage }]);
      setChatMessage('');
      
      // Simulate response
      setTimeout(() => {
        setMessages(prev => [...prev, {
          sender: 'Bot',
          text: `This is a simulated response about ${selectedClub?.name || 'the club'}`
        }]);
      }, 1000);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Top Bar */}
      <div className="bg-black text-white p-4 flex items-center justify-between">
        <div className="text-xl font-bold">CLUB PILOT</div>
        <div className="flex-1 max-w-md mx-4 relative">
          <Input
            type="text"
            placeholder="Search clubs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/10 border-white/20"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
        </div>
        <Button variant="ghost" size="icon">
          <User className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-1 flex">
        {/* Club List */}
        <div className="w-1/3 border-r overflow-auto">
          <div className="p-4 border-b">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="closest">Distance</SelectItem>
                <SelectItem value="alphabetical">Alphabetical</SelectItem>
                <SelectItem value="traffic">Traffic</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="divide-y">
            {filteredClubs.map(club => (
              <div
                key={club.id}
                className={`p-4 cursor-pointer hover:bg-gray-50 ${
                  selectedClub?.id === club.id ? 'bg-gray-100' : ''
                }`}
                onClick={() => {
                  setSelectedClub(club);
                  setMapCenter(club.position);
                  setMapZoom(16);
                }}
              >
                <h3 className="font-semibold">{club.name}</h3>
                <p className="text-sm text-gray-600">{club.address}</p>
                <p className="text-sm text-gray-500">
                  {club.openingHours[selectedDay]}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 relative">
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '100%' }}
              center={mapCenter}
              zoom={mapZoom}
              options={{
                disableDefaultUI: true,
                zoomControl: true,
                streetViewControl: false,
                mapTypeControl: false,
              }}
            >
              {filteredClubs.map((club) => (
                <Marker
                  key={club.id}
                  position={club.position}
                  onClick={() => {
                    setSelectedClub(club);
                    setMapCenter(club.position);
                    setMapZoom(16);
                  }}
                />
              ))}
            </GoogleMap>
          ) : (
            <div>Loading map...</div>
          )}
        </div>

        {/* Chat Panel */}
        {showChat && (
          <div className="w-80 border-l flex flex-col">
            <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
              <h3 className="font-semibold">Chat</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowChat(false)}>
                ×
              </Button>
            </div>
            <div className="flex-1 overflow-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`${
                  msg.sender === 'You' ? 'ml-auto bg-blue-500 text-white' : 'mr-auto bg-gray-200'
                } rounded-lg p-2 max-w-[80%]`}>
                  <p className="text-xs font-semibold">{msg.sender}</p>
                  <p>{msg.text}</p>
                </div>
              ))}
            </div>
            <div className="p-4 border-t">
              <Input
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type a message..."
              />
            </div>
          </div>
        )}
      </div>

      {/* Bottom Bar */}
      <div className="bg-black text-white p-4 flex justify-center space-x-4">
        <Button
          variant="ghost"
          className="text-white"
          onClick={() => setShowChat(!showChat)}
        >
          <MessageCircle className="h-5 w-5 mr-2" />
          Chat
        </Button>
      </div>
    </div>
  );
};

export default CombinedApp;