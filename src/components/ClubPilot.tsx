import { useState } from 'react';
import { useJsApiLoader, Libraries } from '@react-google-maps/api';
import { UserProfile } from './user-profile';
import { useLocationManagement } from '@/hooks/useLocationManagement';
import { useClubData } from '@/hooks/useClubData';
import { useChatManager } from './chat/ChatManager';
import { TopBar } from './layout/TopBar';
import { BottomBar } from './layout/BottomBar';
import { ClubList } from './club/ClubList';
import { MapColumn } from './map/MapColumn';
import { useMapState } from '@/hooks/useMapState';
import { useClubFilters } from '@/hooks/useClubFilters';

const libraries: Libraries = ['places'];

export default function ClubPilot() {
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [userLocation, setUserLocation] = useState({ lat: -33.8688, lng: 151.2093 });

  const locationManagement = useLocationManagement();
  const { data: clubs = [], isLoading: isLoadingClubs } = useClubData();
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyC6Z3hNhhdT0Fqy_AXYl07JBRczMiTg8_0",
    libraries
  });

  const {
    selectedClub,
    setSelectedClub,
    directions
  } = useMapState(isLoaded, userLocation);

  const {
    sortBy,
    setSortBy,
    filterGenre,
    setFilterGenre,
    searchQuery,
    setSearchQuery,
    showHighTraffic,
    setShowHighTraffic,
    sortByOpenLate,
    setSortByOpenLate,
    showSpecials,
    setShowSpecials,
    selectedDay,
    setSelectedDay,
    filterAndSortClubs
  } = useClubFilters();

  const chatManager = useChatManager(selectedClub);

  if (showUserProfile) {
    return <UserProfile onClose={() => setShowUserProfile(false)} />;
  }

  const filteredClubs = filterAndSortClubs(clubs);

  return (
    <div className="flex flex-col h-screen bg-gray-100 text-sm">
      <TopBar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <ClubList
          clubs={filteredClubs}
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
          clubs={filteredClubs}
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