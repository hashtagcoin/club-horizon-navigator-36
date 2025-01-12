import { FC, useEffect, useRef } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { ClubCard } from '@/components/ClubCard';
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
    <div className="w-full h-full flex flex-col overflow-hidden bg-white shadow-lg pt-24">
      <ScrollArea className="flex-grow">
        <div className="space-y-2 p-2">
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