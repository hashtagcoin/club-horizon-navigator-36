import { FC, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Zap, Moon, MessageCircle, Smile, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FriendsList } from '../friends/FriendsList';

interface BottomBarProps {
  showHighTraffic: boolean;
  setShowHighTraffic: (value: boolean) => void;
  sortByOpenLate: boolean;
  setSortByOpenLate: (value: boolean) => void;
  showSpecials: boolean;
  setShowSpecials: (value: boolean) => void;
  chatOpen: boolean;
  isGeneralChat: boolean;
  toggleGeneralChat: () => void;
}

export const BottomBar: FC<BottomBarProps> = ({
  showHighTraffic,
  setShowHighTraffic,
  sortByOpenLate,
  setSortByOpenLate,
  chatOpen,
  isGeneralChat,
  toggleGeneralChat
}) => {
  const navigate = useNavigate();
  const [showFriendsList, setShowFriendsList] = useState(false);

  const handleStartChat = (friendId: string) => {
    // Handle starting a private chat
    console.log('Starting chat with friend:', friendId);
  };

  const handleStartGroupChat = (members: string[], name: string) => {
    // Handle starting a group chat
    console.log('Starting group chat:', { members, name });
  };

  return (
    <div className="bg-primary text-primary-foreground p-2">
      <div className="flex justify-around">
        <Button
          variant={showHighTraffic ? "default" : "ghost"}
          className="flex flex-col items-center h-12 w-16"
          onClick={() => setShowHighTraffic(!showHighTraffic)}
        >
          <Zap className="h-5 w-5" />
          <span className="text-[0.6rem] mt-0.5">High Traffic</span>
        </Button>
        <Button
          variant={sortByOpenLate ? "default" : "ghost"}
          className="flex flex-col items-center h-12 w-16"
          onClick={() => setSortByOpenLate(!sortByOpenLate)}
        >
          <Moon className="h-5 w-5" />
          <span className="text-[0.6rem] mt-0.5">Open Late</span>
        </Button>
        <Button
          variant={chatOpen && isGeneralChat ? "default" : "ghost"}
          className="flex flex-col items-center h-12 w-16"
          onClick={toggleGeneralChat}
        >
          <MessageCircle className="h-5 w-5" />
          <span className="text-[0.6rem] mt-0.5">Chat</span>
        </Button>
        <Button
          variant="ghost"
          className="flex flex-col items-center h-12 w-16"
          onClick={() => navigate('/offers')}
        >
          <Smile className="h-5 w-5" />
          <span className="text-[0.6rem] mt-0.5">Offers</span>
        </Button>
        <Button
          variant={showFriendsList ? "default" : "ghost"}
          className="flex flex-col items-center h-12 w-16"
          onClick={() => setShowFriendsList(!showFriendsList)}
        >
          <Users className="h-5 w-5" />
          <span className="text-[0.6rem] mt-0.5">Friends</span>
        </Button>
      </div>

      <FriendsList
        isOpen={showFriendsList}
        onClose={() => setShowFriendsList(false)}
        onStartChat={handleStartChat}
        onStartGroupChat={handleStartGroupChat}
      />
    </div>
  );
};