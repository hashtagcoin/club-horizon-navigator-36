import { useState } from 'react';
import { useJsApiLoader, Libraries } from '@react-google-maps/api';
import { UserProfile } from './user-profile';
import { useLocationManagement } from '@/hooks/useLocationManagement';
import { useClubData } from '@/hooks/useClubData';
import { useChatManager } from './chat/ChatManager';
import { useMapControls } from '@/hooks/useMapControls';
import { useClubFilters } from '@/hooks/useClubFilters';
import { MainLayout } from './layout/MainLayout';
import { MapSection } from './map/MapSection';
import { ClubListContainer } from './club/ClubListContainer';
import { ChatContainer } from './chat/ChatContainer';
import { useClubSelectionManager } from './club/ClubSelectionManager';

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

  const mapControls = useMapControls(isLoaded, userLocation);
  const chatManager = useChatManager(mapControls.selectedClub);
  
  const clubSelection = useClubSelectionManager({
    onClubSelect: mapControls.handleClubSelect,
    locationManagement
  });

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

  if (showUserProfile) {
    return <UserProfile onClose={() => setShowUserProfile(false)} />;
  }

  const filteredClubs = filterAndSortClubs(clubs, userLocation);

  return (
    <MainLayout
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      showHighTraffic={showHighTraffic}
      setShowHighTraffic={setShowHighTraffic}
      sortByOpenLate={sortByOpenLate}
      setSortByOpenLate={setSortByOpenLate}
      showSpecials={showSpecials}
      setShowSpecials={setShowSpecials}
      chatOpen={chatManager.chatOpen}
      isGeneralChat={chatManager.isGeneralChat}
      toggleGeneralChat={chatManager.toggleGeneralChat}
    >
      <ClubListContainer
        clubs={filteredClubs}
        selectedClubs={clubSelection.selectedClubs}
        selectedDay={selectedDay}
        sortBy={sortBy}
        setSortBy={setSortBy}
        filterGenre={filterGenre}
        setFilterGenre={setFilterGenre}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSelectClub={clubSelection.handleClubSelect}
        onOpenChat={chatManager.openChat}
        newMessageCounts={chatManager.newMessageCounts}
        isLoading={isLoadingClubs}
      />

      <MapSection
        isListCollapsed={false}
        isLoaded={isLoaded}
        filteredClubs={filteredClubs}
        selectedClubs={clubSelection.selectedClubs}
        selectedDay={selectedDay}
        setSelectedDay={setSelectedDay}
        mapCenter={locationManagement.mapCenter}
        mapZoom={locationManagement.mapZoom}
        userLocation={userLocation}
        directions={mapControls.directions}
        onClubSelect={clubSelection.handleClubSelect}
        locationManagement={locationManagement}
      />

      <ChatContainer
        chatOpen={chatManager.chatOpen}
        isGeneralChat={chatManager.isGeneralChat}
        chatManager={chatManager}
        clubs={clubs}
      />
    </MainLayout>
  );
}