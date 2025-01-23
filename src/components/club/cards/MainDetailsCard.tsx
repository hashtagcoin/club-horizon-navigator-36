import { Button } from "@/components/ui/button";
import { MapPin, User, Share2, Clock } from 'lucide-react';
import { Club } from '@/types/club';
import { animated } from '@react-spring/web';

interface MainDetailsCardProps {
  selectedClub: Club;
  selectedDay: string;
  setSelectedDay: (day: string) => void;
  onShare: () => void;
  bindMain: () => any;
  mainX: any;
}

export const MainDetailsCard = ({
  selectedClub,
  selectedDay,
  setSelectedDay,
  onShare,
  bindMain,
  mainX
}: MainDetailsCardProps) => {
  return (
    <animated.div 
      {...bindMain()}
      style={{ x: mainX }}
      className="bg-white p-2 rounded-lg shadow-md cursor-grab active:cursor-grabbing"
    >
      <div className="flex items-center justify-between w-full">
        <h3 className="text-base font-semibold">{selectedClub.name}</h3>
        <div className="flex items-center gap-2">
          <div className="flex items-center space-x-0.5" aria-label={`${selectedClub.traffic} Traffic`}>
            <User className={`h-4 w-4 ${selectedClub.traffic === 'High' || selectedClub.traffic === 'Medium' || selectedClub.traffic === 'Low' ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
            <User className={`h-4 w-4 ${selectedClub.traffic === 'High' || selectedClub.traffic === 'Medium' ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
            <User className={`h-4 w-4 ${selectedClub.traffic === 'High' ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 px-2"
            onClick={onShare}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex items-center space-x-1 mt-1 text-xs text-muted-foreground">
        <MapPin className="h-3 w-3" />
        <span>{selectedClub.address}</span>
      </div>
      <div className="flex space-x-0.5 mt-1 w-full">
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
          <Button
            key={['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][index]}
            variant={selectedDay === ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][index] ? "default" : "outline"}
            size="sm"
            className="h-5 text-[10px] px-1 min-w-0 flex-1"
            onClick={() => setSelectedDay(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][index])}
          >
            {day}
          </Button>
        ))}
      </div>
      <div className="mt-1 flex items-center space-x-1">
        <Clock className="h-3 w-3 text-muted-foreground" />
        <p className="text-xs font-medium">
          {selectedClub.openingHours[selectedDay]}
        </p>
      </div>
    </animated.div>
  );
};