import { FC } from 'react';
import { Button } from "@/components/ui/button";
import { Zap, Moon, MessageCircle, Tag, Users } from 'lucide-react';

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
  showFriendsList: boolean;
  toggleFriendsList: () => void;
  showOffers: boolean;
  toggleOffers: () => void;
}

export const BottomBar: FC<BottomBarProps> = ({
  showHighTraffic,
  setShowHighTraffic,
  sortByOpenLate,
  setSortByOpenLate,
  chatOpen,
  isGeneralChat,
  toggleGeneralChat,
  showFriendsList,
  toggleFriendsList,
  showOffers,
  toggleOffers
}) => {
  return (
    <div className="bg-primary text-primary-foreground p-2 fixed bottom-0 left-0 right-0">
      <div className="flex justify-around max-w-lg mx-auto">
        <Button
          variant="ghost"
          className={`flex flex-col items-center h-12 w-16 transition-colors hover:bg-transparent text-white hover:text-white ${
            showHighTraffic ? 'bg-[#FEF7CD] text-black [&_svg]:text-black [&_span]:text-black' : '[&_svg]:text-white [&_span]:text-white hover:[&_svg]:text-white hover:[&_span]:text-white'
          }`}
          onClick={() => setShowHighTraffic(!showHighTraffic)}
        >
          <Zap className="h-5 w-5" />
          <span className="text-[0.6rem] mt-0.5">High Traffic</span>
        </Button>
        <Button
          variant="ghost"
          className={`flex flex-col items-center h-12 w-16 transition-colors hover:bg-transparent text-white hover:text-white ${
            sortByOpenLate ? 'bg-[#FEF7CD] text-black [&_svg]:text-black [&_span]:text-black' : '[&_svg]:text-white [&_span]:text-white hover:[&_svg]:text-white hover:[&_span]:text-white'
          }`}
          onClick={() => setSortByOpenLate(!sortByOpenLate)}
        >
          <Moon className="h-5 w-5" />
          <span className="text-[0.6rem] mt-0.5">Open Late</span>
        </Button>
        <Button
          variant="ghost"
          className={`flex flex-col items-center h-12 w-16 transition-colors hover:bg-transparent text-white hover:text-white ${
            (chatOpen && isGeneralChat) ? 'bg-[#FEF7CD] text-black [&_svg]:text-black [&_span]:text-black' : '[&_svg]:text-white [&_span]:text-white hover:[&_svg]:text-white hover:[&_span]:text-white'
          }`}
          onClick={toggleGeneralChat}
        >
          <MessageCircle className="h-5 w-5" />
          <span className="text-[0.6rem] mt-0.5">Chat</span>
        </Button>
        <Button
          variant="ghost"
          className={`flex flex-col items-center h-12 w-16 transition-colors hover:bg-transparent text-white hover:text-white ${
            showOffers ? 'bg-[#FEF7CD] text-black [&_svg]:text-black [&_span]:text-black' : '[&_svg]:text-white [&_span]:text-white hover:[&_svg]:text-white hover:[&_span]:text-white'
          }`}
          onClick={toggleOffers}
        >
          <Tag className="h-5 w-5" />
          <span className="text-[0.6rem] mt-0.5">Offers</span>
        </Button>
        <Button
          variant="ghost"
          className={`flex flex-col items-center h-12 w-16 transition-colors hover:bg-transparent text-white hover:text-white ${
            showFriendsList ? 'bg-[#FEF7CD] text-black [&_svg]:text-black [&_span]:text-black' : '[&_svg]:text-white [&_span]:text-white hover:[&_svg]:text-white hover:[&_span]:text-white'
          }`}
          onClick={toggleFriendsList}
        >
          <Users className="h-5 w-5" />
          <span className="text-[0.6rem] mt-0.5">Friends</span>
        </Button>
      </div>
    </div>
  );
};