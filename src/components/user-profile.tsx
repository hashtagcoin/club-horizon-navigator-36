import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserX } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AvatarSection } from "./profile/AvatarSection";
import { BadgeSection } from "./profile/BadgeSection";
import { OffersSection } from "./profile/OffersSection";
import { QRCodeSheet } from "./profile/QRCodeSheet";
import { PresenceToggle } from "./profile/PresenceToggle";

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
  const [presenceEnabled, setPresenceEnabled] = useState(true);
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

  return (
    <>
      <Dialog open onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-secondary to-background">
          <DialogHeader>
            <DialogTitle>Profile</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4 py-4">
            <AvatarSection
              avatarUrl={avatarUrl}
              name={name}
              presenceEnabled={presenceEnabled}
              isOnline={isOnline}
              onAvatarClick={handleAvatarClick}
            />
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
            
            <PresenceToggle
              presenceEnabled={presenceEnabled}
              onToggle={handlePresenceToggle}
            />
            
            <BadgeSection location={location} />

            <OffersSection
              claimedOffers={claimedOffers}
              selectedOffer={selectedOffer}
              onSelectOffer={(offer) => {
                setSelectedOffer(offer);
                setShowQRCode(true);
              }}
            />

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

      <QRCodeSheet
        showQRCode={showQRCode}
        setShowQRCode={setShowQRCode}
        selectedOffer={selectedOffer}
      />
    </>
  );
}