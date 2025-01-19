import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface VenueFormHeaderProps {
  name: string;
  onNameChange: (value: string) => void;
  isLoadingPlace: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
}

export function VenueFormHeader({ 
  name, 
  onNameChange, 
  isLoadingPlace, 
  inputRef 
}: VenueFormHeaderProps) {
  return (
    <DialogHeader>
      <DialogTitle>Add New Venue</DialogTitle>
      <DialogDescription>
        Search for a venue or manually enter the details below.
      </DialogDescription>
      <div>
        <label className="text-sm font-medium">Venue Name</label>
        <Input
          ref={inputRef}
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Start typing venue name..."
          className={isLoadingPlace ? "pr-10" : ""}
        />
        {isLoadingPlace && (
          <div className="relative">
            <Loader2 className="absolute right-3 -top-8 h-4 w-4 animate-spin" />
          </div>
        )}
      </div>
    </DialogHeader>
  );
}