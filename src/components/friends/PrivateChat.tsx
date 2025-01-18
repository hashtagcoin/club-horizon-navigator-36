import { Friend } from './FriendsList';
import { Button } from "@/components/ui/button";
import { X, XCircle } from 'lucide-react';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';

interface PrivateChatProps {
  selectedFriends: Friend[];
  messages: Array<{ sender: string; text: string }>;
  chatMessage: string;
  setChatMessage: (message: string) => void;
  onSendMessage: () => void;
  onClose: () => void;
  onToggleFriend: (friendId: string) => void;
  onShowProfile: (friend: Friend) => void;
}

export function PrivateChat({
  selectedFriends,
  messages,
  chatMessage,
  setChatMessage,
  onSendMessage,
  onClose,
  onToggleFriend,
  onShowProfile
}: PrivateChatProps) {
  return (
    <div className="h-full flex flex-col -translate-y-[200px]">
      <div className="p-2 bg-black text-white border-y border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-x-auto">
          {selectedFriends.map((friend) => (
            <div key={friend.id} className="flex items-center gap-1 bg-white/10 rounded-full px-2 py-1">
              <span 
                className="text-xs cursor-pointer text-white"
                onDoubleClick={() => onShowProfile(friend)}
              >
                {friend.name}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 text-white/80 hover:text-white"
                onClick={() => onToggleFriend(friend.id)}
              >
                <XCircle className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 shrink-0 text-white hover:text-white/80"
          onClick={onClose}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
      <ChatMessages messages={messages} />
      <ChatInput
        message={chatMessage}
        onMessageChange={setChatMessage}
        onSendMessage={onSendMessage}
      />
    </div>
  );
}