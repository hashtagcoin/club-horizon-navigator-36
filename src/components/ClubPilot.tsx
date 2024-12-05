import { useState, useEffect } from 'react';
import { useJsApiLoader, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';
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
  const [userLocation, setUserLocation] = useState({ lat: -33.8688, lng: 151.2093 });
  const [directions, setDirections] = useState(null);

  const locationManagement = useLocationManagement();
  const { data: clubs = [], isLoading: isLoadingClubs } = useClubData();
  const chatManager = ChatManager({ selectedClub });

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyC6Z3hNhhdT0Fqy_AXYl07JBRczMiTg8_0",
    libraries: ["places", "directions"]
  });

  useEffect(() => {
    const today = new Date().toLocaleString('en-us', {weekday: 'long'});
    setSelectedDay(today);
  }, []);

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
            setDirections(result);
          } else {
            console.error(`error fetching directions ${result}`);
          }
        }
      );
    }
  }, [isLoaded, userLocation, selectedClub]);

  const filteredAndSortedClubs = () => {
    let filtered = clubs
      .filter(club => filterGenre === "All" || club.genre === filterGenre)
      .filter(club => club.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .filter(club => !showHighTraffic || club.traffic === "High")
      .filter(club => !showSpecials || club.hasSpecial);

    if (sortByOpenLate) {
      filtered = filtered.filter(club => {
        const hours = club.openingHours[selectedDay];
        if (!hours || hours === "Closed") return false;
        const closingTime = hours.split(" - ")[1];
        if (!closingTime) return false;
        const [hourStr] = closingTime.split(":");
        const hour = parseInt(hourStr);
        return hour < 6 || hour >= 22; // Consider "late" as closing after 10 PM or before 6 AM
      });
    }

    return sortClubs(filtered, sortBy);
  };

  if (showUserProfile) {
    return <UserProfile onClose={() => setShowUserProfile(false)} />;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100 text-sm">
      <TopBar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <ClubList
          clubs={filteredAndSortedClubs()}
          selectedClub={selectedClub}
          selectedDay={selectedDay}
          sortBy={sortBy}
          setSortBy={setSortBy}
          filterGenre={filterGenre}
          setFilterGenre={setFilterGenre}
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
          directions={directions}
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
