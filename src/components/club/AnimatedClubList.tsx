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
    <>
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
      </animated.div>
      
      <Button
        variant="default"
        size="icon"
        className={`fixed left-[50%] top-4 z-50 bg-white shadow-lg rounded-full p-2 transition-all duration-300 hover:bg-gray-100 ${
          isCollapsed ? '-translate-x-6' : '-translate-x-6'
        }`}
        onClick={onToggle}
      >
        <ChevronLeft 
          className={`h-6 w-6 transition-transform duration-300 ${
            isCollapsed ? 'rotate-180' : ''
          }`}
        />
      </Button>
    </>
  );
};