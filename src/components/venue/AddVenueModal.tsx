import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useGooglePlacesAutocomplete } from "@/hooks/useGooglePlacesAutocomplete";
import { VenueHoursForm } from "./VenueHoursForm";
import { VenueAddressForm } from "./VenueAddressForm";

interface AddVenueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVenueAdded: (venue: any) => void;
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export function AddVenueModal({ isOpen, onClose, onVenueAdded }: AddVenueModalProps) {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [addressComponents, setAddressComponents] = useState({
    streetAddress: "",
    suburb: "",
    state: "",
    country: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPlace, setIsLoadingPlace] = useState(false);
  const [genres, setGenres] = useState<Record<string, string>>({});
  const [hours, setHours] = useState<Record<string, { open: string; close: string; status: string }>>({});
  const autocompleteInputRef = useRef<HTMLInputElement>(null);

  useGooglePlacesAutocomplete(isOpen, autocompleteInputRef, (place) => {
    setIsLoadingPlace(true);
    try {
      // Set venue name
      setName(place.name);

      // Set address components
      setAddressComponents({
        streetAddress: place.streetAddress,
        suburb: place.suburb,
        state: place.state,
        country: place.country
      });

      // Set opening hours
      if (place.openingHours) {
        const newHours = { ...hours };
        Object.entries(place.openingHours).forEach(([day, dayHours]) => {
          newHours[day.toLowerCase()] = {
            open: dayHours.open,
            close: dayHours.close,
            status: 'open'
          };
        });
        setHours(newHours);
      }
    } catch (error) {
      console.error('Error processing place details:', error);
      toast({
        title: "Error",
        description: "Failed to process venue details. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingPlace(false);
    }
  });

  const handleHoursChange = (day: string, type: 'open' | 'close' | 'status', value: string) => {
    setHours(prev => ({
      ...prev,
      [day.toLowerCase()]: {
        ...prev[day.toLowerCase()],
        [type]: value,
        ...(type === 'status' && value !== 'open' ? { open: '', close: '' } : {})
      }
    }));
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      // Check if club name exists
      const { data: exists } = await supabase
        .rpc('check_club_name_exists', { club_name: name });

      if (exists) {
        toast({
          title: "Club already exists",
          description: "A venue with this name already exists. Please choose a different name.",
          variant: "destructive"
        });
        return;
      }

      // Get coordinates from address
      const geocoder = new google.maps.Geocoder();
      const fullAddress = `${addressComponents.streetAddress}, ${addressComponents.suburb}, ${addressComponents.state}, ${addressComponents.country}`;
      
      const geocodeResult = await new Promise((resolve, reject) => {
        geocoder.geocode({ address: fullAddress }, (results, status) => {
          if (status === google.maps.GeocoderStatus.OK && results?.[0]) {
            resolve(results[0].geometry.location);
          } else {
            reject(new Error("Could not geocode address"));
          }
        });
      });

      const location = geocodeResult as google.maps.LatLng;

      // Prepare venue data
      const venueData = {
        name,
        address: fullAddress,
        latitude: location.lat(),
        longitude: location.lng(),
        created_by: (await supabase.auth.getUser()).data.user?.id,
        ...Object.entries(genres).reduce((acc, [day, genre]) => ({
          ...acc,
          [`${day}_genre`]: genre
        }), {}),
        ...Object.entries(hours).reduce((acc, [day, { open, close, status }]) => ({
          ...acc,
          [`${day}_hours_open`]: status === 'open' ? open : status === '24hr' ? '00:00' : null,
          [`${day}_hours_close`]: status === 'open' ? close : status === '24hr' ? '24:00' : null
        }), {})
      };

      // Insert new venue
      const { data: newVenue, error } = await supabase
        .from('user_added_venues')
        .insert(venueData)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "New venue added successfully!"
      });

      onVenueAdded(newVenue);
      onClose();
    } catch (error) {
      console.error('Error adding venue:', error);
      toast({
        title: "Error",
        description: "Failed to add venue. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Venue</DialogTitle>
          <DialogDescription>
            Search for a venue or manually enter the details below.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Venue Name</label>
            <Input
              ref={autocompleteInputRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Start typing venue name..."
              className={isLoadingPlace ? "pr-10" : ""}
            />
            {isLoadingPlace && (
              <div className="relative">
                <Loader2 className="absolute right-3 -top-8 h-4 w-4 animate-spin" />
              </div>
            )}
          </div>

          <VenueAddressForm
            addressComponents={addressComponents}
            onChange={setAddressComponents}
          />
          
          {DAYS.map(day => (
            <VenueHoursForm
              key={day}
              day={day}
              hours={hours[day.toLowerCase()] || { open: "", close: "", status: "open" }}
              genre={genres[day.toLowerCase()] || ""}
              onHoursChange={handleHoursChange}
              onGenreChange={(value) => setGenres(prev => ({ ...prev, [day.toLowerCase()]: value }))}
            />
          ))}

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Venue"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}