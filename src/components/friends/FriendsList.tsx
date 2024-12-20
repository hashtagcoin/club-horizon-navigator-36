import { useState } from 'react';
import { useSpring, animated, to } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import { FriendCard } from './FriendCard';
import { AddFriendForm } from './AddFriendForm';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { UserPlus, Users, X } from 'lucide-react';
import { ChatWindow } from '../chat/ChatWindow';
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from 'sonner';

export interface Friend {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'offline';
  lastSeen?: string;
  selected?: boolean;
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
  onClose: () => void;  // Add onClose prop
}

export function FriendsList({ isOpen, onClose }: FriendsListProps) {
  const [friends, setFriends] = useState<Friend[]>(dummyFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [showGroupChatButton, setShowGroupChatButton] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  // Configure spring animation
  const [{ x }, api] = useSpring(() => ({
    x: 0,
    config: { tension: 200, friction: 20 }
  }));

  // Setup drag gesture
  const bind = useDrag(({ movement: [mx], velocity: [vx], direction: [dx], cancel, active }) => {
    // If dragged more than 100px to the right or with high velocity
    if ((active && mx > 100) || (vx > 0.5 && dx > 0)) {
      cancel();
      api.start({ x: 400, immediate: false });
      setTimeout(onClose, 200);
    } else {
      api.start({ 
        x: active ? mx : 0,
        immediate: active
      });
    }
  }, {
    axis: 'x',
    bounds: { left: 0 },
    rubberband: true
  });

  // Update spring when isOpen changes
  React.useEffect(() => {
    api.start({ x: isOpen ? 0 : 400, immediate: false });
  }, [isOpen, api]);

  const handleAddFriend = (newFriend: Friend) => {
    setFriends([...friends, newFriend]);
    setShowAddFriend(false);
    toast.success('Friend added successfully!');
  };

  const handleRemoveFriend = (friendId: string) => {
    setFriends(friends.filter(friend => friend.id !== friendId));
    setSelectedFriends(selectedFriends.filter(id => id !== friendId));
    toast.success('Friend removed');
  };

  const handleFriendSelect = (friendId: string) => {
    setSelectedFriends(prev => {
      const newSelection = prev.includes(friendId)
        ? prev.filter(id => id !== friendId)
        : [...prev, friendId];
      setShowGroupChatButton(newSelection.length > 1);
      return newSelection;
    });
  };

  const startGroupChat = () => {
    const selectedNames = friends
      .filter(friend => selectedFriends.includes(friend.id))
      .map(friend => friend.name)
      .join(', ');
    toast.success(`Started group chat with ${selectedNames}`);
    setChatOpen(true);
  };

  return (
    <animated.div 
      {...bind()}
      style={{ 
        transform: to([x], (x) => `translateX(${x}px)`),
        touchAction: 'pan-y'
      }}
      className="fixed right-0 top-0 h-screen w-80 bg-background border-l border-border shadow-xl flex flex-col z-50"
    >
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-semibold">Friends</h2>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
          {showGroupChatButton && (
            <Button
              variant="outline"
              size="icon"
              onClick={startGroupChat}
              className="animate-fade-in h-8 w-8"
            >
              <Users className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowAddFriend(true)}
            className="h-8 w-8"
          >
            <UserPlus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col h-[calc(100vh-4rem)]">
        <div className="flex-1 overflow-hidden">
          {showAddFriend ? (
            <div className="p-4">
              <AddFriendForm
                onAdd={handleAddFriend}
                onCancel={() => setShowAddFriend(false)}
              />
            </div>
          ) : (
            <ScrollArea className="h-full p-4">
              <div className="space-y-2">
                {friends.map((friend) => (
                  <div key={friend.id} className="flex items-center gap-2">
                    <Checkbox
                      checked={selectedFriends.includes(friend.id)}
                      onCheckedChange={() => handleFriendSelect(friend.id)}
                      id={`friend-${friend.id}`}
                    />
                    <div className="flex-1">
                      <FriendCard
                        friend={friend}
                        onRemove={handleRemoveFriend}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        {chatOpen && (
          <div className="h-1/2 border-t border-border">
            <ChatWindow
              isGeneralChat={false}
              chatClub={null}
              chatMessage=""
              setChatMessage={() => {}}
              allMessages={[]}
              onClose={() => setChatOpen(false)}
              onSend={() => {}}
              clubs={[]}
              messageOpacities={{}}
              chatScrollRef={null}
            />
          </div>
        )}
      </div>
    </animated.div>
  );
}
