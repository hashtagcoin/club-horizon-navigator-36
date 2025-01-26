import { FC, useCallback, useState, useRef } from 'react';
import { Club } from '@/types/club';
import { ClubCard } from '@/components/ClubCard';
import { ClubFilters } from '@/components/ClubFilters';

interface VirtualizedClubListProps {
  clubs: Club[];
  selectedClub: Club | null;
  selectedDay: string;
  onSelectClub: (club: Club) => void;
  onOpenChat: (club: Club) => void;
  newMessageCounts: Record<number, number>;
  isLoading: boolean;
  sortBy: string;
  setSortBy: (value: string) => void;
  filterGenre: string[];
  setFilterGenre: (value: string[]) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}

export const VirtualizedClubList: FC<VirtualizedClubListProps> = ({
  clubs,
  selectedClub,
  selectedDay,
  onSelectClub,
  onOpenChat,
  newMessageCounts,
  isLoading,
  sortBy,
  setSortBy,
  filterGenre,
  setFilterGenre,
  searchQuery,
  setSearchQuery
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Fixed measurements
  const ITEM_HEIGHT = 143; // 135px card + 8px spacing
  const OVERSCAN_COUNT = 5;
  const containerHeight = typeof window !== 'undefined' ? window.innerHeight - 120 : 800;

  // Get unique genres from clubs
  const genres = Array.from(new Set(clubs.map(club => club.genre)));

  const getItemsToRender = useCallback(() => {
    if (!clubs.length) return { items: [], startIndex: 0 };
    
    const startIndex = Math.max(0, Math.floor(scrollTop / ITEM_HEIGHT) - OVERSCAN_COUNT);
    const endIndex = Math.min(
      clubs.length,
      Math.ceil((scrollTop + containerHeight) / ITEM_HEIGHT) + OVERSCAN_COUNT
    );

    return {
      items: clubs.slice(startIndex, endIndex),
      startIndex,
    };
  }, [scrollTop, clubs.length, containerHeight]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  if (isLoading) {
    return <div className="p-4 text-center">Loading venues...</div>;
  }

  const { items: visibleClubs, startIndex } = getItemsToRender();
  const totalHeight = clubs.length * ITEM_HEIGHT;

  return (
    <div className="flex flex-col h-full">
      {/* Static Header Section */}
      <div className="px-4 py-3 border-b border-gray-200">
        {/* Venue Counter */}
        <div className="flex items-center mb-3">
          <div className="bg-black text-white px-3 py-1 rounded">
            {clubs.length}
          </div>
          <span className="ml-2 text-gray-700">venues</span>
        </div>
        
        {/* Filters */}
        <ClubFilters
          sortBy={sortBy}
          setSortBy={setSortBy}
          filterGenre={filterGenre}
          setFilterGenre={setFilterGenre}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          genres={genres}
        />
      </div>

      {/* Scrollable Club List */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-auto virtualized-list"
        onScroll={handleScroll}
      >
        <div
          style={{
            height: totalHeight,
            position: 'relative',
            width: '100%'
          }}
        >
          {visibleClubs.map((club, index) => (
            <div
              key={club.id}
              style={{
                position: 'absolute',
                top: (startIndex + index) * ITEM_HEIGHT,
                left: 0,
                right: 0,
                height: ITEM_HEIGHT,
                padding: '4px 0'
              }}
            >
              <ClubCard
                club={club}
                selectedDay={selectedDay}
                isSelected={selectedClub?.id === club.id}
                onSelect={onSelectClub}
                onOpenChat={onOpenChat}
                newMessageCount={newMessageCounts[club.id] || 0}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};