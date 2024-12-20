import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  sender: string;
  text: string;
}

interface ChatMessagesProps {
  messages: Message[];
}

export function ChatMessages({ messages }: ChatMessagesProps) {
  return (
    <ScrollArea className="flex-1 p-2 bg-black/40">
      <div className="space-y-2">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex flex-col ${
              message.sender === 'You' ? 'items-end' : 'items-start'
            }`}
          >
            <span className="text-[10px] text-white/70">
              {message.sender}
            </span>
            <div
              className={`rounded-lg px-2 py-1 text-xs max-w-[80%] ${
                message.sender === 'You'
                  ? 'bg-white/20 text-white'
                  : 'bg-white/10 text-white'
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}