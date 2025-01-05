import { Club } from '@/types/club';
import { Card, CardContent } from "@/components/ui/card";
import { Music, Clock, MessageCircle, User } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface ClubCardProps {
  club: Club;
  selectedDay: string;
  isSelected: boolean;
  onSelect: (club: Club) => void;
  onOpenChat: (club: Club) => void;
  newMessageCount: number;
}

export const ClubCard = ({
  club,
  selectedDay,
  isSelected,
  onSelect,
  onOpenChat,
  newMessageCount
}: ClubCardProps) => {
  const formatType = (type: string) => {
    return type
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <Card
      className={`cursor-pointer relative bg-white hover:bg-gray-50 transition-all duration-200 ${
        isSelected ? 'border-2 border-black' : 'border border-gray-200'
      }`}
      onClick={() => onSelect(club)}
    >
      <CardContent className="p-3 flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-medium text-sm text-gray-900 truncate mr-2">{club.name}</h3>
            {club.hasSpecial && (
              <span className="text-yellow-500 text-sm">😊</span>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <Music className="h-3 w-3" />
              <span className="truncate">{formatType(club.genre)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span className="truncate">{club.openingHours[selectedDay]}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center space-x-0.5" aria-label={`${club.traffic} Traffic`}>
            <User className={`h-3 w-3 ${club.traffic === 'High' || club.traffic === 'Medium' || club.traffic === 'Low' ? 'fill-primary text-primary' : 'text-gray-300'}`} />
            <User className={`h-3 w-3 ${club.traffic === 'High' || club.traffic === 'Medium' ? 'fill-primary text-primary' : 'text-gray-300'}`} />
            <User className={`h-3 w-3 ${club.traffic === 'High' ? 'fill-primary text-primary' : 'text-gray-300'}`} />
          </div>
          
          <Button
            size="sm"
            variant="outline"
            className="h-6 w-6 p-0 relative"
            onClick={(e) => { e.stopPropagation(); onOpenChat(club); }}
          >
            <MessageCircle className="h-3 w-3" />
            {newMessageCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[0.6rem] rounded-full w-3 h-3 flex items-center justify-center">
                {newMessageCount}
              </span>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};