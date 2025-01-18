import { Switch } from "@/components/ui/switch";
import { Eye, EyeOff } from "lucide-react";

interface MapControlsProps {
  showAllClubs: boolean;
  setShowAllClubs: (show: boolean) => void;
}

export const MapControls = ({ showAllClubs, setShowAllClubs }: MapControlsProps) => {
  return (
    <div className="absolute bottom-20 left-4 z-50 flex items-center gap-2 bg-white/90 p-2 rounded-lg shadow-md">
      {showAllClubs ? (
        <Eye className="h-4 w-4 text-primary" />
      ) : (
        <EyeOff className="h-4 w-4 text-muted-foreground" />
      )}
      <Switch
        checked={showAllClubs}
        onCheckedChange={setShowAllClubs}
        aria-label="Toggle all clubs visibility"
      />
    </div>
  );
};