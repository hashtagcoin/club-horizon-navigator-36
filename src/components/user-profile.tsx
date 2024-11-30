import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UserCheck, MapPin, Music } from "lucide-react"

export function UserProfile({ onClose }: { onClose: () => void }) {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-secondary to-background">
        <DialogHeader>
          <DialogTitle>Profile</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4 py-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback>CP</AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h2 className="text-xl font-bold">Club Pilot User</h2>
            <p className="text-sm text-muted-foreground">Member since 2024</p>
          </div>
          <div className="flex space-x-2">
            <Badge variant="secondary" className="flex items-center space-x-1">
              <UserCheck className="h-3 w-3" />
              <span>VIP Member</span>
            </Badge>
            <Badge variant="secondary" className="flex items-center space-x-1">
              <MapPin className="h-3 w-3" />
              <span>Bali</span>
            </Badge>
            <Badge variant="secondary" className="flex items-center space-x-1">
              <Music className="h-3 w-3" />
              <span>Electronic</span>
            </Badge>
          </div>
        </div>
        <Button onClick={onClose}>Close</Button>
      </DialogContent>
    </Dialog>
  )
}