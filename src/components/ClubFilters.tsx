import { Button } from "@/components/ui/button";
import { genres } from "@/data/locations";
import { MultiSelect } from "@/components/ui/multi-select";

interface ClubFiltersProps {
  sortBy: string;
  setSortBy: (value: string) => void;
  filterGenre: string[];
  setFilterGenre: (value: string[]) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  onShowAllClubs?: () => void;
}

const options = genres.map(genre => ({
  label: genre,
  value: genre
}));

export function ClubFilters({
  sortBy,
  setSortBy,
  filterGenre,
  setFilterGenre,
  searchQuery,
  setSearchQuery,
  onShowAllClubs
}: ClubFiltersProps) {
  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-col space-y-2">
        <label className="text-sm font-medium">Venue Type</label>
        <MultiSelect
          options={options}
          onValueChange={setFilterGenre}
          defaultValue={genres}
          placeholder="Select venue types"
          maxCount={3}
          className="w-full"
        />
      </div>

      <Button 
        variant="outline" 
        className="w-full"
        onClick={onShowAllClubs}
      >
        Show all clubs on map
      </Button>
    </div>
  );
}