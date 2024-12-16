export interface Friend {
  id: string;
  friend_id: string;
  status: string;
  profile?: {
    username: string;
    avatar_url?: string;
    favorite_club?: string;
    last_seen?: string;
  };
}

export interface FriendsListProps {
  isOpen: boolean;
  onClose: () => void;
  onStartChat: (friendId: string) => void;
  onStartGroupChat: (members: string[], name: string) => void;
}