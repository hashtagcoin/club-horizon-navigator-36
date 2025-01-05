import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UserCheck, MapPin, Music, UserX } from "lucide-react"
import { toast } from "sonner"

interface UserProfileProps {
  onClose: () => void;
  isFriend?: boolean;
  onRemoveFriend?: () => void;
  name?: string;
  location?: string;
  memberSince?: string;
}

export function UserProfile({ 
  onClose, 
  isFriend = false,
  onRemoveFriend,
  name = "Club Pilot User",
  location = "Bali",
  memberSince = "2024"
}: UserProfileProps) {
  const handleRemoveFriend = () => {
    if (onRemoveFriend) {
      onRemoveFriend();
      toast.success("Friend removed successfully");
      onClose();
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-secondary to-background">
        <DialogHeader>
          <DialogTitle>Profile</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4 py-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h2 className="text-xl font-bold">{name}</h2>
            <p className="text-sm text-muted-foreground">Member since {memberSince}</p>
          </div>
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
          <div className="flex gap-2">
            <Button onClick={onClose}>Close</Button>
            {isFriend && (
              <Button 
                variant="destructive" 
                onClick={handleRemoveFriend}
                className="flex items-center gap-2"
              >
                <UserX className="h-4 w-4" />
                Remove Friend
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}