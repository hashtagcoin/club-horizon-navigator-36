import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface VenueHoursFormProps {
  day: string;
  hours: {
    open: string;
    close: string;
    status: string;
  };
  genre: string;
  onHoursChange: (day: string, type: 'open' | 'close' | 'status', value: string) => void;
  onGenreChange: (value: string) => void;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0') + ":00");
const MUSIC_GENRES = ["EDM", "Rock n Roll", "House", "Afrobeats", "RnB"];

export function VenueHoursForm({ 
  day, 
  hours, 
  genre, 
  onHoursChange, 
  onGenreChange 
}: VenueHoursFormProps) {
  return (
    <div className="space-y-2">
      <h3 className="font-medium">{day}</h3>
      <div className="grid grid-cols-4 gap-2">
        <Select
          value={genre}
          onValueChange={onGenreChange}
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
          value={hours.status}
          onValueChange={(value) => onHoursChange(day, 'status', value)}
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

        {hours.status === 'open' && (
          <>
            <Select
              value={hours.open}
              onValueChange={(value) => onHoursChange(day, 'open', value)}
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
              value={hours.close}
              onValueChange={(value) => onHoursChange(day, 'close', value)}
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
  );
}