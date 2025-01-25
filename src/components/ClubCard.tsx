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
      <div className="flex justify-between items-center p-4">
        <div>
          <h3 className="text-lg font-semibold">{club.name}</h3>
          <p className="text-sm text-gray-500">{club.address}</p>
        </div>
        {newMessageCount > 0 && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs rounded-full px-2">
            {newMessageCount}
          </span>
        )}
      </div>
      <div className="p-4">
        <button
          className="text-blue-500 hover:underline"
          onClick={(e) => {
            e.stopPropagation();
            onOpenChat(club);
          }}
        >
          Open Chat
        </button>
      </div>
    </Card>
  );
}
