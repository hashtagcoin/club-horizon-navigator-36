import { Button } from "@/components/ui/button";
import { MapPin, User, Share2, Clock } from 'lucide-react';
import { Club } from '@/types/club';
import { useToast } from "@/hooks/use-toast";

interface MainDetailsCardProps {
  selectedClub: Club;
  selectedDay: string;
  setSelectedDay: (day: string) => void;
  onShare: () => void;
}

export const MainDetailsCard = ({
  selectedClub,
  selectedDay,
  setSelectedDay,
  onShare
}: MainDetailsCardProps) => {
  const { toast } = useToast();

  const handleShare = async () => {
    const shareText = `Check out ${selectedClub.name}!\n${selectedClub.address}\nHours: ${selectedClub.openingHours[selectedDay]}\nhttps://clubpilot.lovable.dev`;

    // Try using the Web Share API first
    if (navigator.share) {
      try {
        await navigator.share({
          title: selectedClub.name,
          text: shareText,
        });
        toast({
          title: "Success",
          description: "Club details shared successfully",
        });
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          // Only show error if it's not a user cancellation
          toast({
            title: "Error",
            description: "Failed to share club details",
            variant: "destructive"
          });
        }
      }
    } else {
      // Fallback to SMS link
      const encodedMessage = encodeURIComponent(shareText);
      const smsLink = `sms:?body=${encodedMessage}`;
      window.open(smsLink, '_blank');
    }
  };

  return (
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
  );
};