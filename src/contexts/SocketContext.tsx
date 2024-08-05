import { createContext, useContext, useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { useUserIdContext } from './UserIdContext';
import notificationSound from '../assets/notification.mp3';
import { ChildrenType } from '../types/children-type';
import { MessageType } from '../types/message-type';

interface SocketContextType {
  socket: Socket | null;
  onlineUsers: string[];
}

const SocketContext = createContext<SocketContextType | null>(null);

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (context === null) {
    throw new Error('useSocketContext must be used within a SocketContextProvider');
  }
  return context;
};

export const SocketContextProvider = ({ children }: ChildrenType) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const { userId } = useUserIdContext();

  useEffect(() => {
    if (!userId) return;

    const socket = io(import.meta.env.VITE_BACKEND_URL, {
      query: {
        userId,
      },
    });

    setSocket(socket);

    socket.on('onlineUsers', (onlineUsers: string[]) => {
      setOnlineUsers(onlineUsers);
    });

    socket.on('messageNotification', (_: MessageType) => {
      const sound = new Audio(notificationSound);
      sound.play();
    });

    return () => {
      socket?.disconnect();
      socket?.removeListener('onlineUsers');
      socket?.removeListener('messageNotification');
    };
  }, [userId]);

  return <SocketContext.Provider value={{ socket, onlineUsers }}>{children}</SocketContext.Provider>;
};
