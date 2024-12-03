import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ClubCard } from "@/components/ClubCard";
import { useClubData } from "@/hooks/useClubData";
import { ScrollArea } from "@/components/ui/scroll-area";

const Offers = () => {
  const navigate = useNavigate();
  const { data: clubs = [], isLoading } = useClubData();
  const clubsWithOffers = clubs.filter(club => club.hasSpecial);

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
        <h1 className="text-lg font-semibold">Special Offers</h1>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {isLoading ? (
            <div>Loading offers...</div>
          ) : clubsWithOffers.length > 0 ? (
            clubsWithOffers.map(club => (
              <ClubCard
                key={club.id}
                club={club}
                selectedDay={new Date().toLocaleString('en-us', {weekday: 'long'})}
                isSelected={false}
                onSelect={() => {}}
                onOpenChat={() => {}}
                newMessageCount={0}
              />
            ))
          ) : (
            <div className="text-center text-gray-500 mt-8">
              No special offers available at the moment
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default Offers;