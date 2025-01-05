import { Friend } from './FriendsList';
import { Button } from "@/components/ui/button";
import { MessageSquare, UserMinus } from 'lucide-react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface FriendCardProps {
  friend: Friend;
  onRemove: (id: string) => void;
  onStartChat: (friend: Friend) => void;
}

export function FriendCard({ friend, onRemove, onStartChat }: FriendCardProps) {
  return (
    <div className="flex items-center justify-between p-2 hover:bg-accent/50 transition-colors">
      <div className="flex items-center gap-2">
        <div className="relative">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="text-xs">
              {friend.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span 
            className={`absolute bottom-0 right-0 h-2 w-2 rounded-full border-2 border-background ${
              friend.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
            }`}
          />
        </div>
        <span className="text-xs font-medium truncate max-w-[100px]">
          {friend.name}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => onStartChat(friend)}
        >
          <MessageSquare className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => onRemove(friend.id)}
        >
          <UserMinus className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}