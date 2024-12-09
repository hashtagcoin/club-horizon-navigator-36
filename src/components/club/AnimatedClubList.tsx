import { animated, SpringValue } from '@react-spring/web';
import { Button } from "@/components/ui/button";
import { ChevronLeft } from 'lucide-react';
import { ClubList } from './ClubList';
import { Club } from '@/types/club';

interface AnimatedClubListProps {
  x: SpringValue<number>;
  bind: (...args: any[]) => any;
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
    <div className="relative h-full">
      <animated.div 
        {...bind()}
        style={{ 
          x,
          width: '50%',
          position: 'absolute',
          height: '100%',
          touchAction: isCollapsed ? 'none' : 'pan-x',
          zIndex: 40,
        }}
        className="bg-white shadow-xl"
      >
        <ClubList {...clubListProps} />
      </animated.div>
      <Button
        variant="ghost"
        size="icon"
        className={`fixed top-1/2 -translate-y-1/2 z-50 bg-white shadow-lg h-20 w-10 rounded-r-xl border-r border-t border-b border-gray-200 hover:bg-gray-50 transition-all duration-300 ${
          isCollapsed ? 'left-0' : 'left-[calc(50%-10px)]'
        }`}
        onClick={onToggle}
      >
        <ChevronLeft 
          className={`h-6 w-6 transition-transform duration-300 text-gray-600 ${
            isCollapsed ? 'rotate-180' : ''
          }`}
        />
      </Button>
    </div>
  );
};