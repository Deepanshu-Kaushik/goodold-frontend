import { NavigateFunction } from 'react-router-dom';
import { NotificationsType } from '../types/notifications-type';
import { toast } from 'react-toastify';

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
      toast.success('Cleared notifications successfully');
    } else if (response.status === 403) {
      toast.error('You need to re-login');
      return navigate('/login');
    } else {
      throw new Error('Something went wrong!');
    }
  } catch (error) {
    toast.error(error as string);
    console.log(error);
  } finally {
    setLoading(false);
  }
}
