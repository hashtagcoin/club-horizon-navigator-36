import { Button } from "@/components/ui/button";
import { Send } from 'lucide-react';

interface ChatInputProps {
  message: string;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
}

export function ChatInput({ message, onMessageChange, onSendMessage }: ChatInputProps) {
  return (
    <div className="p-2 border-t border-white/10 flex gap-2 bg-black">
      <input
        type="text"
        value={message}
        onChange={(e) => onMessageChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSendMessage();
          }
        }}
        placeholder="Type a message..."
        className="flex-1 text-xs bg-white/5 rounded px-2 py-1 text-white placeholder:text-white/50 border-none focus:outline-none"
      />
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 text-white hover:text-white/80"
        onClick={onSendMessage}
      >
        <Send className="h-3 w-3" />
      </Button>
    </div>
  );
}