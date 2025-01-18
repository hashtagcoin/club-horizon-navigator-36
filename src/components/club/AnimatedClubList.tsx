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
  filterGenre: string[];
  setFilterGenre: (value: string[]) => void;
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
          zIndex: 20,
          transform: x.to(x => `translateX(${x}px)`)
        }}
        className="bg-white shadow-xl"
      >
        <ClubList {...clubListProps} />
      </animated.div>

      {/* Toggle button - shown when collapsed */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: isCollapsed ? 0 : '50%',
          transform: 'translateY(-50%)', // Center vertically
          zIndex: 25,
          transition: 'left 0.3s ease-in-out',
        }}
      >
        <Button
          variant="ghost"
          size="icon"
          className="bg-white shadow-lg h-10 w-5 rounded-r-xl border-r border-t border-b border-gray-200 hover:bg-gray-50 transition-all duration-300"
          onClick={onToggle}
        >
          <ChevronLeft 
            className={`h-3 w-3 text-gray-600 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
            strokeWidth={2}
          />
        </Button>
      </div>
    </>
  );
};