import { FC, useEffect, useRef, useMemo } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
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
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<VariableSizeList>(null);
  const isMobile = useIsMobile();
  
  // Adjusted height calculation
  const listHeight = typeof window !== 'undefined' ? 
    window.innerHeight - (isMobile ? 240 : 180) : 
    600;

  // Function to calculate item height based on content
  const getItemHeight = (index: number) => {
    const club = clubs[index];
    let height = 110; // Base height

    // Add height for long venue names (assuming they wrap)
    if (club.name.length > 25) {
      height += 20;
    }

    // Add height for additional icons (traffic, specials, user-added)
    const hasSpecial = club.hasSpecial;
    const isUserAdded = club.isUserAdded;
    if (hasSpecial || isUserAdded) {
      height += 10;
    }

    return height + 2; // Add 2px for gap
  };

  // Memoize item heights for performance
  const itemHeights = useMemo(() => {
    return clubs.map((_, index) => getItemHeight(index));
  }, [clubs]);

  // Reset cache when clubs change
  useEffect(() => {
    if (listRef.current) {
      listRef.current.resetAfterIndex(0);
    }
  }, [clubs]);

  // Scroll to selected club
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
          paddingLeft: '4px',
          paddingRight: '4px',
          paddingBottom: '2px'
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
    <div className="w-full h-full flex flex-col p-1 overflow-hidden bg-white shadow-lg">
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
      <div className="flex-grow overflow-hidden px-1" ref={scrollAreaRef}>
        {isLoading ? (
          <div>Loading venues...</div>
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
          </VariableSizeList>
        )}
      </div>
    </div>
  );
};