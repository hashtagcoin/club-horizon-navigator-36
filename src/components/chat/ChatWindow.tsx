import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { X, Send } from 'lucide-react'
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
  isGeneralChat,
  chatClub,
  chatMessage,
  setChatMessage,
  allMessages,
  messageOpacities,
  chatScrollRef,
  onClose,
  onSend,
  clubs
}: ChatWindowProps) {
  return (
    <div className="bg-transparent flex flex-col overflow-hidden rounded-lg shadow-lg h-80">
      <div className="p-2 flex justify-between items-center bg-primary/80 backdrop-blur-sm text-primary-foreground">
        <span className="font-bold text-sm">{isGeneralChat ? "General Chat" : chatClub?.name}</span>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <ScrollArea className="flex-grow p-2">
        <div className="space-y-2" ref={chatScrollRef}>
          {allMessages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start space-x-2 chat-message ${
                message.sender === "You" ? "justify-end" : "justify-start"
              }`}
              data-message-id={`${message.clubId}-${index}`}
              style={{ opacity: messageOpacities[`${message.clubId}-${index}`] || 1 }}
            >
              {message.sender !== "You" && (
                <Avatar className="h-6 w-6">
                  <AvatarImage src={`/placeholder.svg?height=24&width=24`} alt={`${message.sender} Avatar`} />
                  <AvatarFallback>{message.sender.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
              )}
              <div className={`flex flex-col ${message.sender === "You" ? "items-end" : "items-start"}`}>
                <span className="text-[0.6rem] text-muted-foreground mb-0.5">
                  {isGeneralChat && message.sender !== "You" ? `${message.sender} (${clubs.find(c => c.id === message.clubId)?.name || 'General'})` : message.sender}
                </span>
                <span className="inline-block px-2 py-1 rounded-lg bg-primary/80 backdrop-blur-sm text-primary-foreground text-xs">
                  {message.text}
                </span>
              </div>
              {message.sender === "You" && (
                <Avatar className="h-6 w-6">
                  <AvatarImage src={`/placeholder.svg?height=24&width=24`} alt="User Avatar" />
                  <AvatarFallback>YO</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="p-2 flex bg-primary/80 backdrop-blur-sm">
        <Input
          value={chatMessage}
          onChange={(e) => setChatMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow mr-2 bg-transparent border-none focus:ring-0 text-primary-foreground placeholder-primary-foreground/70 text-xs h-7"
          onKeyPress={(e) => e.key === 'Enter' && onSend()}
        />
        <Button onClick={onSend} variant="ghost" size="sm" className="h-7 w-7 p-0 text-primary-foreground">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}