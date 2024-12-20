import { Friend } from './FriendsList';
import { Button } from "@/components/ui/button";
import { MessageSquare, UserMinus } from 'lucide-react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from 'sonner';

interface FriendCardProps {
  friend: Friend;
  onRemove: (id: string) => void;
}

export function FriendCard({ friend, onRemove }: FriendCardProps) {
  const handleStartChat = () => {
    toast.success(`Started chat with ${friend.name}`);
  };

  return (
    <div className="flex items-center justify-between p-3 bg-card rounded-lg hover:bg-accent/50 transition-colors">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar>
            <AvatarFallback>{friend.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <span 
            className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${
              friend.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
            }`}
          />
        </div>
        <div>
          <h3 className="font-medium">{friend.name}</h3>
          <p className="text-xs text-muted-foreground">
            {friend.status === 'online' ? 'Online' : `Last seen ${friend.lastSeen}`}
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleStartChat}
        >
          <MessageSquare className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemove(friend.id)}
        >
          <UserMinus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}