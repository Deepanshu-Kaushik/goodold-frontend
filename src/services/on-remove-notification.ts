import { NavigateFunction } from 'react-router-dom';

type OnRemoveNotificationType = {
  token: string;
  userId: string;
  navigate: NavigateFunction;
  postOwnerId?: string | undefined;
  friendId?: string | undefined;
  postId?: string | undefined;
  typeOfNotification: string;
};

export default async function onRemoveNotification({
  token,
  userId,
  navigate,
  postOwnerId,
  friendId,
  postId,
  typeOfNotification,
}: OnRemoveNotificationType) {
  try {
    if (!token || !userId) return navigate('/login');
    let body;
    if (typeOfNotification !== 'friend-request') {
      if (!postId || !postOwnerId || userId === postOwnerId) return;
      body = {
        userId: postOwnerId,
        createrId: userId,
        postId,
        typeOfNotification,
      };
    } else {
      if (!friendId) return;
      body = {
        userId: friendId,
        createrId: userId,
        typeOfNotification,
      };
    }
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/notification/remove`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (response.status === 403) {
      return navigate('/login');
    } else if (!(response.status >= 200 && response.status <= 210)) {
      const { error } = await response.json();
      throw error;
    }
  } catch (error) {
    console.log(error);
  }
}
