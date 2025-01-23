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
      // Check if it's iOS
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
      
      if (isIOS) {
        try {
          // Add iOS specific meta tags
          const viewportMeta = document.querySelector('meta[name="viewport"]');
          if (viewportMeta) {
            viewportMeta.setAttribute('content', 
              'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
            );
          }

          // Add iOS specific styles
          const style = document.createElement('style');
          style.textContent = `
            html {
              height: 100vh;
              width: 100vw;
              position: fixed;
              overflow: hidden;
              -webkit-overflow-scrolling: touch;
            }
            body {
              height: 100%;
              width: 100%;
              overflow: hidden;
              position: fixed;
              -webkit-overflow-scrolling: touch;
              padding-top: env(safe-area-inset-top);
              padding-bottom: env(safe-area-inset-bottom);
            }
          `;
          document.head.appendChild(style);

          // Request fullscreen if available
          if (document.documentElement.requestFullscreen) {
            await document.documentElement.requestFullscreen();
          }

          // Add to homescreen prompt
          window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            // Optionally show a custom "Add to Home Screen" prompt
          });
        } catch (err) {
          console.log('Fullscreen setup error:', err);
        }
      }
    };

    enableFullscreen();
  }, []);

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