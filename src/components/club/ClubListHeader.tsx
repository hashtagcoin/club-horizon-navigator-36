import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatGenre } from '@/utils/formatGenre';

interface ClubListHeaderProps {
  clubCount: number;
  sortBy: string;
  setSortBy: (value: string) => void;
  filterGenre: string[];
  setFilterGenre: (value: string[]) => void;
  genres: string[];
  currentSuburb: string;
}

const sortOptions = [
  { value: 'closest', label: 'Distance' },
  { value: 'alphabetical', label: 'Alphabetical' },
  { value: 'traffic', label: 'Traffic' },
  { value: 'usersAtClub', label: 'Popular' },
  { value: 'genre', label: 'Genre' }
];

export const ClubListHeader = ({
  clubCount,
  sortBy,
  setSortBy,
  filterGenre,
  setFilterGenre,
  genres,
  currentSuburb
}: ClubListHeaderProps) => {
  const sortedGenres = ["all", ...genres.sort()];

  return (
    <div className="fixed top-14 left-0 w-1/2 bg-white z-30 border-b border-gray-200">
      <div className="flex justify-between items-center px-4 py-2 bg-gray-50">
        <div className="flex items-center gap-2">
          <div className="bg-black text-white px-4 py-1.5 rounded-lg text-xl font-bold">
            {clubCount}
          </div>
          <span className="text-sm font-medium text-gray-600">
            {clubCount === 1 ? 'Venue' : 'Venues'}
          </span>
        </div>
        <h2 className="text-2xl font-bold text-white bg-black rounded-lg px-3 py-1 shadow-sm">
          {currentSuburb}
        </h2>
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
};