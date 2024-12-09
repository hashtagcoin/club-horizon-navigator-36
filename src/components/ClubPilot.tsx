import { useState } from 'react';
import { useJsApiLoader, Libraries } from '@react-google-maps/api';
import { UserProfile } from './user-profile';
import { useLocationManagement } from '@/hooks/useLocationManagement';
import { useClubData } from '@/hooks/useClubData';
import { useChatManager } from './chat/ChatManager';
import { useMapControls } from '@/hooks/useMapControls';
import { useClubFilters } from '@/hooks/useClubFilters';
import { useSpring } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import { AnimatedClubList } from './club/AnimatedClubList';
import { MainLayout } from './layout/MainLayout';
import { MapView } from './map/MapView';
import { ChatWindow } from './chat/ChatWindow';

const libraries: Libraries = ['places'];

export default function ClubPilot() {
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [userLocation, setUserLocation] = useState({ lat: -33.8688, lng: 151.2093 });
  const [isListCollapsed, setIsListCollapsed] = useState(false);

  const locationManagement = useLocationManagement();
  const { data: clubs = [], isLoading: isLoadingClubs } = useClubData();
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyC6Z3hNhhdT0Fqy_AXYl07JBRczMiTg8_0",
    libraries
  });

  const mapControls = useMapControls(isLoaded, userLocation);

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

  const [{ x }, api] = useSpring(() => ({ x: 0 }));

  const toggleList = () => {
    setIsListCollapsed(!isListCollapsed);
    api.start({ 
      x: !isListCollapsed ? -window.innerWidth * 0.5 + 40 : 0,
      immediate: false,
      config: { tension: 200, friction: 25 }
    });
  };

  const bind = useDrag(({ movement: [mx], direction: [dx], cancel, active }) => {
    if (active && Math.abs(mx) > window.innerWidth * 0.15) {
      cancel();
      const shouldCollapse = dx < 0;
      setIsListCollapsed(shouldCollapse);
      api.start({ 
        x: shouldCollapse ? -window.innerWidth * 0.5 + 40 : 0, 
        immediate: false,
        config: { tension: 200, friction: 25 }
      });
    } else {
      api.start({ 
        x: active ? mx : isListCollapsed ? -window.innerWidth * 0.5 + 40 : 0, 
        immediate: active,
        config: { tension: 200, friction: 25 }
      });
    }
  }, {
    axis: 'x',
    bounds: { left: -window.innerWidth * 0.5 + 40, right: 0 },
    rubberband: true,
    from: () => [x.get(), 0]
  });

  if (showUserProfile) {
    return <UserProfile onClose={() => setShowUserProfile(false)} />;
  }

  const filteredClubs = filterAndSortClubs(clubs);

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
        x={x}
        bind={bind}
        isCollapsed={isListCollapsed}
        onToggle={toggleList}
        clubs={filteredClubs}
        selectedClub={mapControls.selectedClub}
        selectedDay={selectedDay}
        sortBy={sortBy}
        setSortBy={setSortBy}
        filterGenre={filterGenre}
        setFilterGenre={setFilterGenre}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSelectClub={(club) => {
          mapControls.handleClubSelect(club);
          locationManagement.setMapCenter(club.position);
          locationManagement.setMapZoom(16);
        }}
        onOpenChat={chatManager.openChat}
        newMessageCounts={chatManager.newMessageCounts}
        isLoading={isLoadingClubs}
      />

      <div 
        className={`transition-all duration-300 ease-in-out h-full ${
          isListCollapsed ? 'w-full ml-0' : 'w-1/2 ml-[50%]'
        }`}
      >
        <MapView
          isLoaded={isLoaded}
          clubs={filteredClubs}
          selectedClub={mapControls.selectedClub}
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
          mapCenter={locationManagement.mapCenter}
          mapZoom={locationManagement.mapZoom}
          userLocation={userLocation}
          directions={mapControls.directions}
          onClubSelect={(club) => {
            mapControls.handleClubSelect(club);
            locationManagement.setMapCenter(club.position);
            locationManagement.setMapZoom(16);
          }}
          locationManagement={locationManagement}
        />
      </div>

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