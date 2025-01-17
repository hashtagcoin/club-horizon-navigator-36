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
    <div className="filter-bar">
      <div className="flex justify-between items-center px-4 py-2 bg-gray-50">
        <div className="flex items-center gap-2">
          <div className="bg-black text-white px-4 py-1.5 rounded-lg text-xl font-bold">
            {genres.length}
          </div>
          <span className="text-sm font-medium text-gray-600">
            {genres.length === 1 ? 'Venue' : 'Venues'}
          </span>
        </div>
      </div>
      <div className="p-2">
        <div className="flex gap-2 items-center">
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
    </div>
  );
}