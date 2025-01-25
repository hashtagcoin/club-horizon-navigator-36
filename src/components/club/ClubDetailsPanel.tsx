import { useState, useEffect } from 'react';
import { Club } from '@/types/club';
import { ContactSelectionModal } from '../contact/ContactSelectionModal';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { animated } from '@react-spring/web';
import { useDragToggle } from '@/hooks/useDragToggle';
import { MainDetailsCard } from './cards/MainDetailsCard';
import { SpecialsCard } from './cards/SpecialsCard';
import { EventsCard } from './cards/EventsCard';
import { EventModal } from './modals/EventModal';

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
  const [isVisible, setIsVisible] = useState(true);
  const { toast } = useToast();

  const mainDrag = useDragToggle(() => setIsVisible(false));
  const specialsDrag = useDragToggle(() => setIsVisible(false));
  const eventsDrag = useDragToggle(() => setIsVisible(false));

  useEffect(() => {
    if (selectedClub) {
      setIsVisible(true);
    }
  }, [selectedClub]);

  const handleShare = async () => {
    try {
      setIsContactModalOpen(true);
    } catch (error) {
      console.error('Error opening contact modal:', error);
      toast({
        title: "Error",
        description: "Failed to open contact selection",
        variant: "destructive"
      });
    }
  };

  const handleShareWithContacts = async (selectedContacts: { name: string, tel: string }[]) => {
    try {
      const { data: settings, error: settingsError } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', 'website_url')
        .maybeSingle();

      if (settingsError) throw settingsError;

      const websiteUrl = settings?.value || 'https://clubpilot.lovable.dev';
      const shareText = `Check out ${selectedClub?.name}!\n${selectedClub?.address}\nHours: ${selectedClub?.openingHours[selectedDay]}\n${websiteUrl}`;
      
      const smsLinks = selectedContacts.map(contact => {
        const encodedMessage = encodeURIComponent(shareText);
        return `sms:${contact.tel}?&body=${encodedMessage}`;
      });

      for (const link of smsLinks) {
        window.open(link, '_blank');
        await new Promise(resolve => setTimeout(resolve, 500));
      }

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
    } finally {
      setIsContactModalOpen(false);
    }
  };

  if (!selectedClub || !isVisible) return null;

  const randomEvent = events[Math.floor(Math.random() * events.length)];

  return (
    <div className="fixed right-2 top-[7rem] w-[calc(50%-1rem)] lg:w-[calc(50%-2rem)] max-w-md z-[1000] space-y-2">
      <animated.div
        style={{
          x: mainDrag.x,
          y: mainDrag.y,
          opacity: mainDrag.opacity
        }}
        {...mainDrag.bind()}
        className="cursor-grab active:cursor-grabbing touch-none"
      >
        <MainDetailsCard
          selectedClub={selectedClub}
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
          onShare={handleShare}
        />
      </animated.div>

      <animated.div
        style={{
          x: specialsDrag.x,
          y: specialsDrag.y,
          opacity: specialsDrag.opacity
        }}
        {...specialsDrag.bind()}
        className="cursor-grab active:cursor-grabbing touch-none"
      >
        <SpecialsCard />
      </animated.div>

      <animated.div
        style={{
          x: eventsDrag.x,
          y: eventsDrag.y,
          opacity: eventsDrag.opacity
        }}
        {...eventsDrag.bind()}
        className="cursor-grab active:cursor-grabbing touch-none"
      >
        <EventsCard
          randomEvent={randomEvent}
          onEventSelect={setSelectedEvent}
        />
      </animated.div>

      <ContactSelectionModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        onShare={handleShareWithContacts}
      />

      <EventModal
        selectedEvent={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </div>
  );
};