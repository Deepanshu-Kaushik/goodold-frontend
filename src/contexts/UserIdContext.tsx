import { createContext, useContext, useEffect, useState } from 'react';
import { ChildrenType } from '../types/children-type';

interface UserIdContextType {
  userId: string | null;
  setUserId: React.Dispatch<React.SetStateAction<string | null>>;
}

const UserIdContext = createContext<UserIdContextType | null>(null);

export const useUserIdContext = () => {
  const context = useContext(UserIdContext);
  if (context === null) {
    throw new Error('useUserIdContext must be used within a UserIdContextProvider');
  }
  return context;
};

export const UserIdContextProvider = ({ children }: ChildrenType) => {
  const [userId, setUserId] = useState<string | null>(localStorage.getItem('userId') || null);
  useEffect(() => {
    if (Notification.permission !== 'granted') Notification.requestPermission();
  }, [userId]);

  return <UserIdContext.Provider value={{ userId, setUserId }}>{children}</UserIdContext.Provider>;
};
