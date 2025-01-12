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
    <div className="fixed top-14 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="p-4 flex gap-2 items-center max-w-md">
        <Select 
          onValueChange={setSortBy} 
          defaultValue={sortBy}
        >
          <SelectTrigger className="w-[130px] h-8 text-sm">
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

        <Select 
          onValueChange={(value) => setFilterGenre(value === "all" ? [] : [value])} 
          defaultValue="all"
        >
          <SelectTrigger className="w-[130px] h-8 text-sm">
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