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
    if (!isOpen || !inputRef.current || !window.google?.maps?.places) return;

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
        inputRef.current,
        options
      );

      autocompleteInstance.current.addListener('place_changed', () => {
        if (!autocompleteInstance.current) return;

        try {
          const place = autocompleteInstance.current.getPlace();
          console.log("Raw place data:", place);

          if (!place.geometry || !place.name) {
            toast({
              title: "Error",
              description: "Please select a venue from the dropdown list",
              variant: "destructive"
            });
            return;
          }

          // Initialize address component variables
          let streetNumber = '';
          let route = '';
          let suburb = '';
          let state = '';
          let country = '';

          // Parse address components
          place.address_components?.forEach(component => {
            const types = component.types;
            
            if (types.includes('street_number')) {
              streetNumber = component.long_name;
            } else if (types.includes('route')) {
              route = component.long_name;
            } else if (types.includes('locality') || types.includes('sublocality')) {
              suburb = component.long_name;
            } else if (types.includes('administrative_area_level_1')) {
              state = component.short_name;
            } else if (types.includes('country')) {
              country = component.long_name;
            }
          });

          // Parse opening hours
          const openingHours: PlaceResult['openingHours'] = {};
          
          if (place.opening_hours?.periods) {
            place.opening_hours.periods.forEach(period => {
              if (period.open && period.close) {
                const day = getDayName(period.open.day).toLowerCase();
                const openTime = formatTime(period.open.time);
                const closeTime = formatTime(period.close.time);
                
                openingHours[day] = {
                  open: openTime,
                  close: closeTime
                };
              }
            });
          }

          const placeResult: PlaceResult = {
            name: place.name,
            address: place.formatted_address || '',
            streetAddress: streetNumber ? `${streetNumber} ${route}` : route,
            suburb,
            state,
            country,
            coordinates: {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng()
            },
            openingHours
          };

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

    return () => {
      if (autocompleteInstance.current) {
        google.maps.event.clearInstanceListeners(autocompleteInstance.current);
        autocompleteInstance.current = null;
      }
    };
  }, [isOpen, toast, onPlaceSelect]);
}

function getDayName(day: number): string {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return days[day];
}

function formatTime(time: string): string {
  // Ensure the time string is 4 digits
  const paddedTime = time.padStart(4, '0');
  // Insert colon between hours and minutes
  return `${paddedTime.slice(0, 2)}:${paddedTime.slice(2)}`;
}