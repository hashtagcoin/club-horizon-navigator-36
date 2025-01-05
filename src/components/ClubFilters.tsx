import { Button } from "@/components/ui/button";
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
  const sortedGenres = genres.sort();

  const handleGenreToggle = (genre: string) => {
    const newGenres = filterGenre.includes(genre)
      ? filterGenre.filter(g => g !== genre)
      : [...filterGenre, genre];
    setFilterGenre(newGenres);
  };

  return (
    <div className="p-2">
      <div className="flex flex-col gap-2">
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

        <div className="flex flex-wrap gap-2">
          {sortedGenres.map((genre) => (
            <Button
              key={genre}
              size="sm"
              variant={filterGenre.includes(genre) ? "default" : "outline"}
              onClick={() => handleGenreToggle(genre)}
              className={`text-xs transition-colors ${filterGenre.includes(genre) ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground opacity-70 hover:opacity-100'}`}
            >
              {formatGenre(genre)}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}