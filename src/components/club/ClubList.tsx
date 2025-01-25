import { FC, useEffect, useRef, useCallback, useMemo } from 'react';
import { ClubFilters } from '@/components/ClubFilters';
import { Club } from '@/types/club';
import { VirtualizedClubList } from './VirtualizedClubList';

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
  // Memoize genres list to prevent recalculation on every render
  const genres = useMemo(() => 
    Array.from(new Set(clubs.map(club => club.genre))).sort(),
    [clubs]
  );

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
      <VirtualizedClubList
        clubs={clubs}
        selectedClub={selectedClub}
        selectedDay={selectedDay}
        onSelectClub={onSelectClub}
        onOpenChat={onOpenChat}
        newMessageCounts={newMessageCounts}
        isLoading={isLoading}
      />
    </div>
  );
};