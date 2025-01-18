import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, X } from 'lucide-react'
import { ChatMessage, ChatMessages, Club } from '@/types/club'
import { useSpring, animated } from '@react-spring/web'
import { useDrag } from '@use-gesture/react'
import { useEffect } from "react"

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
  const [{ x }, api] = useSpring(() => ({ x: 0 }));

  const bind = useDrag(({ movement: [mx], velocity: [vx], direction: [dx], cancel, active }) => {
    const shouldClose = isGeneralChat 
      ? (dx < 0 && mx < -50)
      : (dx > 0 && mx > 50);

    if (shouldClose && Math.abs(vx) > 0.2) {
      cancel();
      api.start({ 
        x: isGeneralChat ? -400 : 400,
        immediate: false,
        config: { tension: 200, friction: 25 },
        onRest: onClose
      });
    } else {
      api.start({ 
        x: active ? mx : 0,
        immediate: active,
        config: { tension: 200, friction: 25 }
      });
    }
  }, {
    axis: 'x',
    bounds: { left: isGeneralChat ? -400 : 0, right: isGeneralChat ? 0 : 400 },
    rubberband: true
  });

  const getPosition = () => {
    if (isGeneralChat) {
      return {
        left: '16px',
        bottom: '72px',
      };
    } else {
      return {
        right: '16px',
        bottom: '72px',
      };
    }
  };

  return (
    <animated.div 
      {...bind()}
      style={{ 
        ...getPosition(),
        x,
        position: 'fixed',
        touchAction: 'none'
      }}
      className="bg-black rounded-lg overflow-hidden shadow-lg border border-white/10 w-64 h-72 z-50"
    >
      <div className="flex justify-between items-center p-2 bg-black text-white border-b border-white/10">
        <span className="text-sm font-medium">
          {chatClub ? chatClub.name : 'General Chat'}
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 text-white hover:text-white/80"
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
                  <span className="text-xs text-white/70 mb-1">
                    {message.sender}
                  </span>
                  <div className="bg-white/10 text-white px-3 py-2 rounded-lg max-w-[80%] break-words">
                    <p className="text-xs">{message.text}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-black border-t border-white/10">
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
            className="flex-1 bg-white/5 border-none focus-visible:ring-0 text-white placeholder:text-white/50 text-xs h-7"
          />
          <Button 
            type="submit" 
            size="icon"
            variant="ghost"
            className="h-6 w-6 shrink-0 text-white hover:text-white/80"
          >
            <Send className="h-3 w-3" />
          </Button>
        </form>
      </div>
    </animated.div>
  );
}