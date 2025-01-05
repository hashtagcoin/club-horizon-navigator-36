import { Club } from '@/types/club';
import { ChatWindow } from './ChatWindow';

interface ChatContainerProps {
  chatOpen: boolean;
  isGeneralChat: boolean;
  chatManager: any;
  clubs: Club[];
}

export const ChatContainer = ({
  chatOpen,
  isGeneralChat,
  chatManager,
  clubs
}: ChatContainerProps) => {
  if (!chatOpen) return null;

  return (
    <>
      <ChatWindow
        isGeneralChat={isGeneralChat}
        chatClub={chatManager.activeClubChat}
        chatMessage={chatManager.chatMessage}
        setChatMessage={chatManager.setChatMessage}
        allMessages={chatManager.allMessages}
        onClose={() => chatManager.setChatOpen(false)}
        onSend={chatManager.sendMessage}
        clubs={clubs}
        messageOpacities={{}}
        chatScrollRef={null}
      />

      {clubs.map((club) => 
        chatManager.clubChats[club.id] && (
          <ChatWindow
            key={club.id}
            isGeneralChat={false}
            chatClub={club}
            chatMessage={chatManager.chatMessage}
            setChatMessage={chatManager.setChatMessage}
            allMessages={chatManager.getClubMessages(club.id)}
            onClose={() => chatManager.closeChat(club)}
            onSend={() => chatManager.sendMessage(club.id)}
            clubs={clubs}
            messageOpacities={{}}
            chatScrollRef={null}
          />
        )
      )}
    </>
  );
};