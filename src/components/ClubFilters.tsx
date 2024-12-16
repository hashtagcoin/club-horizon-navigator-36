import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from 'lucide-react'
import { Toggle } from "@/components/ui/toggle"

interface ClubFiltersProps {
  sortBy: string;
  setSortBy: (value: string) => void;
  filterGenre: string[];  // Changed to array
  setFilterGenre: (value: string[]) => void;  // Changed to array
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
    if (!type) return '';
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const handleGenreToggle = (genre: string) => {
    if (filterGenre.includes(genre)) {
      setFilterGenre(filterGenre.filter(g => g !== genre));
    } else {
      setFilterGenre([...filterGenre, genre]);
    }
  };

  // Sort and format genres
  const sortedTypes = [...genres]
    .filter(type => type)
    .sort((a, b) => a.localeCompare(b));

  return (
    <div className="mb-2 space-y-4">
      <div className="flex justify-between">
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px] h-7 text-xs">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="closest">Closest</SelectItem>
            <SelectItem value="usersAtClub">Users at Club</SelectItem>
            <SelectItem value="traffic">Traffic</SelectItem>
            <SelectItem value="alphabetical">Alphabetical</SelectItem>
            <SelectItem value="genre">Type</SelectItem>
            <SelectItem value="openingHours">Opening Hours</SelectItem>
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

      <div className="flex flex-wrap gap-2">
        <Toggle
          pressed={filterGenre.length === 0}
          onPressedChange={() => setFilterGenre([])}
          size="sm"
          className="text-xs h-7"
        >
          All Types
        </Toggle>
        {sortedTypes.map(type => (
          <Toggle
            key={type}
            pressed={filterGenre.includes(type)}
            onPressedChange={() => handleGenreToggle(type)}
            size="sm"
            className="text-xs h-7"
          >
            {formatType(type)}
          </Toggle>
        ))}
      </div>
    </div>
  );
}