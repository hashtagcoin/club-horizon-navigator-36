import { Switch } from "@/components/ui/switch";

interface PresenceToggleProps {
  presenceEnabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export function PresenceToggle({
  presenceEnabled,
  onToggle
}: PresenceToggleProps) {
  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-muted-foreground">Show Presence</span>
      <Switch
        checked={presenceEnabled}
        onCheckedChange={onToggle}
      />
    </div>
  );
}