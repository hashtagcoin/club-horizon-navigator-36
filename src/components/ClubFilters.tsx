import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from 'lucide-react'

interface ClubFiltersProps {
  sortBy: string;
  setSortBy: (value: string) => void;
  filterGenre: string;
  setFilterGenre: (value: string) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  genres: string[];
}

export function ClubFilters({
  sortBy,
  setSortBy,
  filterGenre,
  setFilterGenre,
  searchQuery,
  setSearchQuery,
  genres
}: ClubFiltersProps) {
  return (
    <div className="mb-2 flex justify-between">
      <Select value={sortBy} onValueChange={setSortBy}>
        <SelectTrigger className="w-[180px] h-7 text-xs">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="usersAtClub">Sort by Users at Club</SelectItem>
          <SelectItem value="traffic">Sort by Traffic</SelectItem>
          <SelectItem value="alphabetical">Sort Alphabetically</SelectItem>
          <SelectItem value="genre">Sort by Genre</SelectItem>
          <SelectItem value="openingHours">Sort by Opening Hours</SelectItem>
        </SelectContent>
      </Select>
      
      <div className="flex space-x-2">
        <Select value={filterGenre} onValueChange={setFilterGenre}>
          <SelectTrigger className="w-[180px] h-7 text-xs">
            <SelectValue placeholder="Filter by Genre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Genres</SelectItem>
            {genres.map(genre => (
              <SelectItem key={genre} value={genre}>{genre}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search clubs..."
            className="pl-7 w-48 h-7 text-xs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}