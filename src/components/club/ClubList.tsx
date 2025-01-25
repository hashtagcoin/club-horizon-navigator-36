import { useEffect, useRef } from "react";
import { Club } from "@/types/club";
import { ClubCard } from "@/components/ClubCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FixedSizeList as List } from 'react-window';
import { Skeleton } from "@/components/ui/skeleton";
import { useMediaQuery } from "@/hooks/use-mobile";

interface ClubListProps {
  clubs: Club[];
  selectedClub: Club | null;
  onSelectClub: (club: Club) => void;
  onOpenChat: (club: Club) => void;
  newMessageCounts: Record<string, number>;
  isLoading?: boolean;
}

export const ClubList = ({
  clubs,
  selectedClub,
  onSelectClub,
  onOpenChat,
  newMessageCounts,
  isLoading = false,
}: ClubListProps) => {
  const selectedClubRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    if (selectedClubRef.current) {
      selectedClubRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [selectedClub]);

  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const club = clubs[index];
    return (
      <div 
        style={{ 
          ...style,
          padding: '8px',
        }} 
        ref={selectedClub?.id === club.id ? selectedClubRef : null}
      >
        <ClubCard
          club={club}
          isSelected={selectedClub?.id === club.id}
          onSelect={onSelectClub}
          onOpenChat={onOpenChat}
          newMessageCount={newMessageCounts[club.id] || 0}
        />
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        ))}
      </div>
    );
  }

  if (!clubs.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <p className="text-muted-foreground">No clubs found</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-2">
        {clubs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-muted-foreground">No clubs found</p>
          </div>
        ) : (
          <List
            className="react-window-list"
            height={window.innerHeight - 300}
            itemCount={clubs.length}
            itemSize={180}
            width="100%"
            overscanCount={5}
          >
            {Row}
          </List>
        )}
      </div>
    </ScrollArea>
  );
};