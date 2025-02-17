import { Club } from '@/types/club';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Music, Clock, MessageCircle, User, Smile, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { memo } from 'react';

interface ClubCardProps {
  club: Club;
  selectedDay: string;
  isSelected: boolean;
  onSelect: (club: Club) => void;
  onOpenChat: (club: Club) => void;
  newMessageCount: number;
}

const formatType = (type: string | undefined) => {
  if (!type) return 'Various';
  return type
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const formatTime = (timeString: string) => {
  if (!timeString || timeString === 'Closed') return '';
  
  const [opening, closing] = timeString.split(' - ').map(time => time.trim());
  
  if (opening === '23:59') {
    return 'Closed';
  }
  
  if (opening === '23:58') {
    return '24HR';
  }
  
  if (opening === '23:57' || closing === '23:57') {
    return 'TBC';
  }

  const formattedOpening = opening === '00:00' ? 'Midnight' : opening;
  const formattedClosing = closing === '00:00' ? 'Midnight' : closing;
  
  return `${formattedOpening}${formattedClosing ? ` - ${formattedClosing}` : ''}`;
};

export const ClubCard = memo(({
  club,
  selectedDay,
  isSelected,
  onSelect,
  onOpenChat,
  newMessageCount
}: ClubCardProps) => {
  const dayKey = selectedDay as keyof typeof club.openingHours;
  const genreValue = club.genre[dayKey];
  const openingHoursValue = club.openingHours[dayKey];

  return (
    <Card
      className={`cursor-pointer relative bg-white transition-none h-[140px] ${isSelected ? 'selected-club-card' : ''}`}
      onClick={() => onSelect(club)}
    >
      <CardHeader className="flex justify-between items-start p-2 pb-1">
        <CardTitle className="text-left text-base text-black h-[40px] leading-[1.1] line-clamp-2 max-w-[200px]">{club.name}</CardTitle>
        <div className="flex items-center gap-2">
          <div className="flex items-center space-x-0.5" aria-label={`${club.traffic} Traffic`}>
            <User className={`h-4 w-4 ${club.traffic === 'High' || club.traffic === 'Medium' || club.traffic === 'Low' ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
            <User className={`h-4 w-4 ${club.traffic === 'High' || club.traffic === 'Medium' ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
            <User className={`h-4 w-4 ${club.traffic === 'High' ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
          </div>
          {club.hasSpecial && (
            <Smile className="h-4 w-4 text-yellow-500" />
          )}
          {club.isUserAdded && (
            <Plus className="h-4 w-4 text-blue-500" />
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0 px-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <Music className="h-3 w-3 text-black" />
            <span className="text-xs text-black truncate max-w-[150px]">
              {formatType(String(genreValue))}
            </span>
          </div>
          <span className="text-xs font-medium text-black">{club.usersAtClub}</span>
        </div>
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3 text-black" />
            <span className="text-xs text-black truncate max-w-[150px]">
              {formatTime(String(openingHoursValue))}
            </span>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="relative h-6 w-6 p-0"
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
}, (prevProps, nextProps) => {
  return (
    prevProps.club.id === nextProps.club.id &&
    prevProps.club.name === nextProps.club.name &&
    prevProps.club.traffic === nextProps.club.traffic &&
    prevProps.club.hasSpecial === nextProps.club.hasSpecial &&
    prevProps.club.isUserAdded === nextProps.club.isUserAdded &&
    prevProps.club.genre[prevProps.selectedDay as keyof typeof prevProps.club.genre] === nextProps.club.genre[nextProps.selectedDay as keyof typeof nextProps.club.genre] &&
    prevProps.club.openingHours[prevProps.selectedDay as keyof typeof prevProps.club.openingHours] === nextProps.club.openingHours[nextProps.selectedDay as keyof typeof nextProps.club.openingHours] &&
    prevProps.club.usersAtClub === nextProps.club.usersAtClub &&
    prevProps.selectedDay === nextProps.selectedDay &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.newMessageCount === nextProps.newMessageCount
  );
});

ClubCard.displayName = 'ClubCard';