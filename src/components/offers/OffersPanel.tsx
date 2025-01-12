import { useState } from "react";
import { animated, useSpring } from "@react-spring/web";
import { useGesture } from "@use-gesture/react";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Beer, Gift, Music, X, Ticket, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const offers = [
  {
    id: 1,
    club: "Club Horizon",
    title: "2 for 1 Cocktails",
    description: "Buy one cocktail, get one free before 11 PM",
    icon: Beer,
    color: "text-pink-500"
  },
  {
    id: 2,
    club: "Skyline Lounge",
    title: "Free Entry",
    description: "Skip the cover charge with early arrival",
    icon: Ticket,
    color: "text-purple-500"
  },
  {
    id: 3,
    club: "Beat Box",
    title: "VIP Table Discount",
    description: "20% off VIP table bookings tonight only",
    icon: Star,
    color: "text-yellow-500"
  },
  {
    id: 4,
    club: "Rhythm Room",
    title: "Live Band Special",
    description: "Free welcome drink with live band ticket",
    icon: Music,
    color: "text-blue-500"
  },
  {
    id: 5,
    club: "Club Nova",
    title: "Birthday Special",
    description: "Free bottle of champagne for birthday groups",
    icon: Gift,
    color: "text-green-500"
  }
];

interface OffersPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OffersPanel({ isOpen, onClose }: OffersPanelProps) {
  const { toast } = useToast();
  console.log('OffersPanel isOpen:', isOpen); // Debug log
  
  const [{ x }, api] = useSpring(() => ({
    x: isOpen ? 0 : 100,
    config: { tension: 300, friction: 30 }
  }));

  const bind = useGesture({
    onDrag: ({ down, movement: [mx], velocity: [vx], direction: [dx], cancel }) => {
      if (mx > 0) {
        api.start({ x: down ? mx : 0 });
        if (mx > 100 && Math.abs(vx) > 0.2) {
          cancel();
          api.start({ 
            x: 400,
            immediate: false,
            config: { tension: 200, friction: 25 },
            onRest: () => onClose()
          });
        }
      }
    }
  }, {
    drag: {
      from: () => [x.get(), 0],
      bounds: { left: 0 },
      rubberband: true
    }
  });

  const handleClaim = (offerId: number) => {
    toast({
      title: "Offer Claimed!",
      description: "Check your email for the voucher.",
    });
  };

  if (!isOpen) return null;

  return (
    <animated.div
      {...bind()}
      style={{
        transform: x.to(value => `translateX(${value}%)`),
        touchAction: 'pan-y'
      }}
      className="fixed right-0 top-0 h-screen w-80 bg-black border-l border-white/10 shadow-xl flex flex-col z-40"
    >
      <div className="bg-black/90 text-white p-4 flex items-center justify-between border-b border-white/10">
        <h2 className="font-semibold text-lg">Today's Special Offers</h2>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-white hover:bg-white/10"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {offers.map((offer) => {
            const Icon = offer.icon;
            return (
              <Card key={offer.id} className="bg-black/50 border border-white/20 text-white hover:bg-black/70 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-bold">
                    {offer.club}
                  </CardTitle>
                  <Icon className={`h-5 w-5 ${offer.color}`} />
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