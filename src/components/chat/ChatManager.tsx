import { useState } from 'react';
import { Club, ChatMessage, ChatMessages } from '@/types/club';
import { ChatWindow } from './ChatWindow';

interface ChatManagerProps {
  selectedClub: Club | null;
}

export function ChatManager({ selectedClub }: ChatManagerProps) {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatClub, setChatClub] = useState<Club | null>(null);
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessages>({ general: [] });
  const [newMessageCounts, setNewMessageCounts] = useState<Record<number, number>>({});
  const [isGeneralChat, setIsGeneralChat] = useState(false);

  const toggleGeneralChat = () => {
    setChatOpen(prev => !prev);
    setIsGeneralChat(true);
    setChatClub(null);
    if (!chatMessages.general) {
      setChatMessages(prev => ({ ...prev, general: [] }));
    }
  };

  const openChat = (club: Club) => {
    setChatClub(club);
    setChatOpen(true);
    setIsGeneralChat(false);
    if (!chatMessages[club.id]) {
      setChatMessages(prev => ({ ...prev, [club.id]: [] }));
    }
    setNewMessageCounts(prev => ({ ...prev, [club.id]: 0 }));
  };

  const sendMessage = () => {
    if (chatMessage.trim() !== "") {
      const newMessage: ChatMessage = {
        sender: "You",
        text: chatMessage,
        timestamp: Date.now(),
        clubId: chatClub?.id || 'general'
      };

      if (isGeneralChat) {
        setChatMessages(prev => ({
          ...prev,
          general: [...(prev.general || []), newMessage]
        }));
      } else if (chatClub) {
        setChatMessages(prev => ({
          ...prev,
          [chatClub.id]: [...(prev[chatClub.id] || []), newMessage]
        }));
      }

      setChatMessage("");

      // Simulate a response
      setTimeout(() => {
        const responseMessage: ChatMessage = {
          sender: isGeneralChat ? "Club Pilot" : chatClub?.name || "",
          text: isGeneralChat ? "Welcome to the general chat! How can we assist you today?" : "Thanks for your message! The vibe is great tonight!",
          timestamp: Date.now(),
          clubId: chatClub?.id || 'general'
        };

        if (isGeneralChat) {
          setChatMessages(prev => ({
            ...prev,
            general: [...(prev.general || []), responseMessage]
          }));
        } else if (chatClub) {
          setChatMessages(prev => ({
            ...prev,
            [chatClub.id]: [...(prev[chatClub.id] || []), responseMessage]
          }));
          setNewMessageCounts(prev => ({
            ...prev,
            [chatClub.id]: (prev[chatClub.id] || 0) + 1
          }));
        }
      }, 1000);
    }
  };

  const allMessages = isGeneralChat
    ? (chatMessages.general || [])
    : (chatMessages[chatClub?.id || ''] || []);

  return {
    chatOpen,
    isGeneralChat,
    chatClub,
    chatMessage,
    allMessages,
    newMessageCounts,
    toggleGeneralChat,
    openChat,
    setChatMessage,
    sendMessage,
    setChatOpen
  };
}