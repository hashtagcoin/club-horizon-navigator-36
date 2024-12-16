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
  // Function to format type strings
  const formatType = (type: string) => {
    return type
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Sort and format genres
  const sortedTypes = [...genres]
    .map(type => formatType(type))
    .sort((a, b) => a.localeCompare(b));

  return (
    <div className="mb-2 flex justify-between">
      <Select value={sortBy} onValueChange={setSortBy}>
        <SelectTrigger className="w-[180px] h-7 text-xs">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="usersAtClub">Users at Club</SelectItem>
          <SelectItem value="traffic">Traffic</SelectItem>
          <SelectItem value="alphabetical">Alphabetical</SelectItem>
          <SelectItem value="genre">Type</SelectItem>
          <SelectItem value="openingHours">Opening Hours</SelectItem>
        </SelectContent>
      </Select>
      
      <div className="flex space-x-2">
        <Select value={filterGenre} onValueChange={setFilterGenre}>
          <SelectTrigger className="w-[180px] h-7 text-xs">
            <SelectValue placeholder="Filter by Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Types</SelectItem>
            {sortedTypes.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
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