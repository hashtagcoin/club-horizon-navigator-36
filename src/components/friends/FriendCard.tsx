import { Friend } from './FriendsList';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface FriendCardProps {
  friend: Friend;
  isSelected: boolean;
  onToggle: (friend: Friend) => void;
}

export function FriendCard({ friend, isSelected, onToggle }: FriendCardProps) {
  return (
    <div 
      className={`flex items-center p-2 hover:bg-accent/50 transition-colors cursor-pointer ${
        isSelected ? 'bg-accent/50' : ''
      }`}
      onClick={() => onToggle(friend)}
    >
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
    </div>
  );
}