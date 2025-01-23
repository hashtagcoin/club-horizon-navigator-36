import { TopBar } from './TopBar';
import { BottomBar } from './BottomBar';
import { FriendsList } from '../friends/FriendsList';
import { OffersPanel } from '../offers/OffersPanel';
import { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface MainLayoutProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  showHighTraffic: boolean;
  setShowHighTraffic: (value: boolean) => void;
  sortByOpenLate: boolean;
  setSortByOpenLate: (value: boolean) => void;
  showSpecials: boolean;
  setShowSpecials: (value: boolean) => void;
  chatOpen: boolean;
  isGeneralChat: boolean;
  toggleGeneralChat: () => void;
  onVenueAdded?: (venue: any) => void;
  children?: React.ReactNode;
}

export function MainLayout({
  searchQuery,
  setSearchQuery,
  showHighTraffic,
  setShowHighTraffic,
  sortByOpenLate,
  setSortByOpenLate,
  showSpecials,
  setShowSpecials,
  chatOpen,
  isGeneralChat,
  toggleGeneralChat,
  onVenueAdded,
  children
}: MainLayoutProps) {
  const [showFriendsList, setShowFriendsList] = useState(false);
  const [showOffers, setShowOffers] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const enableFullscreen = async () => {
      if (isMobile && document.documentElement.requestFullscreen) {
        try {
          await document.documentElement.requestFullscreen();
        } catch (err) {
          console.log('Fullscreen request failed:', err);
        }
      }
    };

    enableFullscreen();
  }, [isMobile]);

  const toggleFriendsList = () => {
    setShowFriendsList(!showFriendsList);
  };

  const toggleOffers = () => {
    setShowOffers(!showOffers);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 text-sm">
      <TopBar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onVenueAdded={onVenueAdded}
      />
      
      <div className="flex-1 relative overflow-hidden">
        {children}
        <FriendsList 
          isOpen={showFriendsList} 
          onClose={() => setShowFriendsList(false)} 
        />
        <OffersPanel
          isOpen={showOffers}
          onClose={() => setShowOffers(false)}
        />
      </div>

      <BottomBar
        showHighTraffic={showHighTraffic}
        setShowHighTraffic={setShowHighTraffic}
        sortByOpenLate={sortByOpenLate}
        setSortByOpenLate={setSortByOpenLate}
        showSpecials={showSpecials}
        setShowSpecials={setShowSpecials}
        chatOpen={chatOpen}
        isGeneralChat={isGeneralChat}
        toggleGeneralChat={toggleGeneralChat}
        showFriendsList={showFriendsList}
        toggleFriendsList={toggleFriendsList}
        showOffers={showOffers}
        toggleOffers={toggleOffers}
      />
    </div>
  );
}