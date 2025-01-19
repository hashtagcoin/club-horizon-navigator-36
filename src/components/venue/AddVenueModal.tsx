import { useRef, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useGooglePlacesAutocomplete } from "@/hooks/useGooglePlacesAutocomplete";
import { VenueHoursForm } from "./VenueHoursForm";
import { VenueAddressForm } from "./VenueAddressForm";
import { VenueFormHeader } from "./VenueFormHeader";
import { VenueFormActions } from "./VenueFormActions";
import { useVenueForm } from "@/hooks/useVenueForm";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

interface AddVenueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVenueAdded: (venue: any) => void;
}

export function AddVenueModal({ isOpen, onClose, onVenueAdded }: AddVenueModalProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPlace, setIsLoadingPlace] = useState(false);
  const autocompleteInputRef = useRef<HTMLInputElement>(null);

  const {
    name,
    setName,
    addressComponents,
    setAddressComponents,
    genres,
    hours,
    handleHoursChange,
    handleGenreChange
  } = useVenueForm();

  useGooglePlacesAutocomplete(isOpen, autocompleteInputRef, (place) => {
    setIsLoadingPlace(true);
    try {
      setName(place.name);
      setAddressComponents({
        streetAddress: place.streetAddress,
        suburb: place.suburb,
        state: place.state,
        country: place.country
      });

      if (place.openingHours) {
        Object.entries(place.openingHours).forEach(([day, dayHours]) => {
          handleHoursChange(day, 'open', dayHours.open);
          handleHoursChange(day, 'close', dayHours.close);
          handleHoursChange(day, 'status', 'open');
        });
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

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

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
        <VenueFormHeader
          name={name}
          onNameChange={setName}
          isLoadingPlace={isLoadingPlace}
          inputRef={autocompleteInputRef}
        />
        
        <div className="space-y-4">
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
              onGenreChange={(value) => handleGenreChange(day, value)}
            />
          ))}

          <VenueFormActions
            onClose={onClose}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}