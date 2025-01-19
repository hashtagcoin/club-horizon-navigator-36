import { useEffect, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";

interface PlaceResult {
  name: string;
  address: string;
  streetAddress: string;
  suburb: string;
  state: string;
  country: string;
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
    if (!isOpen || !inputRef.current) {
      console.log("Hook not initialized: form closed or input ref not ready");
      return;
    }

    if (!window.google?.maps?.places) {
      console.error("Google Maps Places API not loaded");
      toast({
        title: "Error",
        description: "Maps service not available. Please try again later.",
        variant: "destructive"
      });
      return;
    }

    const initializeAutocomplete = () => {
      try {
        // Clear any existing listeners
        if (autocompleteInstance.current) {
          google.maps.event.clearInstanceListeners(autocompleteInstance.current);
        }

        const options: google.maps.places.AutocompleteOptions = {
          types: ['establishment'],
          componentRestrictions: { country: 'AU' },
          fields: ['address_components', 'geometry', 'name', 'opening_hours', 'formatted_address']
        };

        autocompleteInstance.current = new google.maps.places.Autocomplete(
          inputRef.current!,
          options
        );

        console.log("Autocomplete instance created successfully");

        autocompleteInstance.current.addListener('place_changed', handlePlaceSelection);
        
      } catch (error) {
        console.error("Error initializing autocomplete:", error);
        toast({
          title: "Error",
          description: "Failed to initialize venue search. Please refresh and try again.",
          variant: "destructive"
        });
      }
    };

    const handlePlaceSelection = () => {
      if (!autocompleteInstance.current) {
        console.error("Autocomplete instance not found");
        return;
      }

      try {
        const place = autocompleteInstance.current.getPlace();
        console.log("Raw place data:", place);

        if (!place.geometry?.location || !place.name) {
          toast({
            title: "Error",
            description: "Please select a venue from the dropdown list",
            variant: "destructive"
          });
          return;
        }

        const placeResult: PlaceResult = {
          name: place.name,
          address: place.formatted_address || '',
          streetAddress: '',
          suburb: '',
          state: '',
          country: '',
          coordinates: {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          },
          openingHours: {}
        };

        // Parse address components
        place.address_components?.forEach(component => {
          const types = component.types;
          
          if (types.includes('street_number')) {
            placeResult.streetAddress = component.long_name + ' ' + placeResult.streetAddress;
          } else if (types.includes('route')) {
            placeResult.streetAddress += component.long_name;
          } else if (types.includes('locality') || types.includes('sublocality')) {
            placeResult.suburb = component.long_name;
          } else if (types.includes('administrative_area_level_1')) {
            placeResult.state = component.short_name;
          } else if (types.includes('country')) {
            placeResult.country = component.long_name;
          }
        });

        // Parse opening hours if available
        if (place.opening_hours?.periods) {
          place.opening_hours.periods.forEach(period => {
            if (period.open && period.close) {
              const day = getDayName(period.open.day);
              placeResult.openingHours![day] = {
                open: formatTime(period.open.time),
                close: formatTime(period.close.time)
              };
            }
          });
        }

        console.log("Processed place result:", placeResult);
        onPlaceSelect(placeResult);

      } catch (error) {
        console.error("Error processing place selection:", error);
        toast({
          title: "Error",
          description: "Failed to process venue details. Please try again.",
          variant: "destructive"
        });
      }
    };

    initializeAutocomplete();

    return () => {
      if (autocompleteInstance.current) {
        google.maps.event.clearInstanceListeners(autocompleteInstance.current);
        autocompleteInstance.current = null;
        console.log("Cleaned up autocomplete instance");
      }
    };
  }, [isOpen, toast, onPlaceSelect, inputRef]);
}

function getDayName(day: number): string {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return days[day];
}

function formatTime(time: string): string {
  if (!time) return '';
  const paddedTime = time.padStart(4, '0');
  return `${paddedTime.slice(0, 2)}:${paddedTime.slice(2)}`;
}