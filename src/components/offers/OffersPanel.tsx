import React from 'react';
import { useSpring, animated, to } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Tag, Gift } from 'lucide-react';
import { useQuery } from "@tanstack/react-query";
import { toast } from 'sonner';

interface OffersPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const generateDailyOffers = () => {
  const today = new Date();
  const seed = today.toISOString().split('T')[0];
  
  return [
    {
      id: `${seed}-1`,
      title: "2 for 1 Cocktails",
      description: "Buy one cocktail, get one free!",
      club: "Skybar Lounge",
      icon: Tag,
      color: "text-pink-500"
    },
    {
      id: `${seed}-2`,
      title: "Free Entry Before 11PM",
      description: "Skip the cover charge with early arrival",
      club: "Club Nova",
      icon: Gift,
      color: "text-purple-500"
    },
    {
      id: `${seed}-3`,
      title: "VIP Table Discount",
      description: "20% off VIP table bookings",
      club: "Luxe Nightclub",
      icon: Gift,
      color: "text-blue-500"
    }
  ];
};

export function OffersPanel({ isOpen, onClose }: OffersPanelProps) {
  const [{ x }, api] = useSpring(() => ({
    x: 0,
    config: { tension: 200, friction: 20 }
  }));

  const bind = useDrag(({ movement: [mx], velocity: [vx], direction: [dx], cancel, active }) => {
    if ((active && mx > 100) || (vx > 0.5 && dx > 0)) {
      cancel();
      api.start({ x: 400, immediate: false });
      setTimeout(onClose, 200);
    } else {
      api.start({ 
        x: active ? mx : 0,
        immediate: active
      });
    }
  }, {
    axis: 'x',
    bounds: { left: 0 },
    rubberband: true
  });

  React.useEffect(() => {
    api.start({ x: isOpen ? 0 : 400, immediate: false });
  }, [isOpen, api]);

  const { data: offers = [] } = useQuery({
    queryKey: ['offers', new Date().toDateString()],
    queryFn: generateDailyOffers,
    staleTime: 24 * 60 * 60 * 1000,
  });

  const handleClaim = (offerId: string) => {
    toast.success("Offer claimed! Check your email for the voucher.");
  };

  return (
    <animated.div 
      {...bind()}
      style={{ 
        transform: to([x], (x) => `translateX(${x}px)`),
        touchAction: 'pan-y'
      }}
      className="fixed right-0 top-0 h-screen w-64 bg-black border-l border-white/10 shadow-xl flex flex-col z-50"
    >
      <div className="bg-black/90 text-white p-4 flex items-center justify-between border-b border-white/10">
        <h2 className="font-semibold">Special Offers</h2>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-white hover:bg-white/10"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4 bg-black">
        <div className="space-y-4">
          {offers.map((offer) => {
            const Icon = offer.icon;
            return (
              <Card key={offer.id} className="bg-black/50 border border-white/20 text-white hover:bg-black/70 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-bold">
                    {offer.club}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${offer.color}`} />
                </CardHeader>
                <CardContent>
                  <h3 className="font-semibold text-sm mb-1">{offer.title}</h3>
                  <p className="text-xs text-gray-400 mb-3">{offer.description}</p>
                  <Button 
                    size="sm"
                    className="w-full text-xs bg-white/10 hover:bg-white/20 text-white"
                    onClick={() => handleClaim(offer.id)}
                  >
                    Claim Offer
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </ScrollArea>
    </animated.div>
  );
}