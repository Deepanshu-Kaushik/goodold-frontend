import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { useUserIdContext } from "./UserIdContext";

const SocketContext = createContext(null);

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children, path }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { userId } = useUserIdContext();

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
    return () => {
      socket?.disconnect();
      socket?.removeListener("onlineUsers");
    };
  }, [userId]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
