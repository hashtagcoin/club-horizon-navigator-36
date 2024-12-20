import { Friend } from './FriendsList';
import { Checkbox } from "@/components/ui/checkbox";
import { FriendCard } from './FriendCard';

interface FriendSelectionProps {
  friends: Friend[];
  selectedFriends: string[];
  onToggleFriend: (friendId: string) => void;
  onRemoveFriend: (friendId: string) => void;
}

export function FriendSelection({ 
  friends, 
  selectedFriends, 
  onToggleFriend,
  onRemoveFriend 
}: FriendSelectionProps) {
  return (
    <div className="space-y-1">
      {friends.map((friend) => (
        <div key={friend.id} className="flex items-center gap-2">
          <Checkbox
            id={`friend-${friend.id}`}
            checked={selectedFriends.includes(friend.id)}
            onCheckedChange={() => onToggleFriend(friend.id)}
            className="h-3 w-3"
          />
          <FriendCard
            friend={friend}
            onRemove={onRemoveFriend}
            onStartChat={() => onToggleFriend(friend.id)}
          />
        </div>
      ))}
    </div>
  );
}