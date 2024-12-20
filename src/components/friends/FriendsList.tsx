import React, { useState, useEffect } from 'react';
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
import { Separator } from "@/components/ui/separator";

export interface Friend {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'offline';
  lastSeen?: string;
  selected?: boolean;
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
  const [activeChatFriend, setActiveChatFriend] = useState<Friend | null>(null);
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
    if (activeChatFriend?.id === friendId) {
      setActiveChatFriend(null);
    }
    toast.success('Friend removed');
  };

  const handleStartChat = (friend: Friend) => {
    setActiveChatFriend(friend);
  };

  const handleSendMessage = () => {
    if (chatMessage.trim() && activeChatFriend) {
      setMessages([...messages, { sender: 'You', text: chatMessage }]);
      setChatMessage('');
      
      // Simulate friend response
      setTimeout(() => {
        setMessages(prev => [...prev, {
          sender: activeChatFriend.name,
          text: `Hey! This is a simulated response from ${activeChatFriend.name}`
        }]);
      }, 1000);
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
              <div className="space-y-1">
                {friends.map((friend) => (
                  <FriendCard
                    key={friend.id}
                    friend={friend}
                    onRemove={handleRemoveFriend}
                    onStartChat={handleStartChat}
                  />
                ))}
              </div>
            )}
          </div>
        </ScrollArea>

        {activeChatFriend && (
          <>
            <Separator />
            <div className="h-1/2 flex flex-col">
              <div className="p-2 bg-primary/5 border-y flex items-center justify-between">
                <span className="text-xs font-medium">{activeChatFriend.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setActiveChatFriend(null)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              <ScrollArea className="flex-1 p-2">
                <div className="space-y-2">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex flex-col ${
                        message.sender === 'You' ? 'items-end' : 'items-start'
                      }`}
                    >
                      <span className="text-[10px] text-muted-foreground">
                        {message.sender}
                      </span>
                      <div
                        className={`rounded-lg px-2 py-1 text-xs max-w-[80%] ${
                          message.sender === 'You'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        {message.text}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="p-2 border-t flex gap-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Type a message..."
                  className="flex-1 text-xs bg-transparent border-none focus:outline-none"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={handleSendMessage}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-3 w-3"
                  >
                    <path d="m22 2-7 20-4-9-9-4Z" />
                    <path d="M22 2 11 13" />
                  </svg>
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </animated.div>
  );
}