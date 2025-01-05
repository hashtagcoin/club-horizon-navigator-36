import { Club } from '@/types/club';
import { AnimatedClubList } from './AnimatedClubList';
import { useListState } from '@/hooks/useListState';

interface ClubListContainerProps {
  clubs: Club[];
  selectedClubs: Club[];
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

export const ClubListContainer = ({
  clubs,
  selectedClubs,
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
}: ClubListContainerProps) => {
  const listState = useListState();

  return (
    <AnimatedClubList
      x={listState.x}
      bind={listState.bind}
      isCollapsed={listState.isListCollapsed}
      onToggle={listState.toggleList}
      clubs={clubs}
      selectedClubs={selectedClubs}
      selectedDay={selectedDay}
      sortBy={sortBy}
      setSortBy={setSortBy}
      filterGenre={filterGenre}
      setFilterGenre={setFilterGenre}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      onSelectClub={onSelectClub}
      onOpenChat={onOpenChat}
      newMessageCounts={newMessageCounts}
      isLoading={isLoading}
    />
  );
};