import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Friend } from './FriendsList';
import { toast } from 'sonner';

interface AddFriendFormProps {
  onAdd: (friend: Friend) => void;
  onCancel: () => void;
}

export function AddFriendForm({ onAdd, onCancel }: AddFriendFormProps) {
  const [friendName, setFriendName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!friendName.trim()) {
      toast.error('Please enter a friend\'s name');
      return;
    }

    const newFriend: Friend = {
      id: Math.random().toString(36).substr(2, 9),
      name: friendName,
      status: 'offline',
      lastSeen: 'Just added'
    };

    onAdd(newFriend);
    toast.success('Friend added successfully!');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="friendName" className="text-sm font-medium">
          Friend's Name
        </label>
        <Input
          id="friendName"
          value={friendName}
          onChange={(e) => setFriendName(e.target.value)}
          placeholder="Enter friend's name"
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit" className="flex-1">
          Add Friend
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
}