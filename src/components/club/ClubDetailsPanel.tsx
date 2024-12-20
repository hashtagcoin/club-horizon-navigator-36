import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { MapPin, User, Share2 } from 'lucide-react';
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
      // Get website URL from app_settings
      const { data: settings, error: settingsError } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', 'website_url')
        .single();

      if (settingsError) throw settingsError;

      const websiteUrl = settings?.value || 'https://clubpilot.lovable.dev';
      const shareText = `Check out ${selectedClub.name}!\n${selectedClub.address}\nHours: ${selectedClub.openingHours[selectedDay]}\n${websiteUrl}`;
      
      // Create SMS links for each contact
      const smsLinks = selectedContacts.map(contact => {
        const encodedMessage = encodeURIComponent(shareText);
        return `sms:${contact.tel}?body=${encodedMessage}`;
      });

      // Open SMS links in new tabs
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
    <div className="fixed top-2 right-2 w-[calc(50%-1rem)] bg-white p-2 rounded-lg shadow-md z-50">
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
            key={day}
            variant={selectedDay === ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][index] ? "default" : "outline"}
            size="sm"
            className="h-6 text-xs px-1.5"
            onClick={() => setSelectedDay(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][index])}
          >
            {day}
          </Button>
        ))}
      </div>
      <p className="mt-1 text-xs font-medium w-full text-left">
        {selectedClub.openingHours[selectedDay]}
      </p>

      <ContactSelectionModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        onShare={handleShareWithContacts}
      />
    </div>
  );
};