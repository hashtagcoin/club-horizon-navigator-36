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
    <div className="fixed bottom-16 left-4 w-80 h-96 bg-background/30 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg">
      <ScrollArea className="h-[calc(100%-3rem)] p-4">
        <div className="space-y-3" ref={chatScrollRef}>
          {allMessages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start space-x-2 ${
                message.sender === "You" ? "flex-row-reverse space-x-reverse" : "flex-row"
              }`}
              data-message-id={`${message.clubId}-${index}`}
              style={{ opacity: messageOpacities[`${message.clubId}-${index}`] || 1 }}
            >
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarImage 
                  src={`/placeholder.svg?height=32&width=32`} 
                  alt={`${message.sender} Avatar`} 
                />
                <AvatarFallback>
                  {message.sender.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className={`flex flex-col ${message.sender === "You" ? "items-end" : "items-start"}`}>
                <span className="text-xs text-muted-foreground mb-1">
                  {message.sender}
                </span>
                <div className="bg-primary/90 backdrop-blur-sm text-primary-foreground px-3 py-2 rounded-lg max-w-[80%] break-words">
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-background/50 backdrop-blur-sm">
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
            className="flex-1 bg-transparent border-none focus-visible:ring-0 text-foreground placeholder:text-muted-foreground"
          />
          <Button 
            type="submit" 
            size="icon"
            variant="ghost"
            className="h-8 w-8 shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}