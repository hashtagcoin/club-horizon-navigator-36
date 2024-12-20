import { Button } from "@/components/ui/button";
import { UserPlus, X } from 'lucide-react';

interface FriendsHeaderProps {
  onAddFriend: () => void;
  onClose: () => void;
}

export function FriendsHeader({ onAddFriend, onClose }: FriendsHeaderProps) {
  return (
    <div className="flex justify-between items-center p-2 border-b">
      <h2 className="text-sm font-semibold">Friends</h2>
      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={onAddFriend}
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
  );
}