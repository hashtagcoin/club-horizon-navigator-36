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
          fields: ['address_components', 'geometry', 'name', 'opening_hours', 'formatted_address']
        };

        const autocomplete = new google.maps.places.Autocomplete(
          inputRef.current,
          options
        );

        autocomplete.addListener('place_changed', () => {
          try {
            const place = autocomplete.getPlace();
            console.log("Raw place data:", place);

            if (!place.geometry || !place.name) {
              console.error("Invalid place data received");
              toast({
                title: "Error",
                description: "Please select a venue from the dropdown list",
                variant: "destructive"
              });
              return;
            }

            // Parse address components
            let streetNumber = '';
            let route = '';
            let suburb = '';
            let state = '';
            let country = '';

            place.address_components?.forEach(component => {
              const types = component.types;
              console.log("Processing component:", component);
              
              if (types.includes('street_number')) {
                streetNumber = component.long_name;
              } else if (types.includes('route')) {
                route = component.long_name;
              } else if (types.includes('locality')) {
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
              console.log("Processing opening hours:", place.opening_hours.periods);
              
              place.opening_hours.periods.forEach(period => {
                if (period.open && period.close) {
                  const day = getDayName(period.open.day).toLowerCase();
                  openingHours[day] = {
                    open: `${period.open.time.slice(0, 2)}:${period.open.time.slice(2, 4)}`,
                    close: `${period.close.time.slice(0, 2)}:${period.close.time.slice(2, 4)}`
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
        
        autocompleteInstance.current = autocomplete;
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
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return days[day];
}