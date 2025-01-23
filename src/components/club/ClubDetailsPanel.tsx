import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { MapPin, User, Share2, Gift, Clock, Ticket } from 'lucide-react';
import { Club } from '@/types/club';
import { ContactSelectionModal } from '../contact/ContactSelectionModal';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { animated, useSpring } from '@react-spring/web';
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ClubDetailsPanelProps {
  selectedClub: Club | null;
  selectedDay: string;
  setSelectedDay: (day: string) => void;
}

const events = [
  {
    id: 1,
    title: "Fabric Australia",
    image: "/lovable-uploads/8e626242-82d7-4562-8bb0-396927ae8c8b.png",
    description: "Day & Night featuring Raresh, tINI, Harry McCanna, Jacob Husley",
    date: "26th January 2025",
    price: "$60"
  },
  {
    id: 2,
    title: "Morning Glory",
    image: "/lovable-uploads/4528f68a-ff9d-439d-8b66-d5594bbe9d82.png",
    description: "Sunday Sessions with Line Up TBC",
    date: "25th January",
    price: "$40"
  },
  {
    id: 3,
    title: "ELL BROWN",
    image: "/lovable-uploads/89f6190f-9f8d-4aa0-a8a6-e6ea56cee9e0.png",
    description: "HIJCKD with Steve Play, Anderson & Mara",
    date: "24th January",
    price: "$45"
  }
];

export const ClubDetailsPanel = ({
  selectedClub,
  selectedDay,
  setSelectedDay
}: ClubDetailsPanelProps) => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<typeof events[0] | null>(null);
  const { toast } = useToast();

  // Animation for the specials card
  const [specialsSpring, specialsApi] = useSpring(() => ({
    from: { x: 1000, opacity: 0 },
    to: { x: 0, opacity: 1 },
    config: { tension: 280, friction: 60 }
  }));

  // Animation for the events card (delayed)
  const [eventsSpring, eventsApi] = useSpring(() => ({
    from: { x: 1000, opacity: 0 },
    to: { x: 0, opacity: 1 },
    config: { tension: 280, friction: 60 },
    delay: 150 // Slight delay after specials card
  }));

  // Reset and trigger animations when selected club changes
  useEffect(() => {
    if (selectedClub) {
      specialsApi.start({
        from: { x: 1000, opacity: 0 },
        to: { x: 0, opacity: 1 }
      });
      eventsApi.start({
        from: { x: 1000, opacity: 0 },
        to: { x: 0, opacity: 1 },
        delay: 150
      });
    }
  }, [selectedClub, specialsApi, eventsApi]);

  if (!selectedClub) return null;

  const handleShare = async () => {
    setIsContactModalOpen(true);
  };

  const handleShareWithContacts = async (selectedContacts: { name: string, tel: string }[]) => {
    try {
      const { data: settings, error: settingsError } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', 'website_url')
        .single();

      if (settingsError) throw settingsError;

      const websiteUrl = settings?.value || 'https://clubpilot.lovable.dev';
      const shareText = `Check out ${selectedClub.name}!\n${selectedClub.address}\nHours: ${selectedClub.openingHours[selectedDay]}\n${websiteUrl}`;
      
      const smsLinks = selectedContacts.map(contact => {
        const encodedMessage = encodeURIComponent(shareText);
        return `sms:${contact.tel}?body=${encodedMessage}`;
      });

      smsLinks.forEach(link => window.open(link, '_blank'));

      toast({
        title: "Success",
        description: `Sharing with ${selectedContacts.length} contact${selectedContacts.length !== 1 ? 's' : ''}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
      toast({
        title: "Error",
        description: "Failed to share. Please try again.",
        variant: "destructive"
      });
    }
  };

  const randomEvent = events[Math.floor(Math.random() * events.length)];

  return (
    <div className="fixed right-2 top-[7rem] w-[calc(50%-1rem)] lg:w-[calc(50%-2rem)] max-w-md z-[1000] space-y-2">
      <div className="bg-white p-2 rounded-lg shadow-md">
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
              onClick={handleShare}
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
      </div>

      {/* Specials Card */}
      <animated.div
        style={{
          ...specialsSpring,
          background: 'linear-gradient(to right, #ee9ca7, #ffdde1)',
        }}
        className="p-4 rounded-lg shadow-md text-white"
      >
        <h4 className="font-semibold mb-2">Today's Special</h4>
        <p className="text-sm">2 for 1 on all cocktails before 11 PM!</p>
      </animated.div>

      {/* Events Card */}
      <animated.div
        style={eventsSpring}
        className="rounded-lg shadow-md overflow-hidden"
      >
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
              onClick={() => setSelectedEvent(randomEvent)}
              className="w-full bg-white/20 backdrop-blur-sm hover:bg-white/30"
            >
              <Ticket className="w-4 h-4 mr-2" />
              Get Tickets
            </Button>
          </div>
        </div>
      </animated.div>

      <ContactSelectionModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        onShare={handleShareWithContacts}
      />

      {/* Event Details Modal */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="p-0 max-w-2xl w-[90vw]">
          {selectedEvent && (
            <div className="relative">
              <img 
                src={selectedEvent.image}
                alt={selectedEvent.title}
                className="w-full aspect-[3/2] object-cover"
              />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                <h2 className="text-2xl font-bold mb-2">{selectedEvent.title}</h2>
                <p className="mb-2">{selectedEvent.description}</p>
                <p className="mb-4">{selectedEvent.date}</p>
                <div className="flex gap-4">
                  <Button 
                    className="flex-1 bg-white text-black hover:bg-white/90"
                    onClick={() => {
                      toast({
                        title: "Success!",
                        description: `Tickets purchased for ${selectedEvent.title}`,
                      });
                      setSelectedEvent(null);
                    }}
                  >
                    Buy Tickets - {selectedEvent.price}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 border-white text-white hover:bg-white/20"
                    onClick={() => setSelectedEvent(null)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
