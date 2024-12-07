import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, X } from 'lucide-react'
import { ChatMessage, ChatMessages, Club } from '@/types/club'

interface ChatWindowProps {
  isGeneralChat: boolean;
  chatClub: Club | null;
  chatMessage: string;
  setChatMessage: (message: string) => void;
  allMessages: ChatMessage[];
  messageOpacities: Record<string, number>;
  chatScrollRef: React.RefObject<HTMLDivElement>;
  onClose: () => void;
  onSend: () => void;
  clubs: Club[];
  position?: { x: number; y: number };
}

export function ChatWindow({
  chatMessage,
  setChatMessage,
  allMessages,
  messageOpacities,
  chatScrollRef,
  onClose,
  onSend,
  chatClub,
  isGeneralChat,
}: ChatWindowProps) {
  const getPosition = () => {
    if (isGeneralChat) {
      return {
        left: '16px',
        bottom: '16px',
      };
    } else {
      return {
        right: '16px',
        bottom: '16px',
      };
    }
  };

  return (
    <div 
      className="fixed bg-background rounded-lg overflow-hidden shadow-lg border border-border w-64 h-72 z-50"
      style={getPosition()}
    >
      <div className="flex justify-between items-center p-2 bg-primary/5 border-b border-border">
        <span className="text-sm font-medium">
          {chatClub ? chatClub.name : 'General Chat'}
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={onClose}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
      <ScrollArea className="h-[calc(100%-6rem)] p-4">
        <div className="space-y-3" ref={chatScrollRef}>
          {allMessages.map((message, index) => {
            const opacity = messageOpacities[`${message.clubId}-${index}`] || 1;
            
            return (
              <div
                key={index}
                className="flex items-start space-x-2"
                data-message-id={`${message.clubId}-${index}`}
                style={{ opacity }}
              >
                <Avatar className="h-6 w-6 shrink-0">
                  <AvatarImage 
                    src={`/placeholder.svg?height=24&width=24`} 
                    alt={`${message.sender} Avatar`} 
                  />
                  <AvatarFallback>
                    {message.sender.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground mb-1">
                    {message.sender}
                  </span>
                  <div className="bg-primary/90 text-primary-foreground px-3 py-2 rounded-lg max-w-[80%] break-words">
                    <p className="text-xs">{message.text}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-background/5 border-t border-border">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            onSend();
          }}
          className="flex items-center gap-2"
        >
          <Input
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-transparent border-none focus-visible:ring-0 text-foreground placeholder:text-muted-foreground text-xs h-7"
          />
          <Button 
            type="submit" 
            size="icon"
            variant="ghost"
            className="h-6 w-6 shrink-0"
          >
            <Send className="h-3 w-3" />
          </Button>
        </form>
      </div>
    </div>
  );
}