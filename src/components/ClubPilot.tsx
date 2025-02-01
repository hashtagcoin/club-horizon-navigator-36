import { ClubProvider } from '@/contexts/ClubContext';
import { LocationProvider } from '@/contexts/LocationContext';
import { MainLayout } from './layout/MainLayout';
import { useClubData } from '@/hooks/useClubData';
import { useJsApiLoader, Libraries } from '@react-google-maps/api';
import { useState } from 'react';
import { MapSection } from './map/MapSection';

const libraries: Libraries = ['places', 'geometry'];

export default function ClubPilot() {
  const { data: clubs = [], isLoading: isLoadingClubs } = useClubData();
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyC6Z3hNhhdT0Fqy_AXYl07JBRczMiTg8_0",
    libraries
  });

  // Add required state management
  const [searchQuery, setSearchQuery] = useState('');
  const [showHighTraffic, setShowHighTraffic] = useState(false);
  const [sortByOpenLate, setSortByOpenLate] = useState(false);
  const [showSpecials, setShowSpecials] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [isGeneralChat, setIsGeneralChat] = useState(true);
  const [selectedClub, setSelectedClub] = useState(null);
  const [selectedDay, setSelectedDay] = useState('Monday');

  const toggleGeneralChat = () => {
    setIsGeneralChat(!isGeneralChat);
  };

  // Default map center (Sydney, Australia)
  const defaultCenter = {
    lat: -33.8688,
    lng: 151.2093
  };

  return (
    <ClubProvider>
      <LocationProvider>
        <MainLayout
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          showHighTraffic={showHighTraffic}
          setShowHighTraffic={setShowHighTraffic}
          sortByOpenLate={sortByOpenLate}
          setSortByOpenLate={setSortByOpenLate}
          showSpecials={showSpecials}
          setShowSpecials={setShowSpecials}
          chatOpen={chatOpen}
          isGeneralChat={isGeneralChat}
          toggleGeneralChat={toggleGeneralChat}
        >
          <MapSection
            isListCollapsed={false}
            isLoaded={isLoaded}
            filteredClubs={clubs}
            selectedClub={selectedClub}
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
            mapCenter={defaultCenter}
            mapZoom={14}
            userLocation={defaultCenter}
            directions={null}
            onClubSelect={setSelectedClub}
            locationManagement={{}}
          />
        </MainLayout>
      </LocationProvider>
    </ClubProvider>
  );
}