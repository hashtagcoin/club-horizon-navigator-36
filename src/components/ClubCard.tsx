import { Card } from "@/components/ui/card";
import { Club } from "@/types/club";

interface ClubCardProps {
  club: Club;
  isSelected: boolean;
  onSelect: (club: Club) => void;
  onOpenChat: (club: Club) => void;
  newMessageCount: number;
}

export function ClubCard({
  club,
  isSelected,
  onSelect,
  onOpenChat,
  newMessageCount,
}: ClubCardProps) {
  return (
    <Card
      className={`cursor-pointer relative bg-white hover:bg-gray-50 transition-colors ${
        isSelected ? 'ring-2 ring-primary' : ''
      } club-card`}
      onClick={() => onSelect(club)}
    >
      <div className="flex justify-between items-start p-4">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold leading-none">{club.name}</h3>
          <p className="text-sm text-muted-foreground">{club.address}</p>
          <div className="pt-2">
            <button
              className="text-sm text-primary hover:underline"
              onClick={(e) => {
                e.stopPropagation();
                onOpenChat(club);
              }}
            >
              Open Chat
            </button>
          </div>
        </div>
        {newMessageCount > 0 && (
          <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-1 font-medium">
            {newMessageCount}
          </span>
        )}
      </div>
    </Card>
  );
}