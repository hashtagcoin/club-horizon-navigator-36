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
import { useSpring, animated } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';

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

  const [{ x }, api] = useSpring(() => ({ x: 0 }));

  const bind = useDrag(({ movement: [mx], direction: [dx], cancel, active }) => {
    if (active && Math.abs(mx) > window.innerWidth * 0.3) {
      cancel();
      setIsListCollapsed(dx > 0);
      api.start({ x: dx > 0 ? window.innerWidth * 0.5 : 0, immediate: false });
    } else {
      api.start({ x: active ? mx : isListCollapsed ? window.innerWidth * 0.5 : 0, immediate: active });
    }
  }, {
    axis: 'x',
    bounds: { left: 0, right: window.innerWidth * 0.5 },
    rubberband: true
  });

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
      
      <div className="flex flex-1 overflow-hidden relative">
        <animated.div 
          {...bind()}
          style={{ 
            x,
            width: '50%',
            position: 'absolute',
            height: '100%',
            touchAction: 'none',
            zIndex: 40
          }}
          className="bg-white"
        >
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
        </animated.div>

        <div 
          className={`transition-all duration-300 ease-in-out h-full ${
            isListCollapsed ? 'w-full' : 'w-1/2 ml-[50%]'
          }`}
        >
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