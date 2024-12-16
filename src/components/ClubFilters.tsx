import { MultiSelect } from "@/components/ui/multi-select";

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

  const options = genres
    .filter(type => type)
    .sort((a, b) => a.localeCompare(b))
    .map(type => ({
      label: formatType(type),
      value: type,
    }));

  return (
    <div className="mb-2 space-y-4">
      <MultiSelect
        options={options}
        onValueChange={setFilterGenre}
        defaultValue={genres} // Changed from filterGenre to genres to select all by default
        placeholder="Select venue types"
        maxCount={3}
        className="w-full"
      />
    </div>
  );
}