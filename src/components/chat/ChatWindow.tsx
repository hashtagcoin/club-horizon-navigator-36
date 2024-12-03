import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send } from 'lucide-react'
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
}

export function ChatWindow({
  chatMessage,
  setChatMessage,
  allMessages,
  messageOpacities,
  chatScrollRef,
  onSend,
  clubs
}: ChatWindowProps) {
  return (
    <div className="fixed bottom-16 left-4 w-64 h-72 bg-background/5 rounded-lg overflow-hidden shadow-lg">
      <ScrollArea className="h-[calc(100%-3rem)] p-4">
        <div className="space-y-3" ref={chatScrollRef}>
          {allMessages.map((message, index) => {
            // Calculate fade based on position
            const messageElement = document.querySelector(`[data-message-id="${message.clubId}-${index}"]`);
            const scrollArea = messageElement?.closest('.scroll-area');
            let opacity = 1;
            
            if (messageElement && scrollArea) {
              const rect = messageElement.getBoundingClientRect();
              const scrollRect = scrollArea.getBoundingClientRect();
              const relativePosition = (rect.top - scrollRect.top) / scrollRect.height;
              
              if (relativePosition < 0.33) { // Top third of the chat
                opacity = Math.max(0.3, 1 - ((0.33 - relativePosition) * 3));
              }
            }

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
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-background/5">
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