import { Button } from "@/components/ui/button"
import { Compass, Locate } from "lucide-react"
import { useLocationData } from '@/hooks/useLocationData'

interface MapControlsProps {
  onLocateUser: () => void;
  onShowGlobalLocationModal: () => void;
}

export function MapControls({ onLocateUser, onShowGlobalLocationModal }: MapControlsProps) {
  const { isLoadingLocation } = useLocationData()

  const handleLocationClick = () => {
    onLocateUser();
    onShowGlobalLocationModal();
  };

  return (
    <div className="absolute bottom-24 right-4 flex flex-col gap-2">
      <Button
        variant="outline"
        size="icon"
        className="h-10 w-10 bg-white shadow-md"
        onClick={handleLocationClick}
        disabled={isLoadingLocation}
      >
        <Locate className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="h-10 w-10 bg-white shadow-md"
        onClick={onLocateUser}
        disabled={isLoadingLocation}
      >
        <Compass className="h-4 w-4" />
      </Button>
    </div>
  )
}