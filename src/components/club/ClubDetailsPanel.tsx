import { Button } from "@/components/ui/button";
import { MapPin, User, Share2 } from 'lucide-react';
import { Club } from '@/types/club';

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
  if (!selectedClub) return null;

  const handleShare = () => {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${selectedClub.position.lat},${selectedClub.position.lng}`;
    const shareText = `Check out ${selectedClub.name}!\n${selectedClub.address}\nHours: ${selectedClub.openingHours[selectedDay]}\n${mapsUrl}`;
    
    if (navigator.share) {
      navigator.share({
        title: selectedClub.name,
        text: shareText,
        url: mapsUrl
      }).catch((error) => console.log('Error sharing:', error));
    } else {
      const smsUrl = `sms:?body=${encodeURIComponent(shareText)}`;
      window.location.href = smsUrl;
    }
  };

  return (
    <div className="mt-2 bg-white p-2 rounded-lg shadow-md w-full relative z-[999]">
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
    </div>
  );
};