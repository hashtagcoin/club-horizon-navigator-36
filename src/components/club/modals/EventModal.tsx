import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Event } from '@/types/club';
import { useToast } from "@/hooks/use-toast";

interface EventModalProps {
  selectedEvent: Event | null;
  onClose: () => void;
}

export const EventModal = ({ selectedEvent, onClose }: EventModalProps) => {
  const { toast } = useToast();

  if (!selectedEvent) return null;

  return (
    <Dialog open={!!selectedEvent} onOpenChange={onClose}>
      <DialogContent className="p-0 max-w-2xl w-[90vw] rounded-xl overflow-hidden">
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
                  onClose();
                }}
              >
                Buy Tickets - {selectedEvent.price}
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 bg-white/50 text-black border-white hover:bg-white/40"
                onClick={onClose}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};