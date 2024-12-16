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
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // First get friends where the user is the requester
    const { data: sentFriends, error: sentError } = await supabase
      .from('friends')
      .select(`
        id,
        friend_id,
        status,
        profile:profiles!friend_id(
          username,
          avatar_url,
          favorite_club,
          last_seen
        )
      `)
      .eq('user_id', user.id)
      .eq('status', 'accepted');

    // Then get friends where the user is the recipient
    const { data: receivedFriends, error: receivedError } = await supabase
      .from('friends')
      .select(`
        id,
        friend_id,
        status,
        profile:profiles!user_id(
          username,
          avatar_url,
          favorite_club,
          last_seen
        )
      `)
      .eq('friend_id', user.id)
      .eq('status', 'accepted');

    if (sentError || receivedError) {
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
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await channel.track({
              user_id: user.id,
              online_at: new Date().toISOString(),
            });
          }
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

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const chatName = `Group Chat (${selectedFriends.length + 1})`;
    onStartGroupChat(selectedFriends, chatName);
    setSelectedFriends([]);
  };

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
