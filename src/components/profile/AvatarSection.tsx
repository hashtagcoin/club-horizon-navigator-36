import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload } from "lucide-react";

interface AvatarSectionProps {
  avatarUrl: string;
  name: string;
  presenceEnabled: boolean;
  isOnline: boolean;
  onAvatarClick: () => void;
}

export function AvatarSection({
  avatarUrl,
  name,
  presenceEnabled,
  isOnline,
  onAvatarClick
}: AvatarSectionProps) {
  return (
    <div className="relative group cursor-pointer" onClick={onAvatarClick}>
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
  );
}