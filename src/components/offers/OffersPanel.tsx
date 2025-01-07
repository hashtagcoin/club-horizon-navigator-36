import { useState } from "react";
import { animated, useSpring } from "@react-spring/web";
import { useGesture } from "@use-gesture/react";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Beer, Gift, Music, PartyPopper, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const offers = [
  {
    id: 1,
    club: "Club Horizon",
    title: "2 for 1 Drinks",
    description: "Buy one get one free on all drinks before 11 PM",
    icon: Beer,
  },
  {
    id: 2,
    club: "Skyline Lounge",
    title: "Free Entry",
    description: "Free entry before 10 PM with online registration",
    icon: PartyPopper,
  },
  {
    id: 3,
    club: "Beat Box",
    title: "VIP Access",
    description: "Upgrade to VIP for free with group booking",
    icon: Gift,
  },
  {
    id: 4,
    club: "Rhythm Room",
    title: "Live Band Night",
    description: "Special discount on live band performances",
    icon: Music,
  },
];

interface OffersPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OffersPanel({ isOpen, onClose }: OffersPanelProps) {
  const { toast } = useToast();
  
  const [{ x }, api] = useSpring(() => ({
    x: isOpen ? 0 : 100,
    config: { tension: 300, friction: 30 }
  }));

  const bindGesture = useGesture(
    {
      onDrag: ({ down, movement: [mx] }) => {
        if (mx > 0) {
          api.start({ x: down ? mx : 0 });
        }
      },
      onDragEnd: ({ movement: [mx] }) => {
        if (mx > 100) {
          onClose();
        } else {
          api.start({ x: 0 });
        }
      },
    },
    {
      drag: {
        from: () => [x.get(), 0],
        bounds: { left: 0 },
        rubberband: true,
      },
    }
  );

  const handleClaim = async (offerId: number) => {
    try {
      toast({
        title: "Offer Claimed!",
        description: "Check your email for the offer details.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to claim offer. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <animated.div
      {...bindGesture()}
      style={{
        transform: x.to(value => `translateX(${value}%)`),
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
                  <Icon className="h-4 w-4 text-white/70" />
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