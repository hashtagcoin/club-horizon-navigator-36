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
  
  // Fixed measurements
  const ITEM_HEIGHT = 136; // 120px card + 16px total margin
  const OVERSCAN_COUNT = 5;
  const containerHeight = typeof window !== 'undefined' ? window.innerHeight - 180 : 800;

  const getItemsToRender = useCallback(() => {
    if (!clubs.length) return { items: [], startIndex: 0 };
    
    const startIndex = Math.max(0, Math.floor(scrollTop / ITEM_HEIGHT) - OVERSCAN_COUNT);
    const endIndex = Math.min(
      clubs.length,
      Math.ceil((scrollTop + containerHeight) / ITEM_HEIGHT) + OVERSCAN_COUNT
    );

    return {
      items: clubs.slice(startIndex, endIndex),
      startIndex,
    };
  }, [scrollTop, clubs.length, containerHeight]);

  const handleScroll = (e: any) => {
    const viewport = e.target.querySelector('[data-radix-scroll-area-viewport]');
    if (viewport) {
      setScrollTop(viewport.scrollTop);
    }
  };

  useEffect(() => {
    setScrollTop(0);
  }, [clubs.length]);

  if (isLoading) {
    return <div className="p-4 text-center">Loading venues...</div>;
  }

  const { items: visibleClubs, startIndex } = getItemsToRender();
  const totalHeight = clubs.length * ITEM_HEIGHT;

  return (
    <div 
      ref={containerRef}
      style={{ height: `calc(100vh - 180px)`, position: 'relative' }}
    >
      <ScrollArea 
        className="h-full w-full"
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
                top: (startIndex + index) * ITEM_HEIGHT,
                left: 0,
                right: 0,
                height: ITEM_HEIGHT,
                padding: '8px'
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