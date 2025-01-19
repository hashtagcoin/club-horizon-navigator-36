import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface AddVenueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVenueAdded: (venue: any) => void;
}

interface AddressComponents {
  streetAddress: string;
  suburb: string;
  state: string;
  country: string;
}

const MUSIC_GENRES = ["EDM", "Rock n Roll", "House", "Afrobeats", "RnB"];
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const HOURS = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0') + ":00");

export function AddVenueModal({ isOpen, onClose, onVenueAdded }: AddVenueModalProps) {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [addressComponents, setAddressComponents] = useState<AddressComponents>({
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
  const autocompleteInstance = useRef<google.maps.places.Autocomplete | null>(null);

  // Initialize hours state for each day
  useEffect(() => {
    const initialHours = DAYS.reduce((acc, day) => ({
      ...acc,
      [day.toLowerCase()]: { open: "09:00", close: "17:00", status: "open" }
    }), {});
    setHours(initialHours);
  }, []);

  // Initialize Google Places Autocomplete
  useEffect(() => {
    if (!isOpen || !autocompleteInputRef.current || !window.google || !window.google.maps) {
      console.log("Missing required dependencies for Google Places Autocomplete");
      return;
    }

    try {
      const options: google.maps.places.AutocompleteOptions = {
        types: ['establishment'],
        componentRestrictions: { country: 'AU' },
        fields: ['address_components', 'geometry', 'name', 'opening_hours', 'place_id']
      };

      // Clean up previous instance if it exists
      if (autocompleteInstance.current) {
        google.maps.event.clearInstanceListeners(autocompleteInstance.current);
      }

      // Create new autocomplete instance
      autocompleteInstance.current = new google.maps.places.Autocomplete(
        autocompleteInputRef.current,
        options
      );

      console.log("Autocomplete instance created:", autocompleteInstance.current);

      // Add place_changed listener
      const placeChangedListener = autocompleteInstance.current.addListener('place_changed', () => {
        if (!autocompleteInstance.current) return;

        const place = autocompleteInstance.current.getPlace();
        console.log("Selected place:", place);

        if (!place.geometry) {
          toast({
            title: "Error",
            description: "Please select a venue from the dropdown list",
            variant: "destructive"
          });
          return;
        }

        setIsLoadingPlace(true);
        try {
          // Update venue name
          setName(place.name || '');

          // Parse and set address components
          const addressComps: AddressComponents = {
            streetAddress: '',
            suburb: '',
            state: '',
            country: ''
          };

          place.address_components?.forEach(component => {
            const types = component.types;
            if (types.includes('street_number') || types.includes('route')) {
              addressComps.streetAddress += (addressComps.streetAddress ? ' ' : '') + component.long_name;
            } else if (types.includes('locality') || types.includes('sublocality')) {
              addressComps.suburb = component.long_name;
            } else if (types.includes('administrative_area_level_1')) {
              addressComps.state = component.short_name;
            } else if (types.includes('country')) {
              addressComps.country = component.long_name;
            }
          });

          setAddressComponents(addressComps);

          // Update opening hours if available
          if (place.opening_hours) {
            const periods = place.opening_hours.periods;
            const newHours = { ...hours };

            DAYS.forEach((day, index) => {
              const period = periods.find(p => p.open?.day === index);
              if (!period) {
                newHours[day.toLowerCase()] = { open: "", close: "", status: "closed" };
              } else if (period.open && period.close && 
                       period.open.time === "0000" && period.close.time === "0000") {
                newHours[day.toLowerCase()] = { open: "", close: "", status: "24hr" };
              } else if (period.open && period.close) {
                newHours[day.toLowerCase()] = {
                  open: `${period.open.time.slice(0, 2)}:00`,
                  close: `${period.close.time.slice(0, 2)}:00`,
                  status: "open"
                };
              }
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

      return () => {
        if (autocompleteInstance.current) {
          google.maps.event.clearInstanceListeners(autocompleteInstance.current);
          autocompleteInstance.current = null;
        }
      };
    } catch (error) {
      console.error("Error initializing Google Places Autocomplete:", error);
      toast({
        title: "Error",
        description: "Failed to initialize venue search. Please try again.",
        variant: "destructive"
      });
    }
  }, [isOpen, toast, hours]);

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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Street Address</label>
              <Input
                value={addressComponents.streetAddress}
                onChange={(e) => setAddressComponents(prev => ({ ...prev, streetAddress: e.target.value }))}
                placeholder="Street address"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Suburb</label>
              <Input
                value={addressComponents.suburb}
                onChange={(e) => setAddressComponents(prev => ({ ...prev, suburb: e.target.value }))}
                placeholder="Suburb"
              />
            </div>
            <div>
              <label className="text-sm font-medium">State</label>
              <Input
                value={addressComponents.state}
                onChange={(e) => setAddressComponents(prev => ({ ...prev, state: e.target.value }))}
                placeholder="State"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Country</label>
              <Input
                value={addressComponents.country}
                onChange={(e) => setAddressComponents(prev => ({ ...prev, country: e.target.value }))}
                placeholder="Country"
              />
            </div>
          </div>
          
          {DAYS.map(day => (
            <div key={day} className="space-y-2">
              <h3 className="font-medium">{day}</h3>
              <div className="grid grid-cols-4 gap-2">
                <Select
                  value={genres[day.toLowerCase()]}
                  onValueChange={(value) => setGenres(prev => ({ ...prev, [day.toLowerCase()]: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select genre" />
                  </SelectTrigger>
                  <SelectContent>
                    {MUSIC_GENRES.map(genre => (
                      <SelectItem key={genre} value={genre}>
                        {genre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={hours[day.toLowerCase()]?.status || "open"}
                  onValueChange={(value) => handleHoursChange(day, 'status', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                    <SelectItem value="24hr">24 Hours</SelectItem>
                  </SelectContent>
                </Select>

                {hours[day.toLowerCase()]?.status === 'open' && (
                  <>
                    <Select
                      value={hours[day.toLowerCase()]?.open}
                      onValueChange={(value) => handleHoursChange(day, 'open', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Opening" />
                      </SelectTrigger>
                      <SelectContent>
                        {HOURS.map(hour => (
                          <SelectItem key={hour} value={hour}>
                            {hour}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={hours[day.toLowerCase()]?.close}
                      onValueChange={(value) => handleHoursChange(day, 'close', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Closing" />
                      </SelectTrigger>
                      <SelectContent>
                        {HOURS.map(hour => (
                          <SelectItem key={hour} value={hour}>
                            {hour}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </>
                )}
              </div>
            </div>
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
