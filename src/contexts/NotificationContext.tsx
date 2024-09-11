import { createContext, useContext, useEffect, useState } from 'react';
import { NotificationsType } from '../types/notifications-type';
import { ChildrenType } from '../types/children-type';
import { useUserIdContext } from './UserIdContext';
import getNotifications from '../services/get-notifications';
import { useFriendListContext } from './FriendListContext';

interface NotificationsContextType {
  notifications: NotificationsType[];
  setNotifications: React.Dispatch<React.SetStateAction<NotificationsType[]>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  unreadNotificationsCount: number;
  setLocation: React.Dispatch<React.SetStateAction<any>>;
}

const NotificationsContext = createContext<NotificationsContextType | null>(null);

export const useNotificationsContext = () => {
  const context = useContext(NotificationsContext);
  if (context === null) {
    throw new Error('useNotificationsContext must be used within a NotificationsContextProvider');
  }
  return context;
};

export const NotificationsContextProvider = ({ children }: ChildrenType) => {
  const [notifications, setNotifications] = useState<NotificationsType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { userId, setUserId } = useUserIdContext();
  const { token } = localStorage;
  const [location, setLocation] = useState<any>(null);
  const { setIsNotificationPageOpened } = useFriendListContext();
  let isNotificationPageOpened = false;
  if (location) isNotificationPageOpened = location.pathname === '/notifications';
  let unreadNotificationsCount = 0;
  if (notifications) {
    notifications.map((notification) => {
      if (!notification.notificationRead) unreadNotificationsCount += 1;
    });
  }

  useEffect(() => {
    if (!token || !userId) return;
    setLoading(true);
    getNotifications({
      userId,
      token,
      setNotifications,
      setLoading,
      setUserId,
    });
    setIsNotificationPageOpened(isNotificationPageOpened);
  }, [userId, isNotificationPageOpened]);

  return (
    <NotificationsContext.Provider
      value={{ notifications, setNotifications, loading, setLoading, unreadNotificationsCount, setLocation }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};
