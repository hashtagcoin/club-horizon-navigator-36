import { animated, SpringValue } from '@react-spring/web';
import { UseDragResult } from '@use-gesture/react';
import { Button } from "@/components/ui/button";
import { ChevronLeft } from 'lucide-react';
import { ClubList } from './ClubList';
import { Club } from '@/types/club';

interface AnimatedClubListProps {
  x: SpringValue<number>;
  bind: (...args: any[]) => UseDragResult;
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
      className="bg-white shadow-lg"
    >
      <ClubList {...clubListProps} />
      <Button
        variant="ghost"
        size="icon"
        className={`absolute -right-10 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full p-2 z-50 transition-transform ${
          isCollapsed ? 'rotate-180' : ''
        }`}
        onClick={onToggle}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
    </animated.div>
  );
};