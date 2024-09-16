import { NavigateFunction } from 'react-router-dom';
import { NotificationsType } from '../types/notifications-type';
import { toast } from 'react-toastify';

type OnDeleteNotificationType = {
  token: string;
  userId: string;
  navigate: NavigateFunction;
  setNotifications: React.Dispatch<React.SetStateAction<NotificationsType[]>>;
  notificationId: string;
};

export default async function onDeleteNotification({
  token,
  userId,
  navigate,
  setNotifications,
  notificationId,
}: OnDeleteNotificationType) {
  try {
    if (!token || !userId) return navigate('/login');
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/notification/${notificationId}/delete`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status >= 200 && response.status <= 210) {
      const data = await response.json();
      setNotifications(data);
      toast.success('Deleted notification successfully');
    } else if (response.status === 403) {
      toast.error('You need to re-login');
      return navigate('/login');
    } else {
      throw new Error('Something went wrong!');
    }
  } catch (error) {
    toast.error(error as string);
    console.log(error);
  }
}
