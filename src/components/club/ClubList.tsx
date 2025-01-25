import { FC, useEffect, useRef, useMemo } from 'react';
import { ClubCard } from '@/components/ClubCard';
import { ClubFilters } from '@/components/ClubFilters';
import { Club } from '@/types/club';
import { VariableSizeList } from 'react-window';
import { useIsMobile } from "@/hooks/use-mobile";

interface ClubListProps {
  clubs: Club[];
  selectedClub: Club | null;
  selectedDay: string;
  sortBy: string;
  setSortBy: (value: string) => void;
  filterGenre: string[];
  setFilterGenre: (value: string[]) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  onSelectClub: (club: Club) => void;
  onOpenChat: (club: Club) => void;
  newMessageCounts: Record<number, number>;
  isLoading: boolean;
}

export const ClubList: FC<ClubListProps> = ({
  clubs,
  selectedClub,
  selectedDay,
  sortBy,
  setSortBy,
  filterGenre,
  setFilterGenre,
  searchQuery,
  setSearchQuery,
  onSelectClub,
  onOpenChat,
  newMessageCounts,
  isLoading
}) => {
  const genres = Array.from(new Set(clubs.map(club => club.genre))).sort();
  const selectedClubRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<VariableSizeList>(null);
  const isMobile = useIsMobile();
  
  // Calculate available height for the list
  const listHeight = typeof window !== 'undefined' ? 
    window.innerHeight - (isMobile ? 240 : 180) : 
    600;

  const getItemHeight = (index: number) => {
    const club = clubs[index];
    const BASE_HEIGHT = 140;
    const PADDING = 16;
    
    let additionalHeight = 0;
    
    if (club.name.length > 25) {
      additionalHeight += 24;
    }

    if (club.hasSpecial || club.isUserAdded) {
      additionalHeight += 16;
    }

    return BASE_HEIGHT + additionalHeight + PADDING;
  };

  const itemHeights = useMemo(() => {
    return clubs.map((_, index) => getItemHeight(index));
  }, [clubs]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.resetAfterIndex(0);
    }
  }, [clubs]);

  useEffect(() => {
    if (selectedClub && listRef.current) {
      const index = clubs.findIndex(club => club.id === selectedClub.id);
      if (index !== -1) {
        listRef.current.scrollToItem(index, 'smart');
      }
    }
  }, [selectedClub, clubs]);

  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const club = clubs[index];
    return (
      <div 
        style={{
          ...style,
          padding: '8px',
          boxSizing: 'border-box'
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
    );
  };

  return (
    <div className="w-full h-full flex flex-col bg-white shadow-lg">
      <div className="flex justify-between items-center px-4 py-2 bg-gray-50">
        <div className="flex items-center gap-2">
          <div className="bg-black text-white px-4 py-1.5 rounded-lg text-xl font-bold">
            {clubs.length}
          </div>
          <span className="text-sm font-medium text-gray-600">
            {clubs.length === 1 ? 'Venue' : 'Venues'}
          </span>
        </div>
      </div>
      <ClubFilters
        sortBy={sortBy}
        setSortBy={setSortBy}
        filterGenre={filterGenre}
        setFilterGenre={setFilterGenre}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        genres={genres}
      />
      <div className="flex-grow overflow-hidden">
        {isLoading ? (
          <div className="p-4">Loading venues...</div>
        ) : (
          <VariableSizeList
            ref={listRef}
            height={listHeight}
            width="100%"
            itemCount={clubs.length}
            itemSize={getItemHeight}
            overscanCount={5}
            className="react-window-list"
          >
            {Row}
          </div>
        )}
      </div>
    </div>
  );
};