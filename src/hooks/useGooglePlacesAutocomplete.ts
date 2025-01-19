import { useEffect, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";

interface PlaceResult {
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  openingHours?: {
    [key: string]: {
      open: string;
      close: string;
    };
  };
}

export function useGooglePlacesAutocomplete(
  isOpen: boolean,
  inputRef: React.RefObject<HTMLInputElement>,
  onPlaceSelect: (place: PlaceResult) => void
) {
  const { toast } = useToast();
  const autocompleteInstance = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    if (!isOpen || !inputRef.current) return;

    let timeoutId: NodeJS.Timeout;

    const initializeAutocomplete = () => {
      if (!window.google?.maps?.places) {
        console.log("Google Maps Places API not loaded yet, retrying in 500ms");
        timeoutId = setTimeout(initializeAutocomplete, 500);
        return;
      }

      try {
        if (autocompleteInstance.current) {
          google.maps.event.clearInstanceListeners(autocompleteInstance.current);
        }

        const options: google.maps.places.AutocompleteOptions = {
          types: ['establishment'],
          componentRestrictions: { country: 'AU' },
          fields: ['address_components', 'geometry', 'name', 'opening_hours', 'place_id']
        };

        const autocomplete = new google.maps.places.Autocomplete(
          inputRef.current,
          options
        );
        
        autocompleteInstance.current = autocomplete;

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          
          if (!place.geometry) {
            toast({
              title: "Error",
              description: "Please select a venue from the dropdown list",
              variant: "destructive"
            });
            return;
          }

          const placeResult: PlaceResult = {
            name: place.name || '',
            address: inputRef.current?.value || '',
            coordinates: {
              lat: place.geometry.location?.lat() || 0,
              lng: place.geometry.location?.lng() || 0
            }
          };

          if (place.opening_hours?.periods) {
            placeResult.openingHours = {};
            place.opening_hours.periods.forEach(period => {
              if (period.open && period.close) {
                const day = period.open.day;
                placeResult.openingHours![getDayName(day)] = {
                  open: `${period.open.time.slice(0, 2)}:00`,
                  close: `${period.close.time.slice(0, 2)}:00`
                };
              }
            });
          }

          onPlaceSelect(placeResult);
        });

        console.log("Autocomplete initialized successfully");
      } catch (error) {
        console.error("Error initializing Google Places Autocomplete:", error);
        toast({
          title: "Error",
          description: "Failed to initialize venue search. Please try again.",
          variant: "destructive"
        });
      }
    };

    initializeAutocomplete();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (autocompleteInstance.current) {
        google.maps.event.clearInstanceListeners(autocompleteInstance.current);
        autocompleteInstance.current = null;
      }
    };
  }, [isOpen, toast, onPlaceSelect]);
}

function getDayName(day: number): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[day];
}