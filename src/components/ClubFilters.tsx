import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ClubFiltersProps {
  sortBy: string;
  setSortBy: (value: string) => void;
  filterGenre: string[];
  setFilterGenre: (value: string[]) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  genres: string[];
}

const formatGenre = (genre: string) => {
  return genre
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const sortOptions = [
  { value: 'closest', label: 'Distance' },
  { value: 'alphabetical', label: 'Alphabetical' },
  { value: 'traffic', label: 'Traffic' },
  { value: 'usersAtClub', label: 'Popular' },
  { value: 'genre', label: 'Genre' }
];

export function ClubFilters({
  sortBy,
  setSortBy,
  filterGenre,
  setFilterGenre,
  searchQuery,
  setSearchQuery,
  genres
}: ClubFiltersProps) {
  // Sort genres alphabetically and add "all" option at the beginning
  const sortedGenres = ["all", ...genres.sort()];

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-col space-y-2">
        <label className="text-sm font-medium">Sort By</label>
        <Select 
          onValueChange={setSortBy} 
          defaultValue={sortBy}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col space-y-2">
        <label className="text-sm font-medium">Venue Type</label>
        <Select 
          onValueChange={(value) => setFilterGenre(value === "all" ? [] : [value])} 
          defaultValue="all"
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select venue type" />
          </SelectTrigger>
          <SelectContent>
            {sortedGenres.map((genre) => (
              <SelectItem key={genre} value={genre}>
                {genre === "all" ? "All Venues" : formatGenre(genre)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}