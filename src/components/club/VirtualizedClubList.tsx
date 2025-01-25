import { FC, useCallback, useState } from 'react';
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
  
  // Configuration - adjusted for actual card heights
  const itemHeight = 140; // Measured ClubCard height including margins
  const windowHeight = typeof window !== 'undefined' ? window.innerHeight - 200 : 800; // Adjust for header/footer
  const overscanCount = 3;

  const getItemsToRender = useCallback(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscanCount);
    const endIndex = Math.min(
      clubs.length,
      Math.ceil((scrollTop + windowHeight) / itemHeight) + overscanCount
    );

    return {
      items: clubs.slice(startIndex, endIndex),
      startIndex,
    };
  }, [scrollTop, clubs.length, windowHeight]);

  const handleScroll = (e: any) => {
    const scrollContainer = e.target.querySelector('[data-radix-scroll-area-viewport]');
    if (scrollContainer) {
      setScrollTop(scrollContainer.scrollTop);
    }
  };

  const { items: visibleClubs, startIndex } = getItemsToRender();

  if (isLoading) {
    return <div>Loading venues...</div>;
  }

  return (
    <ScrollArea 
      className="flex-grow"
      onScroll={handleScroll}
    >
      <div
        style={{
          height: clubs.length * itemHeight,
          position: 'relative'
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
  );
};