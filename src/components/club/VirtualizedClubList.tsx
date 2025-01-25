import { FC, useCallback, useState, useRef, useEffect } from 'react';
import { Club } from '@/types/club';
import { ClubCard } from '@/components/ClubCard';
import { ScrollArea } from "@/components/ui/scroll-area";

interface VirtualizedClubListProps {
  clubs: Club[];
  selectedClub: Club | null;
  selectedDay: string;
  onSelectClub: (club: Club) => void;
  onOpenChat: (club: Club) => void;
  newMessageCounts: Record<number, number>;
  isLoading: boolean;
}

export const VirtualizedClubList: FC<VirtualizedClubListProps> = ({
  clubs,
  selectedClub,
  selectedDay,
  onSelectClub,
  onOpenChat,
  newMessageCounts,
  isLoading
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Configuration
  const itemHeight = 140; // Fixed height for each club card including padding
  const containerHeight = typeof window !== 'undefined' ? window.innerHeight - 180 : 800;
  const overscanCount = 5;

  const getItemsToRender = useCallback(() => {
    if (!clubs.length) return { items: [], startIndex: 0 };
    
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscanCount);
    const visibleCount = Math.ceil(containerHeight / itemHeight) + 2 * overscanCount;
    const endIndex = Math.min(clubs.length, startIndex + visibleCount);

    return {
      items: clubs.slice(startIndex, endIndex),
      startIndex,
    };
  }, [scrollTop, clubs.length, containerHeight, itemHeight]);

  const handleScroll = (e: any) => {
    const scrollContainer = e.target.querySelector('[data-radix-scroll-area-viewport]');
    if (scrollContainer) {
      setScrollTop(scrollContainer.scrollTop);
    }
  };

  useEffect(() => {
    setScrollTop(0);
  }, [clubs.length]);

  if (isLoading) {
    return <div className="p-4 text-center">Loading venues...</div>;
  }

  const { items: visibleClubs, startIndex } = getItemsToRender();

  const totalHeight = clubs.length * itemHeight;

  return (
    <div className="h-full flex flex-col overflow-hidden" ref={containerRef}>
      <ScrollArea 
        className="h-full flex-1"
        onScroll={handleScroll}
      >
        <div
          style={{
            height: totalHeight,
            position: 'relative',
            width: '100%'
          }}
        >
          {visibleClubs.map((club, index) => (
            <div
              key={club.id}
              style={{
                position: 'absolute',
                top: (startIndex + index) * itemHeight,
                left: 0,
                right: 0,
                height: itemHeight,
                padding: '0.5rem'
              }}
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
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};