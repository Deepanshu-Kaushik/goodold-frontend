import { createContext, useContext, useEffect, useState } from 'react';
import { ChildrenType } from '../types/children-type';
import { ConversationType } from '../types/conversation-type';
import { useUserIdContext } from './UserIdContext';
import { useSocketContext } from './SocketContext';
import { MessageNotificationType } from '../types/message-notification-type';
import { toast } from 'react-toastify';

interface ConversationsContextType {
  conversations: ConversationType[] | null;
  setConversations: React.Dispatch<React.SetStateAction<ConversationType[] | null>>;
  loading: boolean;
  unreadCountTotal: number;
}

const ConversationsContext = createContext<ConversationsContextType | null>(null);

export const useConversationsContext = () => {
  const context = useContext(ConversationsContext);
  if (context === null) {
    throw new Error('useConversationsContext must be used within a ConversationsContextProvider');
  }
  return context;
};

export const ConversationsContextProvider = ({ children }: ChildrenType) => {
  const [conversations, setConversations] = useState<ConversationType[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { token } = localStorage;
  const { userId } = useUserIdContext();
  const { socket } = useSocketContext();

  let unreadCountTotal = 0;
  if (conversations && userId) {
    conversations.map((convo) => {
      if (convo.numberOfUnread[userId]) unreadCountTotal += 1;
    });
  }

  async function getConversations() {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/message/conversations/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      const data = await response.json();
      setConversations(data);
    } else if (response.status === 403) {
      toast.error('You need to re-login');
      localStorage.clear();
      return;
    } else if (response.status === 404) {
      const { error } = await response.json();
      toast.error(error);
    } else {
      throw new Error('Something went wrong!');
    }
  }

  useEffect(() => {
    if (!userId || !token) return;

    !(async () => {
      setLoading(true);
      try {
        await getConversations();
      } catch (error) {
        console.log(error);
      }
      setLoading(false);

      if (!socket) return;
      socket.on('messageNotification', ({ newMessage, senderData: _ }: MessageNotificationType) => {
        setConversations((prev) => {
          const updatedConversations =
            prev?.map((convo) => {
              if (convo.participants._id === newMessage.senderId) {
                if (newMessage.message) convo.latestMessage = newMessage.message;
                convo.numberOfUnread[newMessage.receiverId] += 1;
              }
              return convo;
            }) || null;
          return updatedConversations;
        });
      });

      return () => {
        socket.removeListener('chatRoomMessage');
      };
    })();
  }, [token, userId, socket]);

  return (
    <ConversationsContext.Provider value={{ conversations, setConversations, loading, unreadCountTotal }}>
      {children}
    </ConversationsContext.Provider>
  );
};
