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
      className={`flex items-center p-2 hover:bg-white/5 transition-colors cursor-pointer ${
        isSelected ? 'bg-green-100 dark:bg-green-900/30' : ''
      }`}
      onClick={() => onToggle(friend)}
    >
      <div className="flex items-center gap-2">
        <div className="relative">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="text-xs bg-white/10 text-white">
              {friend.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span 
            className={`absolute bottom-0 right-0 h-2 w-2 rounded-full border-2 border-black ${
              friend.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
            }`}
          />
        </div>
        <span className="text-xs font-medium truncate max-w-[100px] text-white">
          {friend.name}
        </span>
      </div>
    </div>
  );
}