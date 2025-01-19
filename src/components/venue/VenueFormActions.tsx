import { Button } from "@/components/ui/button";

interface VenueFormActionsProps {
  onClose: () => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export function VenueFormActions({ onClose, onSubmit, isLoading }: VenueFormActionsProps) {
  return (
    <div className="flex justify-end space-x-2">
      <Button variant="outline" onClick={onClose}>
        Cancel
      </Button>
      <Button onClick={onSubmit} disabled={isLoading}>
        {isLoading ? "Adding..." : "Add Venue"}
      </Button>
    </div>
  );
}