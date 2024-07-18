import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { useUserIdContext } from "./UserIdContext";
import { useNewMessageContext } from "./NewMessageContext";
import notificationSound from "../assets/notification.mp3";

const SocketContext = createContext(null);

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { userId } = useUserIdContext();
  const { setNewMessage } = useNewMessageContext();

  useEffect(() => {
    if (!userId) return;
    const socket = io(import.meta.env.VITE_BACKEND_URL, {
      query: {
        userId,
      },
    });

    setSocket(socket);
    socket.on("onlineUsers", (onlineUsers) => {
      setOnlineUsers(onlineUsers);
    });

    socket.on("messageNotification", (message) => {
      const sound = new Audio(notificationSound);
      sound.play();
      setNewMessage(message);
    });

    return () => {
      socket?.disconnect();
      socket?.removeListener("onlineUsers");
      socket?.removeListener("messageNotification");
    };
  }, [userId]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
