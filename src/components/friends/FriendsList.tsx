import React, { useState, useEffect } from 'react';
import { useSpring, animated, to } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import { AddFriendForm } from './AddFriendForm';
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from 'sonner';
import { FriendSelection } from './FriendSelection';
import { PrivateChat } from './PrivateChat';
import { FriendsHeader } from './FriendsHeader';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { UserProfile } from './user-profile';

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
  const [viewingFriend, setViewingFriend] = useState<Friend | null>(null);

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

  const handleToggleFriend = (friendId: string) => {
    setSelectedFriends(prev => 
      prev.includes(friendId)
        ? prev.filter(id => id !== friendId)
        : [...prev, friendId]
    );
  };

  const handleRemoveFriend = () => {
    if (viewingFriend) {
      setFriends(prev => prev.filter(f => f.id !== viewingFriend.id));
      setSelectedFriends(prev => prev.filter(id => id !== viewingFriend.id));
      setViewingFriend(null);
    }
  };

  const handleShowProfile = (friend: Friend) => {
    setViewingFriend(friend);
  };

  const handleSendMessage = () => {
    if (chatMessage.trim() && selectedFriends.length > 0) {
      setMessages([...messages, { sender: 'You', text: chatMessage }]);
      setChatMessage('');
      
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
      {viewingFriend && (
        <UserProfile
          onClose={() => setViewingFriend(null)}
          isFriend={true}
          onRemoveFriend={handleRemoveFriend}
          name={viewingFriend.name}
          location="Unknown"
          memberSince="2024"
        />
      )}

      <FriendsHeader
        onAddFriend={() => setShowAddFriend(true)}
        onClose={onClose}
      />

      <ResizablePanelGroup direction="vertical" className="flex-1">
        <ResizablePanel defaultSize={60} minSize={30}>
          <ScrollArea className="h-full">
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
                />
              )}
            </div>
          </ScrollArea>
        </ResizablePanel>

        {selectedFriends.length > 0 && (
          <>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={40} minSize={20}>
              <PrivateChat
                selectedFriends={friends.filter(f => selectedFriends.includes(f.id))}
                messages={messages}
                chatMessage={chatMessage}
                setChatMessage={setChatMessage}
                onSendMessage={handleSendMessage}
                onClose={() => setSelectedFriends([])}
                onToggleFriend={handleToggleFriend}
                onShowProfile={handleShowProfile}
              />
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </animated.div>
  );
}
