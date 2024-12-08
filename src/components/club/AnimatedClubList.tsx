import { animated, SpringValue } from '@react-spring/web';
import { UserHandlers } from '@use-gesture/react';
import { Button } from "@/components/ui/button";
import { ChevronRight } from 'lucide-react';
import { ClubList } from './ClubList';
import { Club } from '@/types/club';

interface AnimatedClubListProps {
  x: SpringValue<number>;
  bind: (...args: any[]) => UserHandlers;
  isCollapsed: boolean;
  onToggle: () => void;
  clubs: Club[];
  selectedClub: Club | null;
  selectedDay: string;
  sortBy: string;
  setSortBy: (value: string) => void;
  filterGenre: string;
  setFilterGenre: (value: string) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  onSelectClub: (club: Club) => void;
  onOpenChat: (club: Club) => void;
  newMessageCounts: Record<number, number>;
  isLoading: boolean;
}

export const AnimatedClubList = ({
  x,
  bind,
  isCollapsed,
  onToggle,
  ...clubListProps
}: AnimatedClubListProps) => {
  return (
    <animated.div 
      {...bind()}
      style={{ 
        x,
        width: '50%',
        position: 'absolute',
        height: '100%',
        touchAction: 'none',
        zIndex: 40,
        transform: x.to(x => `translateX(${x}px)`)
      }}
      className="bg-white shadow-xl"
    >
      <ClubList {...clubListProps} />
      <Button
        variant="default"
        size="icon"
        className={`fixed left-[50%] top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full p-2 z-50 transition-all duration-300 hover:bg-gray-100 ${
          isCollapsed ? 'translate-x-[-24px]' : 'translate-x-[-12px]'
        }`}
        onClick={onToggle}
      >
        <ChevronRight className={`h-6 w-6 transition-transform duration-300 ${
          isCollapsed ? '' : 'rotate-180'
        }`} />
      </Button>
    </animated.div>
  );
};