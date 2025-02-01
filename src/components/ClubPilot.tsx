import { ClubProvider } from '@/contexts/ClubContext';
import { LocationProvider } from '@/contexts/LocationContext';
import { MainLayout } from './layout/MainLayout';
import { useClubData } from '@/hooks/useClubData';
import { useJsApiLoader, Libraries } from '@react-google-maps/api';
import { useState } from 'react';

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

  const toggleGeneralChat = () => {
    setIsGeneralChat(!isGeneralChat);
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
          {/* Pass clubs and loading state to children if needed */}
        </MainLayout>
      </LocationProvider>
    </ClubProvider>
  );
}