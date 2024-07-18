import { createContext, useContext, useState } from "react";

const NewMessageContext = createContext(false);

export const useNewMessageContext = () => {
  return useContext(NewMessageContext);
};

export const NewMessageContextProvider = ({ children }) => {
  const [newMessage, setNewMessage] = useState(null);

  return (
    <NewMessageContext.Provider value={{ newMessage, setNewMessage }}>
      {children}
    </NewMessageContext.Provider>
  );
};
