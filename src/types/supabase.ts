export interface Friend {
  id: string;
  user_id: string;
  friend_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
}

export interface GroupChat {
  id: string;
  name: string;
  created_at: string;
  created_by: string;
}

export interface GroupChatMember {
  chat_id: string;
  user_id: string;
  joined_at: string;
}

export interface Message {
  id: string;
  sender_id: string;
  recipient_id?: string;
  group_chat_id?: string;
  content: string;
  created_at: string;
}