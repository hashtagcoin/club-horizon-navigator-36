import React, { useState, useEffect } from 'react';
import { useSpring, animated, to } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import { AddFriendForm } from './AddFriendForm';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { UserPlus, X } from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import { toast } from 'sonner';
import { FriendSelection } from './FriendSelection';
import { PrivateChat } from './PrivateChat';

export interface Friend {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'offline';
  lastSeen?: string;
}

const dummyFriends: Friend[] = [
  { id: '1', name: 'Alice Smith', status: 'online' },
  { id: '2', name: 'Bob Johnson', status: 'offline', lastSeen: '2 hours ago' },
  { id: '3', name: 'Carol Williams', status: 'online' },
  { id: '4', name: 'David Brown', status: 'offline', lastSeen: '1 day ago' },
  { id: '5', name: 'Eve Davis', status: 'online' },
];

interface FriendsListProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FriendsList({ isOpen, onClose }: FriendsListProps) {
  const [friends, setFriends] = useState<Friend[]>(dummyFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [chatMessage, setChatMessage] = useState("");
  const [messages, setMessages] = useState<Array<{ sender: string; text: string }>>([]);

  const [{ x }, api] = useSpring(() => ({
    x: 0,
    config: { tension: 200, friction: 20 }
  }));

  const bind = useDrag(({ movement: [mx], velocity: [vx], direction: [dx], cancel, active }) => {
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

  useEffect(() => {
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

  const handleToggleFriend = (friendId: string) => {
    setSelectedFriends(prev => 
      prev.includes(friendId)
        ? prev.filter(id => id !== friendId)
        : [...prev, friendId]
    );
  };

  const handleSendMessage = () => {
    if (chatMessage.trim() && selectedFriends.length > 0) {
      setMessages([...messages, { sender: 'You', text: chatMessage }]);
      setChatMessage('');
      
      // Simulate responses from selected friends
      selectedFriends.forEach((friendId, index) => {
        const friend = friends.find(f => f.id === friendId);
        if (friend) {
          setTimeout(() => {
            setMessages(prev => [...prev, {
              sender: friend.name,
              text: `Hey! This is a simulated response from ${friend.name}`
            }]);
          }, 1000 * (index + 1));
        }
      });
    }
  };

  return (
    <animated.div 
      {...bind()}
      style={{ 
        transform: to([x], (x) => `translateX(${x}px)`),
        touchAction: 'pan-y'
      }}
      className="fixed right-0 top-0 h-screen w-64 bg-background border-l border-border shadow-xl flex flex-col z-50"
    >
      <div className="flex justify-between items-center p-2 border-b">
        <h2 className="text-sm font-semibold">Friends</h2>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowAddFriend(true)}
            className="h-6 w-6"
          >
            <UserPlus className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-6 w-6"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col h-[calc(100vh-2.5rem)]">
        <ScrollArea className="flex-1">
          <div className="p-2">
            {showAddFriend ? (
              <AddFriendForm
                onAdd={handleAddFriend}
                onCancel={() => setShowAddFriend(false)}
              />
            ) : (
              <FriendSelection
                friends={friends}
                selectedFriends={selectedFriends}
                onToggleFriend={handleToggleFriend}
                onRemoveFriend={handleRemoveFriend}
              />
            )}
          </div>
        </ScrollArea>

        {selectedFriends.length > 0 && (
          <>
            <Separator />
            <div className="h-1/2 flex flex-col">
              <PrivateChat
                selectedFriends={friends.filter(f => selectedFriends.includes(f.id))}
                messages={messages}
                chatMessage={chatMessage}
                setChatMessage={setChatMessage}
                onSendMessage={handleSendMessage}
                onRemoveFriend={handleToggleFriend}
                onClose={() => setSelectedFriends([])}
              />
            </div>
          </>
        )}
      </div>
    </animated.div>
  );
}