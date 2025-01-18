import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Beer, Gift, Music, PartyPopper, Tag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Offer {
  id: string;
  clubName: string;
  title: string;
  description: string;
  type: 'drink' | 'entry' | 'vip' | 'event';
  expiryDate: string;
}

export function OffersModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { toast } = useToast();
  const [availableOffers, setAvailableOffers] = useState<Offer[]>([]);

  useEffect(() => {
    // Mock data - in a real app this would come from an API
    const mockOffers: Offer[] = [
      {
        id: '1',
        clubName: 'Club Horizon',
        title: 'Free Entry Before 11PM',
        description: 'Skip the cover charge with early arrival',
        type: 'entry',
        expiryDate: new Date(Date.now() + 86400000).toISOString(), // 24h from now
      },
      {
        id: '2',
        clubName: 'Skyline Lounge',
        title: '2 for 1 Cocktails',
        description: 'Buy one cocktail, get one free!',
        type: 'drink',
        expiryDate: new Date(Date.now() + 86400000).toISOString(),
      },
      {
        id: '3',
        clubName: 'Beat Box',
        title: 'VIP Table Discount',
        description: '20% off VIP table bookings',
        type: 'vip',
        expiryDate: new Date(Date.now() + 86400000).toISOString(),
      },
    ];
    setAvailableOffers(mockOffers);
  }, []);

  const handleClaimOffer = (offer: Offer) => {
    const claimedOffers = JSON.parse(localStorage.getItem('claimedOffers') || '[]');
    if (!claimedOffers.some((claimed: Offer) => claimed.id === offer.id)) {
      localStorage.setItem('claimedOffers', JSON.stringify([...claimedOffers, offer]));
      toast({
        title: "Offer Claimed!",
        description: "You can view this offer in your profile.",
      });
    } else {
      toast({
        title: "Already Claimed",
        description: "You have already claimed this offer.",
        variant: "destructive",
      });
    }
  };

  const getOfferIcon = (type: string) => {
    switch (type) {
      case 'drink':
        return <Beer className="h-5 w-5 text-pink-500" />;
      case 'entry':
        return <PartyPopper className="h-5 w-5 text-purple-500" />;
      case 'vip':
        return <Gift className="h-5 w-5 text-yellow-500" />;
      case 'event':
        return <Music className="h-5 w-5 text-blue-500" />;
      default:
        return <Tag className="h-5 w-5 text-green-500" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-black text-white">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-lg font-semibold">Tonight's Special Offers</h2>
        </div>
        <ScrollArea className="h-[60vh] px-4">
          <div className="space-y-4 py-4">
            {availableOffers.map((offer) => (
              <Card key={offer.id} className="bg-white/5 border border-white/10">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {offer.clubName}
                  </CardTitle>
                  {getOfferIcon(offer.type)}
                </CardHeader>
                <CardContent>
                  <h3 className="font-semibold mb-1">{offer.title}</h3>
                  <p className="text-sm text-gray-400 mb-3">{offer.description}</p>
                  <Button 
                    onClick={() => handleClaimOffer(offer)}
                    className="w-full bg-white/10 hover:bg-white/20"
                  >
                    Claim Offer
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}