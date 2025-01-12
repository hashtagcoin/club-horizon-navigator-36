import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { genres } from "@/data/locations"

interface ClubListHeaderProps {
  totalVenues: number;
  selectedVenueType: string;
  onVenueTypeChange: (value: string) => void;
  sortOrder: string;
  onSortOrderChange: (value: string) => void;
}

export function ClubListHeader({
  totalVenues,
  selectedVenueType,
  onVenueTypeChange,
  sortOrder,
  onSortOrderChange
}: ClubListHeaderProps) {
  return (
    <div className="bg-white p-4 border-b flex items-center justify-between gap-4">
      <div className="text-lg font-semibold">
        {totalVenues} Venues
      </div>
      
      <div className="flex items-center gap-2">
        <Select value={selectedVenueType} onValueChange={onVenueTypeChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select venue type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Venues</SelectItem>
            {genres.map((genre) => (
              <SelectItem key={genre} value={genre.toLowerCase()}>{genre}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortOrder} onValueChange={onSortOrderChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rating">Rating (High to Low)</SelectItem>
            <SelectItem value="name">Name (A-Z)</SelectItem>
            <SelectItem value="distance">Distance</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}