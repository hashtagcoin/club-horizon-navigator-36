import { useState } from 'react';
import { Club, ChatMessage, ChatMessages } from '@/types/club';
import { ChatWindow } from './ChatWindow';

interface ChatManagerProps {
  selectedClub: Club | null;
}

export function ChatManager({ selectedClub }: ChatManagerProps) {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessages>({ general: [] });
  const [newMessageCounts, setNewMessageCounts] = useState<Record<number, number>>({});
  const [isGeneralChat, setIsGeneralChat] = useState(true);

  const toggleGeneralChat = () => {
    setChatOpen(prev => !prev);
    setIsGeneralChat(true);
    if (!chatMessages.general) {
      setChatMessages(prev => ({ ...prev, general: [] }));
    }
  };

  const sendMessage = () => {
    if (chatMessage.trim() !== "") {
      const newMessage: ChatMessage = {
        sender: "You",
        text: chatMessage,
        timestamp: Date.now(),
        clubId: 'general'
      };

      setChatMessages(prev => ({
        ...prev,
        general: [...(prev.general || []), newMessage]
      }));

      setChatMessage("");

      // Simulate responses from other users
      setTimeout(() => {
        const users = ["Alice", "Bob", "Charlie"];
        const responses = [
          "Hey there! How's everyone doing tonight?",
          "The vibe is great here!",
          "Anyone heading to the club district later?"
        ];
        
        const responseMessage: ChatMessage = {
          sender: users[Math.floor(Math.random() * users.length)],
          text: responses[Math.floor(Math.random() * responses.length)],
          timestamp: Date.now(),
          clubId: 'general'
        };

        setChatMessages(prev => ({
          ...prev,
          general: [...(prev.general || []), responseMessage]
        }));
      }, 1000);
    }
  };

  return {
    chatOpen,
    isGeneralChat,
    chatMessage,
    allMessages: chatMessages.general || [],
    newMessageCounts,
    toggleGeneralChat,
    setChatMessage,
    sendMessage,
    setChatOpen
  };
}