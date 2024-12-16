import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface AvailableUser {
  user_id: string;
  username: string;
  favorite_club?: string;
}

export function AddFriendForm() {
  const [availableUsers, setAvailableUsers] = useState<AvailableUser[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchAvailableUsers();
  }, []);

  const fetchAvailableUsers = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Get current user's friends to exclude them
    const { data: friends } = await supabase
      .from('friends')
      .select('friend_id')
      .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`);

    const friendIds = friends?.map(f => f.friend_id) || [];

    // Fetch available users excluding current user and their friends
    const { data: users, error } = await supabase
      .from('profiles')
      .select('user_id, username, favorite_club')
      .neq('user_id', user.id)
      .not('user_id', 'in', `(${friendIds.join(',')})`);

    if (error) {
      toast({
        title: "Error fetching users",
        description: error.message,
        variant: "destructive"
      });
      return;
    }

    setAvailableUsers(users || []);
  };

  const addFriend = async (friendId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('friends')
      .insert([
        {
          user_id: user.id,
          friend_id: friendId,
          status: 'pending'
        }
      ]);

    if (error) {
      toast({
        title: "Error adding friend",
        description: error.message,
        variant: "destructive"
      });
      return;
    }

    // Remove the user from the available list
    setAvailableUsers(prev => prev.filter(u => u.user_id !== friendId));
    
    toast({
      title: "Friend request sent",
      description: "They'll need to accept your request",
    });
  };

  return (
    <ScrollArea className="h-[200px] w-full">
      <div className="space-y-2">
        {availableUsers.map((user) => (
          <div 
            key={user.user_id}
            className="flex items-center justify-between p-2 hover:bg-accent rounded-lg"
          >
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarFallback>
                  {user.username?.[0]?.toUpperCase() || '?'}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{user.username || 'Unknown User'}</div>
                {user.favorite_club && (
                  <div className="text-sm text-muted-foreground">
                    Favorite: {user.favorite_club}
                  </div>
                )}
              </div>
            </div>
            <Button 
              size="sm"
              onClick={() => addFriend(user.user_id)}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        ))}
        {availableUsers.length === 0 && (
          <div className="text-center text-muted-foreground p-4">
            No available users to add
          </div>
        )}
      </div>
    </ScrollArea>
  );
}