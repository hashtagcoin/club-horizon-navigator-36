import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function AddFriendForm() {
  const [newFriendEmail, setNewFriendEmail] = useState('');
  const { toast } = useToast();

  const addFriend = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('friends')
      .insert([
        {
          user_id: user.id,
          friend_id: newFriendEmail,
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

  return (
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
  );
}