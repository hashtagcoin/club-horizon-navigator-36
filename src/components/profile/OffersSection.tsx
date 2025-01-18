import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ClaimedOffer {
  id: string;
  clubName: string;
  title: string;
  description: string;
  type: string;
  expiryDate: string;
}

interface OffersSectionProps {
  claimedOffers: ClaimedOffer[];
  selectedOffer: ClaimedOffer | null;
  onSelectOffer: (offer: ClaimedOffer) => void;
}

export function OffersSection({
  claimedOffers,
  selectedOffer,
  onSelectOffer
}: OffersSectionProps) {
  const isOfferValid = (expiryDate: string) => {
    return new Date(expiryDate) > new Date();
  };

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-2">Your Claimed Offers</h3>
      <ScrollArea className="h-[200px] w-full rounded-md border p-4">
        {claimedOffers.length === 0 ? (
          <p className="text-center text-muted-foreground">No claimed offers yet</p>
        ) : (
          <div className="space-y-4">
            {claimedOffers.map((offer) => (
              <Card 
                key={offer.id} 
                className={`cursor-pointer transition-colors ${
                  selectedOffer?.id === offer.id ? 'border-primary' : ''
                }`}
                onClick={() => onSelectOffer(offer)}
              >
                <CardHeader className="p-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">{offer.clubName}</h4>
                    <Badge variant={isOfferValid(offer.expiryDate) ? "default" : "destructive"}>
                      {isOfferValid(offer.expiryDate) ? "Valid" : "Expired"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <p className="text-sm">{offer.title}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}