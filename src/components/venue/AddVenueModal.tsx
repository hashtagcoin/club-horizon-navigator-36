import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AddVenueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVenueAdded: (venue: any) => void;
}

const MUSIC_GENRES = ["EDM", "Rock n Roll", "House", "Afrobeats", "RnB"];
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export function AddVenueModal({ isOpen, onClose, onVenueAdded }: AddVenueModalProps) {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [genres, setGenres] = useState<Record<string, string>>({});
  const [hours, setHours] = useState<Record<string, { open: string; close: string }>>({});

  const handleGenreChange = (day: string, genre: string) => {
    setGenres(prev => ({ ...prev, [day.toLowerCase()]: genre }));
  };

  const handleHoursChange = (day: string, type: 'open' | 'close', value: string) => {
    setHours(prev => ({
      ...prev,
      [day.toLowerCase()]: { ...prev[day.toLowerCase()], [type]: value }
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

      // Get coordinates from address using Google Geocoding API
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
        ...Object.entries(hours).reduce((acc, [day, { open, close }]) => ({
          ...acc,
          [`${day}_hours_open`]: open,
          [`${day}_hours_close`]: close
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
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter full address"
            />
          </div>
          
          {DAYS.map(day => (
            <div key={day} className="space-y-2">
              <h3 className="font-medium">{day}</h3>
              <div className="grid grid-cols-3 gap-2">
                <Select
                  value={genres[day.toLowerCase()]}
                  onValueChange={(value) => handleGenreChange(day, value)}
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
                <Input
                  type="time"
                  placeholder="Opening time"
                  value={hours[day.toLowerCase()]?.open || ""}
                  onChange={(e) => handleHoursChange(day, 'open', e.target.value)}
                />
                <Input
                  type="time"
                  placeholder="Closing time"
                  value={hours[day.toLowerCase()]?.close || ""}
                  onChange={(e) => handleHoursChange(day, 'close', e.target.value)}
                />
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