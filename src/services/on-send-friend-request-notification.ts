import { NavigateFunction } from 'react-router-dom';
import { toast } from 'react-toastify';

type OnSendFriendRequestNotificationType = {
  token: string;
  userId: string;
  navigate: NavigateFunction;
  friendId: string | undefined;
};

export default async function onSendFriendRequestNotification({
  token,
  userId,
  navigate,
  friendId,
}: OnSendFriendRequestNotificationType) {
  try {
    if (!token || !userId) return navigate('/login');
    if (!friendId || userId === friendId) return;
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/notification/friend-request`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: friendId,
        createrId: userId,
      }),
    });

    if (response.status === 404) {
      const { error } = await response.json();
      throw error;
    } else if (response.status === 403) {
      toast.error('You need to re-login');
      return navigate('/login');
    } else if (!(response.status >= 200 && response.status <= 210)) {
      throw new Error('Something went wrong!');
    }
  } catch (error) {
    toast.error(error as string);
    console.log(error);
  }
}
