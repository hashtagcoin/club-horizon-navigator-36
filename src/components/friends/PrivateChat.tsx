import { Friend } from './FriendsList';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { X, Send, UserMinus } from 'lucide-react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface PrivateChatProps {
  selectedFriends: Friend[];
  messages: Array<{ sender: string; text: string }>;
  chatMessage: string;
  setChatMessage: (message: string) => void;
  onSendMessage: () => void;
  onRemoveFriend: (friendId: string) => void;
  onClose: () => void;
}

export function PrivateChat({
  selectedFriends,
  messages,
  chatMessage,
  setChatMessage,
  onSendMessage,
  onRemoveFriend,
  onClose
}: PrivateChatProps) {
  return (
    <>
      <div className="p-2 bg-primary/5 border-y flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-x-auto">
          {selectedFriends.map((friend) => (
            <div key={friend.id} className="flex items-center gap-1 bg-background rounded-full px-2 py-1">
              <span className="text-xs">{friend.name}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4"
                onClick={() => onRemoveFriend(friend.id)}
              >
                <UserMinus className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 shrink-0"
          onClick={onClose}
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
              onSendMessage();
            }
          }}
          placeholder="Type a message..."
          className="flex-1 text-xs bg-transparent border-none focus:outline-none"
        />
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={onSendMessage}
        >
          <Send className="h-3 w-3" />
        </Button>
      </div>
    </>
  );
}