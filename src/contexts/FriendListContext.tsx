import { createContext, useContext, useEffect, useState } from 'react';
import { ChildrenType } from '../types/children-type';
import { UserType } from '../types/user-type';
import { useUserIdContext } from './UserIdContext';
import { toast } from 'react-toastify';

interface FriendListContextType {
  friendList: UserType[];
  setFriendList: React.Dispatch<React.SetStateAction<UserType[]>>;
  pendingRequests: string[];
  setPendingRequests: React.Dispatch<React.SetStateAction<string[]>>;
  unAcceptedRequests: string[];
  setUnAcceptedRequests: React.Dispatch<React.SetStateAction<string[]>>;
  setIsNotificationPageOpened: React.Dispatch<React.SetStateAction<any>>;
}

const FriendListContext = createContext<FriendListContextType | null>(null);

export const useFriendListContext = () => {
  const context = useContext(FriendListContext);
  if (context === null) {
    throw new Error('useFriendListContext must be used within a FriendListContextProvider');
  }
  return context;
};

export const FriendListContextContextProvider = ({ children }: ChildrenType) => {
  const [friendList, setFriendList] = useState<UserType[]>([]);
  const [pendingRequests, setPendingRequests] = useState<string[]>([]);
  const [unAcceptedRequests, setUnAcceptedRequests] = useState<string[]>([]);
  const [isNotificationPageOpened, setIsNotificationPageOpened] = useState<any>(null);
  const { userId, setUserId } = useUserIdContext();
  const { token } = localStorage;

  const getFriendList = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/${userId}/friends`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const { formattedFriends, pendingRequests, unAcceptedRequests } = await response.json();
        setFriendList(formattedFriends);
        setPendingRequests(pendingRequests);
        setUnAcceptedRequests(unAcceptedRequests);
      } else if (response.status === 403) {
        toast.error('You need to re-login');
        localStorage.clear();
        setUserId(null);
      } else if (response.status === 404) {
        const { error } = await response.json();
        toast.error(error);
      } else {
        throw new Error('Something went wrong!');
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!userId || !token) return;
    getFriendList();
  }, [userId, isNotificationPageOpened]);

  return (
    <FriendListContext.Provider
      value={{
        friendList,
        setFriendList,
        pendingRequests,
        setPendingRequests,
        unAcceptedRequests,
        setUnAcceptedRequests,
        setIsNotificationPageOpened,
      }}
    >
      {children}
    </FriendListContext.Provider>
  );
};
