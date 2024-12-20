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
          touchAction: isCollapsed ? 'none' : 'pan-x',
          zIndex: 20,
          transform: x.to(x => `translateX(${x}px)`)
        }}
        className="bg-white shadow-xl flex"
      >
        <div className="flex-grow">
          <ClubList {...clubListProps} />
        </div>
        
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className={`absolute top-1/2 right-0 -translate-y-1/2 translate-x-full bg-white shadow-lg h-20 w-10 rounded-r-xl border-r border-t border-b border-gray-200 hover:bg-gray-50 transition-all duration-300 ${isCollapsed ? 'hidden' : ''}`}
            onClick={onToggle}
          >
            <ChevronLeft 
              className="h-6 w-6 transition-transform duration-300 text-gray-600"
              strokeWidth={5}
            />
          </Button>
        </div>
      </animated.div>

      <div
        style={{
          position: 'fixed',
          top: '50vh',
          left: 0,
          zIndex: 21,
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
          <ChevronLeft 
            className="h-6 w-6 text-gray-600 rotate-180"
            strokeWidth={5}
          />
        </Button>
      </div>
    </>
  );
};