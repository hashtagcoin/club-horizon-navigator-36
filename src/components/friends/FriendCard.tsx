import { Friend } from './types';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle, Users } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface FriendCardProps {
  friend: Friend;
  isSelected: boolean;
  onSelect: () => void;
  onStartChat: () => void;
}

export function FriendCard({ friend, isSelected, onSelect, onStartChat }: FriendCardProps) {
  const lastSeen = friend.profile?.last_seen 
    ? formatDistanceToNow(new Date(friend.profile.last_seen), { addSuffix: true })
    : 'Never';

  return (
    <div className="flex items-center justify-between p-2 hover:bg-accent rounded-lg">
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarFallback>
            {friend.profile?.username?.[0]?.toUpperCase() || '?'}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium">{friend.profile?.username || 'Unknown User'}</div>
          <div className="text-sm text-muted-foreground">
            {friend.profile?.favorite_club && `Favorite: ${friend.profile.favorite_club}`}
          </div>
          <Badge variant={friend.status === 'accepted' ? "default" : "secondary"}>
            Last seen: {lastSeen}
          </Badge>
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onStartChat}
        >
          <MessageCircle className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onSelect}
          className={isSelected ? "bg-primary text-primary-foreground" : ""}
        >
          <Users className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}