import { useState, useEffect } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Friend, FriendsListProps } from './types';
import { AddFriendForm } from './AddFriendForm';
import { FriendCard } from './FriendCard';

export function FriendsList({ 
  isOpen, 
  onClose,
  onStartChat,
  onStartGroupChat 
}: FriendsListProps) {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchFriends();
      subscribeToPresence();
    }
  }, [isOpen]);

  const fetchFriends = async () => {
    // Use test user ID for development
    const testUserId = '00000000-0000-0000-0000-000000000004';
    console.log('Using test user ID:', testUserId);

    // First get friends where the user is the requester
    const { data: sentFriends, error: sentError } = await supabase
      .from('friends')
      .select(`
        id,
        friend_id,
        status,
        profile:profiles!friends_friend_id_fkey(
          username,
          avatar_url,
          favorite_club,
          last_seen
        )
      `)
      .eq('user_id', testUserId)
      .eq('status', 'accepted');

    console.log('Sent friends query result:', { sentFriends, sentError });

    // Then get friends where the user is the recipient
    const { data: receivedFriends, error: receivedError } = await supabase
      .from('friends')
      .select(`
        id,
        friend_id,
        status,
        profile:profiles!friends_friend_id_fkey(
          username,
          avatar_url,
          favorite_club,
          last_seen
        )
      `)
      .eq('friend_id', testUserId)
      .eq('status', 'accepted');

    console.log('Received friends query result:', { receivedFriends, receivedError });

    if (sentError || receivedError) {
      console.error('Error fetching friends:', { sentError, receivedError });
      toast({
        title: "Error fetching friends",
        description: sentError?.message || receivedError?.message,
        variant: "destructive"
      });
      return;
    }

    const allFriends = [
      ...(sentFriends || []),
      ...(receivedFriends || [])
    ];

    console.log('All friends combined:', allFriends);
    setFriends(allFriends as Friend[]);
  };

  const subscribeToPresence = () => {
    const channel = supabase.channel('online-users');
    
    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        setFriends(prev => prev.map(friend => ({
          ...friend,
          online: Boolean(state[friend.friend_id])
        })));
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          // Use test user ID for development
          const testUserId = '00000000-0000-0000-0000-000000000004';
          await channel.track({
            user_id: testUserId,
            online_at: new Date().toISOString(),
          });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const createGroupChat = async () => {
    if (selectedFriends.length < 2) {
      toast({
        title: "Select at least 2 friends",
        description: "Group chats need at least 3 participants including you",
        variant: "destructive"
      });
      return;
    }

    // Use test user ID for development
    const testUserId = '00000000-0000-0000-0000-000000000004';

    const chatName = `Group Chat (${selectedFriends.length + 1})`;
    onStartGroupChat(selectedFriends, chatName);
    setSelectedFriends([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-16 left-4 w-80 bg-background border rounded-lg shadow-lg p-4 z-50">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Club Pilot Friends</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <AddFriendForm />

      <ScrollArea className="h-[300px]">
        <div className="space-y-2">
          {friends.map((friend) => (
            <FriendCard
              key={friend.id}
              friend={friend}
              isSelected={selectedFriends.includes(friend.friend_id)}
              onSelect={() => setSelectedFriends(prev => 
                prev.includes(friend.friend_id)
                  ? prev.filter(id => id !== friend.friend_id)
                  : [...prev, friend.friend_id]
              )}
              onStartChat={() => onStartChat(friend.friend_id)}
            />
          ))}
          {friends.length === 0 && (
            <div className="text-center text-muted-foreground p-4">
              No friends yet. Add some friends above!
            </div>
          )}
        </div>
      </ScrollArea>

      {selectedFriends.length > 0 && (
        <div className="mt-4">
          <Button onClick={createGroupChat} className="w-full">
            Create Group Chat ({selectedFriends.length + 1} people)
          </Button>
        </div>
      )}
    </div>
  );
}