import { TopBar } from './TopBar';
import { BottomBar } from './BottomBar';
import { MapView } from '../map/MapView';
import { AnimatedClubList } from '../club/AnimatedClubList';
import { useSpring } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import { FriendsList } from '../friends/FriendsList';
import { useState } from 'react';

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
  children
}: MainLayoutProps) {
  const [showFriendsList, setShowFriendsList] = useState(false);

  const toggleFriendsList = () => {
    setShowFriendsList(!showFriendsList);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 text-sm">
      <TopBar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      
      <div className="flex-1 relative overflow-hidden">
        {children}
        <FriendsList isOpen={showFriendsList} />
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
      />
    </div>
  );
}