import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { MapPin, User, Share2, Gift } from 'lucide-react';
import { Club } from '@/types/club';
import { ContactSelectionModal } from '../contact/ContactSelectionModal';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ClubDetailsPanelProps {
  selectedClub: Club | null;
  selectedDay: string;
  setSelectedDay: (day: string) => void;
}

export const ClubDetailsPanel = ({
  selectedClub,
  selectedDay,
  setSelectedDay
}: ClubDetailsPanelProps) => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const { toast } = useToast();

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

  return (
    <div className="fixed right-2 top-[7rem] w-[calc(50%-1rem)] lg:w-[calc(50%-2rem)] max-w-md z-[1000] bg-white p-2 rounded-lg shadow-md">
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
      <p className="mt-1 text-xs font-medium w-full text-left">
        {selectedClub.openingHours[selectedDay]}
      </p>
      
      {selectedClub.hasSpecial && (
        <div className="mt-2 bg-yellow-50 p-2 rounded-md border border-yellow-200">
          <div className="flex items-center gap-1 text-yellow-700">
            <Gift className="h-4 w-4" />
            <span className="text-xs font-medium">Special Offer</span>
          </div>
          <p className="text-xs text-yellow-800 mt-1">2 for 1 drinks before 11 PM</p>
        </div>
      )}

      <ContactSelectionModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        onShare={handleShareWithContacts}
      />
    </div>
  );
};