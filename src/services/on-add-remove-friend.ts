import { NavigateFunction } from 'react-router-dom';
import { UserType } from '../types/user-type';
import { NotificationsType } from '../types/notifications-type';

type onAddRemoveFriendType = {
  friendId: string | undefined;
  token: string;
  navigate: NavigateFunction;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  userId: string | undefined;
  setUserFriendList: React.Dispatch<React.SetStateAction<UserType[]>>;
  setNotifications?: React.Dispatch<React.SetStateAction<NotificationsType[]>>;
};

async function onAddRemoveFriend({
  friendId,
  userId,
  token,
  navigate,
  setLoading,
  setUserFriendList,
  setNotifications,
}: onAddRemoveFriendType) {
  if (userId === friendId) return;
  if (!token || !userId) return navigate('/login');
  setLoading(true);

  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/${userId}/${friendId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status >= 200 && response.status <= 210) {
      const data = await response.json();
      setUserFriendList(data.formattedFriends);
      if (setNotifications)
        setNotifications((prev) =>
          prev.map((notification) => (notification._id === data.notification._id ? data.notification : notification)),
        );
      return data.removed;
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

export default onAddRemoveFriend;
