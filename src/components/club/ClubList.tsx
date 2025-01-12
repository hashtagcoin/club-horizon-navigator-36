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

  useEffect(() => {
    if (selectedClub && selectedClubRef.current) {
      selectedClubRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [selectedClub]);

  return (
    <div className="w-full h-full flex flex-col p-1 overflow-hidden bg-white shadow-lg">
      <div className="fixed top-16 left-0 w-1/2 z-50 bg-white shadow-md">
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
      </div>
      <div className="mt-28">
        <ScrollArea className="flex-grow">
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
    </div>
  );
};