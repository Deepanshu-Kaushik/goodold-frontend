import { NavigateFunction } from 'react-router-dom';

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

    if (response.status === 403) {
      return navigate('/login');
    } else if (!(response.status >= 200 && response.status <= 210)) {
      throw new Error('Something went wrong!');
    }
  } catch (error) {
    console.log(error);
  }
}
