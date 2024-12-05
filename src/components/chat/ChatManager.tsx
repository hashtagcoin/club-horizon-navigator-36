import { useState } from 'react';
import { Club, ChatMessage, ChatMessages } from '@/types/club';

export function useChatManager(selectedClub: Club | null) {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessages>({ general: [] });
  const [newMessageCounts, setNewMessageCounts] = useState<Record<number, number>>({});
  const [isGeneralChat, setIsGeneralChat] = useState(true);
  const [activeClubChat, setActiveClubChat] = useState<Club | null>(null);

  const toggleGeneralChat = () => {
    setChatOpen(prev => !prev);
    setIsGeneralChat(true);
    setActiveClubChat(null);
    if (!chatMessages.general) {
      setChatMessages(prev => ({ ...prev, general: [] }));
    }
  };

  const openChat = (club: Club) => {
    setChatOpen(true);
    setIsGeneralChat(false);
    setActiveClubChat(club);
    if (!chatMessages[club.id]) {
      setChatMessages(prev => ({ ...prev, [club.id]: [] }));
    }
  };

  const sendMessage = () => {
    if (chatMessage.trim() !== "") {
      const chatId = isGeneralChat ? 'general' : (activeClubChat?.id || 'general');
      const newMessage: ChatMessage = {
        sender: "You",
        text: chatMessage,
        timestamp: Date.now(),
        clubId: chatId
      };

      setChatMessages(prev => ({
        ...prev,
        [chatId]: [...(prev[chatId] || []), newMessage]
      }));

      setChatMessage("");

      // Simulate responses
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
          clubId: chatId
        };

        setChatMessages(prev => ({
          ...prev,
          [chatId]: [...(prev[chatId] || []), responseMessage]
        }));
      }, 1000);
    }
  };

  return {
    chatOpen,
    isGeneralChat,
    chatMessage,
    activeClubChat,
    allMessages: isGeneralChat ? (chatMessages.general || []) : (chatMessages[activeClubChat?.id || ''] || []),
    newMessageCounts,
    toggleGeneralChat,
    setChatMessage,
    sendMessage,
    setChatOpen,
    openChat
  };
}