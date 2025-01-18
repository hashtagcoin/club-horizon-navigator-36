import { Badge } from "@/components/ui/badge";
import { UserCheck, MapPin, Music } from "lucide-react";

interface BadgeSectionProps {
  location: string;
}

export function BadgeSection({ location }: BadgeSectionProps) {
  return (
    <div className="flex space-x-2">
      <Badge variant="secondary" className="flex items-center space-x-1">
        <UserCheck className="h-3 w-3" />
        <span>VIP Member</span>
      </Badge>
      <Badge variant="secondary" className="flex items-center space-x-1">
        <MapPin className="h-3 w-3" />
        <span>{location}</span>
      </Badge>
      <Badge variant="secondary" className="flex items-center space-x-1">
        <Music className="h-3 w-3" />
        <span>Electronic</span>
      </Badge>
    </div>
  );
}