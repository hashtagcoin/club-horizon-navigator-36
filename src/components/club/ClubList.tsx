import { FC, useEffect, useRef } from 'react';
import { FixedSizeList as List } from 'react-window';
import { ClubCard } from '@/components/ClubCard';
import { ClubFilters } from '@/components/ClubFilters';
import { Club } from '@/types/club';

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

  // Row renderer for the virtualized list
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const club = clubs[index];
    return (
      <div 
        style={style} 
        ref={selectedClub?.id === club.id ? selectedClubRef : null}
        className="px-2"
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

  useEffect(() => {
    if (selectedClub && selectedClubRef.current && scrollAreaRef.current) {
      const listElement = scrollAreaRef.current.querySelector('.react-window-list');
      if (!listElement) return;

      const clubElement = selectedClubRef.current;
      const scrollTop = clubElement.offsetTop - 100; // Offset to show some context
      
      listElement.scrollTo({
        top: scrollTop,
        behavior: 'smooth'
      });
    }
  }, [selectedClub]);

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
      <div ref={scrollAreaRef} className="flex-grow">
        {isLoading ? (
          <div className="p-4">Loading venues...</div>
        ) : (
          <List
            className="react-window-list"
            height={window.innerHeight - 300} // Adjust based on your layout
            itemCount={clubs.length}
            itemSize={150} // Adjust based on your card height
            width="100%"
          >
            {Row}
          </List>
        )}
      </div>
    </div>
  );
};