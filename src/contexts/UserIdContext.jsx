import { createContext, useContext, useState } from "react";

const UserIdContext = createContext(null);

export const useUserIdContext = () => {
  return useContext(UserIdContext);
};

export const UserIdContextProvider = ({ children }) => {
  const [userId, setUserId] = useState(localStorage.getItem("userId") || null);

  return (
    <UserIdContext.Provider value={{ userId, setUserId }}>
      {children}
    </UserIdContext.Provider>
  );
};
