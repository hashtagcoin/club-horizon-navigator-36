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
  const sortedGenres = ["all", ...genres.sort()];

  return (
    <div className="p-0 w-full relative">
      <div className="flex gap-2 items-center w-full">
        <Select 
          onValueChange={setSortBy} 
          defaultValue={sortBy}
        >
          <SelectTrigger className="h-8 text-sm flex-1">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent position="popper" className="z-50 bg-popover">
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select 
          onValueChange={(value) => setFilterGenre(value === "all" ? [] : [value])} 
          defaultValue="all"
        >
          <SelectTrigger className="h-8 text-sm flex-1">
            <SelectValue placeholder="Select venue type" />
          </SelectTrigger>
          <SelectContent position="popper" className="z-50 bg-popover">
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