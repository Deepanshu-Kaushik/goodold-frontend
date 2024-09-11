import { NavigateFunction } from 'react-router-dom';

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

    if (response.status === 403) {
      return navigate('/login');
    } else if (!(response.status >= 200 && response.status <= 210)) {
      throw new Error('Something went wrong!');
    }
  } catch (error) {
    console.log(error);
  }
}
