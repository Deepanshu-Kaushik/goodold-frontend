import { NavigateFunction } from 'react-router-dom';
import { NotificationsType } from '../types/notifications-type';

type OnClearAllNotificationsType = {
  token: string;
  userId: string;
  navigate: NavigateFunction;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setNotifications: React.Dispatch<React.SetStateAction<NotificationsType[]>>;
};

export default async function onClearAllNotifications({
  token,
  userId,
  navigate,
  setLoading,
  setNotifications,
}: OnClearAllNotificationsType) {
  setLoading(true);
  try {
    if (!token || !userId) return navigate('/login');
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/notification/${userId}/clear`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status >= 200 && response.status <= 210) {
      setNotifications([]);
    } else if (response.status === 403) {
      return navigate('/login');
    } else {
      throw new Error('Something went wrong!');
    }
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
}
