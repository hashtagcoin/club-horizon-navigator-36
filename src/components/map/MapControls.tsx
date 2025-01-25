import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, ZoomIn, ZoomOut } from "lucide-react";

interface MapControlsProps {
  showAllClubs: boolean;
  toggleShowAllClubs: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

export function MapControls({
  showAllClubs,
  toggleShowAllClubs,
  onZoomIn,
  onZoomOut,
}: MapControlsProps) {
  const isMobile = useIsMobile();
  const isClubPilotNet = typeof window !== 'undefined' && window.location.hostname === 'clubpilot.net';

  const controlsStyle = isMobile && isClubPilotNet
    ? {
        position: 'absolute' as const,
        right: '10px',
        // Position at roughly the third card height (assuming each card is about 120px)
        top: '360px',
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '8px',
        zIndex: 10,
      }
    : {
        position: 'absolute' as const,
        right: '10px',
        top: '10px',
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '8px',
        zIndex: 10,
      };

  return (
    <div style={controlsStyle}>
      <Button
        variant="outline"
        size="icon"
        className="bg-white shadow-lg hover:bg-gray-50"
        onClick={toggleShowAllClubs}
      >
        {showAllClubs ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="bg-white shadow-lg hover:bg-gray-50"
        onClick={onZoomIn}
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="bg-white shadow-lg hover:bg-gray-50"
        onClick={onZoomOut}
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
    </div>
  );
}