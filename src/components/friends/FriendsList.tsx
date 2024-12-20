import { useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { FriendCard } from './FriendCard';
import { AddFriendForm } from './AddFriendForm';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { UserPlus } from 'lucide-react';

export interface Friend {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'offline';
  lastSeen?: string;
}

// Dummy data for testing
const dummyFriends: Friend[] = [
  { id: '1', name: 'Alice Smith', status: 'online' },
  { id: '2', name: 'Bob Johnson', status: 'offline', lastSeen: '2 hours ago' },
  { id: '3', name: 'Carol Williams', status: 'online' },
  { id: '4', name: 'David Brown', status: 'offline', lastSeen: '1 day ago' },
  { id: '5', name: 'Eve Davis', status: 'online' },
];

interface FriendsListProps {
  isOpen: boolean;
}

export function FriendsList({ isOpen }: FriendsListProps) {
  const [friends, setFriends] = useState<Friend[]>(dummyFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);

  const springProps = useSpring({
    transform: isOpen ? 'translateX(0%)' : 'translateX(100%)',
    opacity: isOpen ? 1 : 0,
  });

  const handleAddFriend = (newFriend: Friend) => {
    setFriends([...friends, newFriend]);
    setShowAddFriend(false);
  };

  const handleRemoveFriend = (friendId: string) => {
    setFriends(friends.filter(friend => friend.id !== friendId));
  };

  return (
    <animated.div 
      style={springProps}
      className="fixed right-0 top-0 h-screen w-80 bg-background border-l border-border shadow-xl p-4 z-50"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Friends</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowAddFriend(true)}
        >
          <UserPlus className="h-5 w-5" />
        </Button>
      </div>

      {showAddFriend ? (
        <AddFriendForm
          onAdd={handleAddFriend}
          onCancel={() => setShowAddFriend(false)}
        />
      ) : (
        <ScrollArea className="h-[calc(100vh-8rem)]">
          <div className="space-y-2">
            {friends.map((friend) => (
              <FriendCard
                key={friend.id}
                friend={friend}
                onRemove={handleRemoveFriend}
              />
            ))}
          </div>
        </ScrollArea>
      )}
    </animated.div>
  );
}