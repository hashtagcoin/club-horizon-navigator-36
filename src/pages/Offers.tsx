import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Tag, Ticket, Gift } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

// Function to generate daily offers based on the current date
const generateDailyOffers = () => {
  const today = new Date();
  const seed = today.toISOString().split('T')[0]; // Use date as seed
  
  const offers = [
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
      icon: Ticket,
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

  // Shuffle offers based on the date
  return offers.sort(() => {
    const random = Math.sin(Number(seed));
    return random - 0.5;
  });
};

const Offers = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: offers = [] } = useQuery({
    queryKey: ['offers', new Date().toDateString()],
    queryFn: generateDailyOffers,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });

  const handleClaim = (offerId: string) => {
    toast({
      title: "Offer Claimed!",
      description: "Check your email for the voucher.",
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex items-center p-4 bg-primary text-primary-foreground">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate(-1)}
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold">Today's Special Offers</h1>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 max-w-md mx-auto">
          {offers.map((offer) => {
            const Icon = offer.icon;
            return (
              <Card key={offer.id} className="shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xl font-bold">
                    {offer.club}
                  </CardTitle>
                  <Icon className={`h-6 w-6 ${offer.color}`} />
                </CardHeader>
                <CardContent>
                  <h3 className="font-semibold mb-2">{offer.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{offer.description}</p>
                  <Button 
                    className="w-full"
                    onClick={() => handleClaim(offer.id)}
                  >
                    Claim Offer
                  </Button>
                </CardContent>
              </Card>
            ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default Offers;