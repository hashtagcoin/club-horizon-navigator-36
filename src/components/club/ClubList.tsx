import { FC, useEffect, useRef } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
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

  useEffect(() => {
    if (selectedClub && selectedClubRef.current && scrollAreaRef.current) {
      const scrollArea = scrollAreaRef.current;
      const clubElement = selectedClubRef.current;
      
      // Calculate the scroll position to center the selected club
      const scrollAreaRect = scrollArea.getBoundingClientRect();
      const clubRect = clubElement.getBoundingClientRect();
      
      const scrollTop = clubElement.offsetTop - (scrollAreaRect.height / 2) + (clubRect.height / 2);
      
      // Smooth scroll to the calculated position
      scrollArea.scrollTo({
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
      <ScrollArea className="flex-grow" ref={scrollAreaRef}>
        <div className="space-y-2 pr-2">
          {isLoading ? (
            <div>Loading venues...</div>
          ) : (
            clubs.map(club => (
              <div 
                key={club.id} 
                ref={selectedClub?.id === club.id ? selectedClubRef : null}
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
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};