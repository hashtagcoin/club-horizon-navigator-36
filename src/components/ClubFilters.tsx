import { Button } from "@/components/ui/button"
import { Toggle } from "@/components/ui/toggle"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ClubFiltersProps {
  sortBy: string;
  setSortBy: (value: string) => void;
  filterGenre: string[];
  setFilterGenre: (value: string[]) => void;
  genres: string[];
}

export function ClubFilters({
  sortBy,
  setSortBy,
  filterGenre,
  setFilterGenre,
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
      <div className="flex justify-between items-center">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setFilterGenre([])}
          className={`text-xs h-7 ${filterGenre.length === 0 ? 'bg-black text-white hover:bg-black/90' : ''}`}
        >
          All Types
        </Button>
        <div className="text-xs text-muted-foreground">
          {filterGenre.length} selected
        </div>
      </div>

      <ScrollArea className="h-[120px] w-full rounded-md border p-2">
        <div className="grid grid-cols-2 gap-2 pr-4 md:grid-cols-3">
          {sortedTypes.map(type => (
            <Toggle
              key={type}
              pressed={filterGenre.includes(type)}
              onPressedChange={() => handleGenreToggle(type)}
              size="sm"
              className="text-xs h-8 w-full justify-start"
            >
              {formatType(type)}
            </Toggle>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}