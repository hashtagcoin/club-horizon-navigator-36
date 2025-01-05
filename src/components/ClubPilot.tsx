import { useState } from 'react';
import { useJsApiLoader, Libraries } from '@react-google-maps/api';
import { UserProfile } from './user-profile';
import { useLocationManagement } from '@/hooks/useLocationManagement';
import { useClubData } from '@/hooks/useClubData';
import { useChatManager } from './chat/ChatManager';
import { useMapControls } from '@/hooks/useMapControls';
import { useClubFilters } from '@/hooks/useClubFilters';
import { useListState } from '@/hooks/useListState';
import { AnimatedClubList } from './club/AnimatedClubList';
import { MainLayout } from './layout/MainLayout';
import { MapSection } from './map/MapSection';
import { ChatWindow } from './chat/ChatWindow';
import { Club } from '@/types/club';

const libraries: Libraries = ['places'];

export default function ClubPilot() {
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [userLocation, setUserLocation] = useState({ lat: -33.8688, lng: 151.2093 });
  const [selectedClubs, setSelectedClubs] = useState<Club[]>([]);

  const locationManagement = useLocationManagement();
  const { data: clubs = [], isLoading: isLoadingClubs } = useClubData();
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyC6Z3hNhhdT0Fqy_AXYl07JBRczMiTg8_0",
    libraries
  });

  const mapControls = useMapControls(isLoaded, userLocation);
  const listState = useListState();

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

  const chatManager = useChatManager(mapControls.selectedClub);

  const handleClubSelect = (club: Club) => {
    setSelectedClubs(prevSelected => {
      const isAlreadySelected = prevSelected.some(c => c.id === club.id);
      if (isAlreadySelected) {
        return prevSelected.filter(c => c.id !== club.id);
      } else {
        return [...prevSelected, club];
      }
    });
    mapControls.handleClubSelect(club);
    locationManagement.setMapCenter(club.position);
    locationManagement.setMapZoom(16);
  };

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
      <AnimatedClubList
        x={listState.x}
        bind={listState.bind}
        isCollapsed={listState.isListCollapsed}
        onToggle={listState.toggleList}
        clubs={filteredClubs}
        selectedClubs={selectedClubs}
        selectedDay={selectedDay}
        sortBy={sortBy}
        setSortBy={setSortBy}
        filterGenre={filterGenre}
        setFilterGenre={setFilterGenre}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSelectClub={handleClubSelect}
        onOpenChat={chatManager.openChat}
        newMessageCounts={chatManager.newMessageCounts}
        isLoading={isLoadingClubs}
      />

      <MapSection
        isListCollapsed={listState.isListCollapsed}
        isLoaded={isLoaded}
        filteredClubs={filteredClubs}
        selectedClubs={selectedClubs}
        selectedDay={selectedDay}
        setSelectedDay={setSelectedDay}
        mapCenter={locationManagement.mapCenter}
        mapZoom={locationManagement.mapZoom}
        userLocation={userLocation}
        directions={mapControls.directions}
        onClubSelect={handleClubSelect}
        locationManagement={locationManagement}
      />

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
    </MainLayout>
  );
}