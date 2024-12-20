import { useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { FriendCard } from './FriendCard';
import { AddFriendForm } from './AddFriendForm';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { UserPlus, Users } from 'lucide-react';
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
}

export function FriendsList({ isOpen }: FriendsListProps) {
  const [friends, setFriends] = useState<Friend[]>(dummyFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [showGroupChatButton, setShowGroupChatButton] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const springProps = useSpring({
    transform: isOpen ? 'translateX(0%)' : 'translateX(100%)',
    opacity: isOpen ? 1 : 0,
  });

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
      style={springProps}
      className="fixed right-0 top-0 h-screen w-80 bg-background border-l border-border shadow-xl flex flex-col z-50"
    >
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-semibold">Friends</h2>
        <div className="flex gap-2">
          {showGroupChatButton && (
            <Button
              variant="outline"
              size="icon"
              onClick={startGroupChat}
              className="animate-fade-in"
            >
              <Users className="h-5 w-5" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowAddFriend(true)}
          >
            <UserPlus className="h-5 w-5" />
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