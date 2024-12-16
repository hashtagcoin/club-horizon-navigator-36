import { useState, useEffect } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Plus, MessageCircle, Users, X } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

interface Friend {
  id: string;
  friend_id: string;
  status: string;
  email?: string;
  online?: boolean;
}

interface GroupChat {
  id: string;
  name: string;
  members: string[];
}

export function FriendsList({ 
  isOpen, 
  onClose,
  onStartChat,
  onStartGroupChat 
}: { 
  isOpen: boolean;
  onClose: () => void;
  onStartChat: (friendId: string) => void;
  onStartGroupChat: (members: string[], name: string) => void;
}) {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [newFriendEmail, setNewFriendEmail] = useState('');
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

    const { data, error } = await supabase
      .from('friends')
      .select('*')
      .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)
      .eq('status', 'accepted');

    if (error) {
      toast({
        title: "Error fetching friends",
        description: error.message,
        variant: "destructive"
      });
      return;
    }

    setFriends(data || []);
  };

  const subscribeToPresence = () => {
    const channel = supabase.channel('online-users');
    
    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        // Update online status of friends
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

  const addFriend = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('friends')
      .insert([
        {
          user_id: user.id,
          friend_id: newFriendEmail, // This should be the user ID of the friend
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

    setNewFriendEmail('');
    toast({
      title: "Friend request sent",
      description: "They'll need to accept your request",
    });
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
    
    const { data: chat, error: chatError } = await supabase
      .from('group_chats')
      .insert([
        {
          name: chatName,
          created_by: user.id
        }
      ])
      .select()
      .single();

    if (chatError || !chat) {
      toast({
        title: "Error creating group chat",
        description: chatError?.message,
        variant: "destructive"
      });
      return;
    }

    // Add all selected friends plus the current user as members
    const members = [...selectedFriends, user.id];
    const { error: membersError } = await supabase
      .from('group_chat_members')
      .insert(
        members.map(memberId => ({
          chat_id: chat.id,
          user_id: memberId
        }))
      );

    if (membersError) {
      toast({
        title: "Error adding members",
        description: membersError.message,
        variant: "destructive"
      });
      return;
    }

    onStartGroupChat(members, chatName);
    setSelectedFriends([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-16 left-4 w-80 bg-background border rounded-lg shadow-lg p-4 z-50">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Friends</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Friend's email"
          value={newFriendEmail}
          onChange={(e) => setNewFriendEmail(e.target.value)}
        />
        <Button onClick={addFriend}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="h-[300px]">
        <div className="space-y-2">
          {friends.map((friend) => (
            <div
              key={friend.id}
              className="flex items-center justify-between p-2 hover:bg-accent rounded-lg"
            >
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarFallback>
                    {friend.email?.[0]?.toUpperCase() || '?'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{friend.email}</div>
                  <Badge variant={friend.online ? "default" : "secondary"}>
                    {friend.online ? "Online" : "Offline"}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onStartChat(friend.friend_id)}
                >
                  <MessageCircle className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedFriends(prev => 
                    prev.includes(friend.friend_id)
                      ? prev.filter(id => id !== friend.friend_id)
                      : [...prev, friend.friend_id]
                  )}
                  className={selectedFriends.includes(friend.friend_id) ? "bg-primary text-primary-foreground" : ""}
                >
                  <Users className="h-4 w-4" />
                </Button>
              </div>
            </div>
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