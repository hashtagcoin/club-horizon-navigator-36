import { useState, useEffect } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import { UserProfile } from './user-profile';
import { useLocationManagement } from '@/hooks/useLocationManagement';
import { useClubData } from '@/hooks/useClubData';
import { ChatManager } from './chat/ChatManager';
import { sortClubs } from '@/utils/sortClubs';
import { TopBar } from './layout/TopBar';
import { BottomBar } from './layout/BottomBar';
import { ClubList } from './club/ClubList';
import { MapColumn } from './map/MapColumn';

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
  const [userLocation, setUserLocation] = useState({ lat: -33.8688, lng: 151.2093 }); // Sydney coordinates
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
      <TopBar />
      
      <div className="flex flex-1 overflow-hidden">
        <ClubList
          clubs={filteredAndSortedClubs()}
          selectedClub={selectedClub}
          selectedDay={selectedDay}
          sortBy={sortBy}
          setSortBy={setSortBy}
          filterGenre={filterGenre}
          setFilterGenre={setFilterGenre}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSelectClub={(club) => {
            setSelectedClub(club);
            locationManagement.setMapCenter(club.position);
            locationManagement.setMapZoom(16);
          }}
          onOpenChat={chatManager.openChat}
          newMessageCounts={chatManager.newMessageCounts}
          isLoading={isLoadingClubs}
        />

        <MapColumn
          isLoaded={isLoaded}
          clubs={clubs}
          selectedClub={selectedClub}
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
          mapCenter={locationManagement.mapCenter}
          mapZoom={locationManagement.mapZoom}
          userLocation={userLocation}
          path={path}
          onClubSelect={(club) => {
            setSelectedClub(club);
            locationManagement.setMapCenter(club.position);
            locationManagement.setMapZoom(16);
          }}
          locationManagement={locationManagement}
          chatManager={chatManager}
        />
      </div>

      <BottomBar
        showHighTraffic={showHighTraffic}
        setShowHighTraffic={setShowHighTraffic}
        sortByOpenLate={sortByOpenLate}
        setSortByOpenLate={setSortByOpenLate}
        showSpecials={showSpecials}
        setShowSpecials={setShowSpecials}
        chatOpen={chatManager.chatOpen}
        isGeneralChat={chatManager.isGeneralChat}
        toggleGeneralChat={chatManager.toggleGeneralChat}
      />
    </div>
  );
}