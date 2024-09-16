import { NavigateFunction } from 'react-router-dom';
import { toast } from 'react-toastify';

type OnSendLikeNotificationType = {
  token: string;
  userId: string;
  navigate: NavigateFunction;
  postOwnerId: string | undefined;
  postId: string | undefined;
};

export default async function onSendLikeNotification({
  token,
  userId,
  navigate,
  postOwnerId,
  postId,
}: OnSendLikeNotificationType) {
  try {
    if (!token || !userId) return navigate('/login');
    if (!postOwnerId || !postId || userId === postOwnerId) return;
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/notification/like`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: postOwnerId,
        createrId: userId,
        postId,
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
