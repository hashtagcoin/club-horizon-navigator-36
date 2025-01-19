import { useState, useEffect } from "react";
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

const MUSIC_GENRES = ["EDM", "Rock n Roll", "House", "Afrobeats", "RnB"];
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const HOURS = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0') + ":00");

export function AddVenueModal({ isOpen, onClose, onVenueAdded }: AddVenueModalProps) {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPlace, setIsLoadingPlace] = useState(false);
  const [genres, setGenres] = useState<Record<string, string>>({});
  const [hours, setHours] = useState<Record<string, { open: string; close: string; status: string }>>({});

  // Initialize hours state for each day
  useEffect(() => {
    const initialHours = DAYS.reduce((acc, day) => ({
      ...acc,
      [day.toLowerCase()]: { open: "09:00", close: "17:00", status: "open" }
    }), {});
    setHours(initialHours);
  }, []);

  // Fetch place details when name changes
  useEffect(() => {
    if (!name || name.length < 3) return;

    const fetchPlaceDetails = async () => {
      setIsLoadingPlace(true);
      try {
        const service = new google.maps.places.PlacesService(document.createElement('div'));
        
        // First, search for the place
        const request = {
          query: name,
          fields: ['name', 'formatted_address', 'opening_hours', 'geometry']
        };

        service.textSearch(request, (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results?.[0]) {
            const place = results[0];
            setAddress(place.formatted_address || '');

            // Get detailed place information
            service.getDetails({
              placeId: place.place_id,
              fields: ['opening_hours']
            }, (placeDetails, detailsStatus) => {
              if (detailsStatus === google.maps.places.PlacesServiceStatus.OK && placeDetails?.opening_hours) {
                const periods = placeDetails.opening_hours.periods;
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
            });
          }
        });
      } catch (error) {
        console.error('Error fetching place details:', error);
      } finally {
        setIsLoadingPlace(false);
      }
    };

    const debounceTimer = setTimeout(fetchPlaceDetails, 500);
    return () => clearTimeout(debounceTimer);
  }, [name]);

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
      const geocodeResult = await new Promise((resolve, reject) => {
        geocoder.geocode({ address }, (results, status) => {
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
        address,
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
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter venue name"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Address</label>
            <div className="relative">
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter full address"
                className={isLoadingPlace ? "pr-10" : ""}
              />
              {isLoadingPlace && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin" />
              )}
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