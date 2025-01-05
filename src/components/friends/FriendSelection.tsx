import { Friend } from './FriendsList';
import { FriendCard } from './FriendCard';

interface FriendSelectionProps {
  friends: Friend[];
  selectedFriends: string[];
  onToggleFriend: (friendId: string) => void;
}

export function FriendSelection({ 
  friends, 
  selectedFriends, 
  onToggleFriend 
}: FriendSelectionProps) {
  return (
    <div className="space-y-1">
      {friends.map((friend) => (
        <FriendCard
          key={friend.id}
          friend={friend}
          isSelected={selectedFriends.includes(friend.id)}
          onToggle={(friend) => onToggleFriend(friend.id)}
        />
      ))}
    </div>
  );
}