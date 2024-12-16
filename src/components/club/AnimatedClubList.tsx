import { animated, SpringValue } from '@react-spring/web';
import { Button } from "@/components/ui/button";
import { ChevronLeft, Maximize2 } from 'lucide-react';
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
          touchAction: isCollapsed ? 'none' : 'pan-x',
          zIndex: 40,
          transform: x.to(x => `translateX(${x}px)`)
        }}
        className="bg-white shadow-xl"
      >
        <ClubList {...clubListProps} />
      </animated.div>

      {/* Minimize button */}
      <animated.div
        style={{
          x: x.to(x => x + (isCollapsed ? -40 : window.innerWidth * 0.5 - 40)),
          position: 'fixed',
          top: '50vh',
          left: 0,
          zIndex: 50,
          transform: x.to(x => `translateX(${x}px)`),
          opacity: isCollapsed ? 0 : 1,
          pointerEvents: isCollapsed ? 'none' : 'auto',
        }}
      >
        <Button
          variant="ghost"
          size="icon"
          className="bg-white shadow-lg h-20 w-10 rounded-r-xl border-r border-t border-b border-gray-200 hover:bg-gray-50 transition-all duration-300"
          onClick={onToggle}
        >
          <ChevronLeft 
            className={`h-6 w-6 transition-transform duration-300 text-gray-600 ${
              isCollapsed ? 'rotate-180' : ''
            }`}
          />
        </Button>
      </animated.div>

      {/* Maximize button - only visible when collapsed */}
      <div
        style={{
          position: 'fixed',
          top: '50vh',
          left: 0,
          zIndex: 50,
          opacity: isCollapsed ? 1 : 0,
          pointerEvents: isCollapsed ? 'auto' : 'none',
          transition: 'opacity 0.3s ease-in-out',
        }}
      >
        <Button
          variant="ghost"
          size="icon"
          className="bg-white shadow-lg h-20 w-10 rounded-r-xl border-r border-t border-b border-gray-200 hover:bg-gray-50 transition-all duration-300"
          onClick={onToggle}
        >
          <Maximize2 
            className="h-6 w-6 text-gray-600"
          />
        </Button>
      </div>
    </>
  );
};