import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { UserCheck, MapPin, Music, UserX, QrCode, Upload, X } from "lucide-react"
import { toast } from "sonner"
import { useState, useEffect, useRef } from "react"
import { supabase } from "@/integrations/supabase/client"

interface UserProfileProps {
  onClose: () => void;
  isFriend?: boolean;
  onRemoveFriend?: () => void;
  name?: string;
  location?: string;
  memberSince?: string;
}

interface ClaimedOffer {
  id: string;
  clubName: string;
  title: string;
  description: string;
  type: string;
  expiryDate: string;
}

export function UserProfile({ 
  onClose, 
  isFriend = false,
  onRemoveFriend,
  name = "Club Pilot User",
  location = "Bali",
  memberSince = "2024"
}: UserProfileProps) {
  const [claimedOffers, setClaimedOffers] = useState<ClaimedOffer[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<ClaimedOffer | null>(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>("/placeholder.svg");
  const [presenceEnabled, setPresenceEnabled] = useState(true); // Set to true by default
  const [isOnline, setIsOnline] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const presenceChannel = useRef<any>(null);

  useEffect(() => {
    const offers = JSON.parse(localStorage.getItem('claimedOffers') || '[]');
    setClaimedOffers(offers);
    
    const savedAvatarUrl = localStorage.getItem('userAvatarUrl');
    if (savedAvatarUrl) {
      setAvatarUrl(savedAvatarUrl);
    }

    // Initialize presence immediately since it's enabled by default
    loadPresenceSettings();
    
    return () => {
      if (presenceChannel.current) {
        presenceChannel.current.unsubscribe();
      }
    };
  }, []);

  const loadPresenceSettings = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: settings } = await supabase
      .from('user_settings')
      .select('presence_enabled')
      .eq('user_id', user.id)
      .single();

    if (settings) {
      setPresenceEnabled(settings.presence_enabled ?? false);
      if (settings.presence_enabled) {
        initializePresence(user.id);
      }
    } else {
      const { error } = await supabase
        .from('user_settings')
        .insert([{ user_id: user.id, presence_enabled: true }]);
        
      if (!error) {
        initializePresence(user.id);
      }
    }
  };

  const initializePresence = (userId: string) => {
    presenceChannel.current = supabase.channel(`presence:${userId}`)
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.current.presenceState();
        setIsOnline(Object.keys(state).length > 0);
      })
      .subscribe(async (status: string) => {
        if (status === 'SUBSCRIBED') {
          await presenceChannel.current.track({
            online_at: new Date().toISOString(),
          });
        }
      });
  };

  const handlePresenceToggle = async (enabled: boolean) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    setPresenceEnabled(enabled);
    
    const { error } = await supabase
      .from('user_settings')
      .update({ presence_enabled: enabled })
      .eq('user_id', user.id);

    if (!error) {
      if (enabled) {
        initializePresence(user.id);
        toast.success("Presence enabled");
      } else {
        if (presenceChannel.current) {
          await presenceChannel.current.unsubscribe();
          presenceChannel.current = null;
        }
        toast.success("Presence disabled");
      }
    }
  };

  const handleRemoveFriend = () => {
    if (onRemoveFriend) {
      onRemoveFriend();
      toast.success("Friend removed successfully");
      onClose();
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setAvatarUrl(result);
        localStorage.setItem('userAvatarUrl', result);
        toast.success("Profile picture updated successfully");
      };
      reader.readAsDataURL(file);
    }
  };

  const isOfferValid = (expiryDate: string) => {
    return new Date(expiryDate) > new Date();
  };

  return (
    <>
      <Dialog open onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-secondary to-background">
          <DialogHeader>
            <DialogTitle>Profile</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4 py-4">
            <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={avatarUrl} />
                  <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                {presenceEnabled && (
                  <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                    isOnline ? 'bg-green-500' : 'bg-gray-400'
                  }`} />
                )}
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Upload className="h-6 w-6 text-white" />
              </div>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleFileChange}
            />
            <div className="text-center">
              <h2 className="text-xl font-bold">{name}</h2>
              <p className="text-sm text-muted-foreground">Member since {memberSince}</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Show Presence</span>
              <Switch
                checked={presenceEnabled}
                onCheckedChange={handlePresenceToggle}
              />
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

            <div className="w-full">
              <h3 className="text-lg font-semibold mb-2">Your Claimed Offers</h3>
              <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                {claimedOffers.length === 0 ? (
                  <p className="text-center text-muted-foreground">No claimed offers yet</p>
                ) : (
                  <div className="space-y-4">
                    {claimedOffers.map((offer) => (
                      <Card 
                        key={offer.id} 
                        className={`cursor-pointer transition-colors ${
                          selectedOffer?.id === offer.id ? 'border-primary' : ''
                        }`}
                        onClick={() => {
                          setSelectedOffer(offer);
                          setShowQRCode(true);
                        }}
                      >
                        <CardHeader className="p-3">
                          <div className="flex justify-between items-center">
                            <h4 className="font-semibold">{offer.clubName}</h4>
                            <Badge variant={isOfferValid(offer.expiryDate) ? "default" : "destructive"}>
                              {isOfferValid(offer.expiryDate) ? "Valid" : "Expired"}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="p-3 pt-0">
                          <p className="text-sm">{offer.title}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </ScrollArea>
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

      <Sheet open={showQRCode} onOpenChange={setShowQRCode}>
        <SheetContent side="bottom" className="h-[400px]">
          <div className="absolute right-4 top-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setShowQRCode(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <h3 className="font-semibold text-lg">Offer QR Code</h3>
            <div className="bg-white p-4 rounded-lg">
              <QrCode className="h-32 w-32 text-black" />
            </div>
            {selectedOffer && (
              <p className="text-sm text-muted-foreground">
                Show this QR code at {selectedOffer.clubName}
              </p>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}