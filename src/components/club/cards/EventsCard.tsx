import { Button } from "@/components/ui/button";
import { Ticket } from 'lucide-react';

interface Event {
  id: number;
  title: string;
  image: string;
  description: string;
  date: string;
  price: string;
}

interface EventsCardProps {
  randomEvent: Event;
  onEventSelect: (event: Event) => void;
}

export const EventsCard = ({
  randomEvent,
  onEventSelect
}: EventsCardProps) => {
  return (
    <div className="rounded-lg shadow-md overflow-hidden">
      <div className="relative aspect-[3/2] w-full">
        <img 
          src={randomEvent.image} 
          alt={randomEvent.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h4 className="font-semibold text-lg mb-1">{randomEvent.title}</h4>
          <p className="text-sm mb-2">{randomEvent.date}</p>
          <Button 
            onClick={() => onEventSelect(randomEvent)}
            className="w-full bg-white/20 backdrop-blur-sm hover:bg-white/30"
          >
            <Ticket className="w-4 h-4 mr-2" />
            Get Tickets
          </Button>
        </div>
      </div>
    </div>
  );
};